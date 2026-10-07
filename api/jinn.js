// Vercel serverless function.
// Systematic hierarchical bisection + candidate shortlist tracking (Akinator-level deduction).
const SYS = `You are Jinn, the legendary Akinator mind-reader. A player is secretly thinking of ANY famous or historical real person (living or dead, worldwide, any discipline).

HOW AKINATOR ACTUALLY WORKS (HIERARCHICAL BISECTION):
You must systematically eliminate 50% of the world on each question:
Phase 1 (Q1 to Q4 - Foundations):
- Living or Deceased?
- Male or Female?
- Primary Field: Arts & Entertainment (music, acting, writing) vs Athletics vs Politics & Leadership vs Science, Tech & Business?
- Geography: Western (Americas/Europe) vs Eastern/Global South (Asia, Africa, Middle East)?

Phase 2 (Q5 to Q10 - Domain Drilldown):
- Drill into their specific niche (e.g., if Sports: soccer vs basketball vs cricket; if Arts: actor vs musician vs painter; if Tech/Business: founder vs CEO; if Politics: head of state vs activist).
- Country of origin/nationality.
- Era/Decade of prime fame.

Phase 3 (Q11 to Q16 - Signature Isolation):
- Specific iconic milestones, signature titles, awards (Oscar, Ballon d'Or, Nobel, Grammy), or famous associations that separate the top candidates.

Phase 4 (Guessing):
- DO NOT guess until you have verified their unique signature accomplishment and are down to 1 definitive candidate.
- Never guess before Question 8 unless the player answered Yes to a rare, unmistakable fact.
- At Question 20, you MUST make a guess.
- ZERO CONTRADICTIONS: Every candidate and guess must 100% satisfy every single answered question.
- FORBIDDEN NAMES: Never guess any name listed under "Wrong guesses rejected by player".

Keep each question short (under 14 words) and strictly yes/no.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "candidates": ["3-5 matching candidate names who fit ALL previous answers"],
  "analysis": "Short 1-sentence thought on how to separate them",
  "result": {
    "type": "question",
    "text": "Short yes/no question under 14 words?"
  }
}
OR when ready to guess:
{
  "candidates": ["Full Name"],
  "analysis": "Matches all criteria uniquely",
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
        maxOutputTokens: 500
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

  let guidance = "";
  if (n < 4) {
    guidance = `Question ${n + 1} of 20: Ask a high-entropy foundational question (alive today, gender, primary macro-field, or continent). Do NOT guess.`;
  } else if (n < 8) {
    guidance = `Question ${n + 1} of 20: Drill into specific craft, country, or era. Do NOT guess.`;
  } else if (n < 15) {
    guidance = `Question ${n + 1} of 20: Target distinguishing milestones, iconic titles, or records. Guess only if 1 single candidate remains.`;
  } else if (n < 20) {
    guidance = `Question ${n + 1} of 20: If you have a clear candidate in mind, make your guess. Otherwise, ask a decisive distinguishing question.`;
  } else {
    guidance = `Question 20 of 20: You MUST guess now.`;
  }

  const promptText = "Current Game State:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Round started. Ask Question 1.)") +
    (rej.length ? "\nWrong guesses rejected by player (NEVER GUESS THESE): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nTurn Goal:\n${guidance}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const parsed = await callGemini(model, promptText, apiKey);
      const out = parsed?.result || (parsed?.type ? parsed : null);
      if (out && (out.type === "question" || out.type === "guess")) {
        if (n < 7 && out.type === "guess") {
          continue; // Prevent jumping to conclusions too early
        }
        return res.status(200).setHeader("content-type", "application/json").send(JSON.stringify(out));
      }
    } catch (e) {
      console.warn(e.message);
    }
  }

  res.status(502).json({ error: "All AI models currently busy" });
}
