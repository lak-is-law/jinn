// Vercel serverless function.
// Uses chain-of-thought candidate tracking so Jinn reasons methodically like real Akinator.
const SYS = `You are Jinn, the master Akinator mind-reader. A player is secretly thinking of ANY famous or historical real person (living or dead, from any field, country, or era).

YOUR REASONING PROCESS:
You MUST maintain internal candidate hypotheses on every single turn.
1. "candidates": Identify the top 3 to 6 real people who STRICTLY match ALL previous answers. Never include anyone who contradicts even one answer (e.g. if alive today = No, never include living people; if Asia = Yes, never include Western figures).
2. "analysis": Briefly state how you can distinguish between these candidates.
3. "result":
   - If 2 or more candidates remain: Choose the single best yes/no question that roughly splits the candidate list in half (50/50 bisection). Keep question under 14 words.
   - If ONLY 1 clear candidate remains with >=90% certainty (or at question 20): Output a GUESS.
   - Under Question 6: Always ask a question to narrow down unless the player has answered multiple hyper-specific milestone clues.
   - FORBIDDEN NAMES: Never include or guess any name in "Wrong guesses rejected by player".

OUTPUT JSON SCHEMA:
{
  "candidates": ["Person A", "Person B", "Person C"],
  "analysis": "Short 1-sentence thought on what separates them",
  "result": {
    "type": "question",
    "text": "Short yes/no question under 14 words?"
  }
}
OR when guessing:
{
  "candidates": ["Person A"],
  "analysis": "Only Person A uniquely matches all clues",
  "result": {
    "type": "guess",
    "name": "Full Name",
    "description": "Short 5-10 word claim to fame"
  }
}
`;

const OPT = ["Yes", "Probably", "Probably not", "No"];
const hits = new Map();
const LIMIT = 400, WINDOW = 3600e3;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash"
];

async function callGemini(model, promptText, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      systemInstruction: { parts: [{ text: SYS }] },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 600
      }
    })
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Model ${model} failed with ${r.status}: ${err.slice(0, 100)}`);
  }
  const data = await r.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  return JSON.parse(text);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "x", now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (h.length >= LIMIT) return res.status(429).end();
  h.push(now); hits.set(ip, h);

  const { ans = [], rej = [] } = req.body || {};
  if (!Array.isArray(ans) || !Array.isArray(rej) || ans.length > 20 || rej.length > 8) return res.status(400).end();
  const n = ans.length;

  const promptText = "Current Game State:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Game just started. Ask Question 1 to bisect the search space.)") +
    (rej.length ? "\nWrong guesses rejected by player (NEVER GUESS THESE): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nTotal questions answered: ${n} of 20.` +
    (n >= 20 ? " Maximum questions reached: You MUST output a guess now." : "");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const parsed = await callGemini(model, promptText, apiKey);
      // Support both new structured result and fallback flat result
      const out = parsed?.result || (parsed?.type ? parsed : null);
      if (out && (out.type === "question" || out.type === "guess")) {
        // Guardrail: don't guess before Q5 unless max questions reached
        if (n < 5 && out.type === "guess") {
          continue;
        }
        return res.status(200).setHeader("content-type", "application/json").send(JSON.stringify(out));
      }
    } catch (e) {
      console.warn(e.message);
    }
  }

  res.status(502).json({ error: "All AI models currently busy" });
}
