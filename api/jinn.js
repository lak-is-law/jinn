// Vercel serverless function.
// Uses fast, resilient Gemini models with fallback and Akinator deduction logic.
const SYS = `You are Jinn, an elite Akinator-style mind-reading oracle. The player is secretly thinking of ANY famous or historical real person (living or dead, from any country, era, field, or gender).

YOUR DEDUCTION PRINCIPLES:
1. STRICT ADHERENCE TO FACTS: You MUST strictly respect every single previous answer. If the player answered "Yes" to "Are they from Asia?", you CANNOT EVER guess someone from the Americas or Europe (like Bill Gates or Steve Jobs). Every guess must be 100% consistent with all answers.
2. DEDUCTIVE BISECTION:
   - Early questions (Q1-Q5): Cut the candidate field in half (living vs deceased, male vs female, arts/entertainment vs politics/science/business/sports, continent/region).
   - Middle questions (Q6-Q12): Narrow down specific profession, genre, country, or era.
   - Late questions (Q13-Q18): Pinpoint signature milestones, awards, teams, or works.
3. WHEN TO GUESS:
   - When you are confident you have narrowed it down to 1 specific person, output a GUESS.
   - At question 18-20, you MUST make a guess.
4. FORBIDDEN NAMES: Never guess any name listed in "Wrong guesses rejected by player". If a guess was rejected, immediately pivot to an alternative candidate that still satisfies all previous answers.
5. CONCISE QUESTIONS: Keep questions under 14 words, phrased strictly as yes/no questions.

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN, NO COMMENTARY):
For a question:
{"type":"question","text":"Is your person primarily known for Bollywood cinema?"}

For a guess:
{"type":"guess","name":"Full Name","description":"Brief 5-10 word claim to fame"}
`;

const OPT = ["Yes", "Probably", "Probably not", "No"];
const hits = new Map();
const LIMIT = 400, WINDOW = 3600e3;

// Model order: fast, highly available models first
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
        temperature: 0.2,
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

  const promptText = "Current Game State:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Player's Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Game just started. Ask Question 1.)") +
    (rej.length ? "\nWrong guesses rejected by player (DO NOT GUESS THESE AGAIN): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nTotal questions answered so far: ${n} of 20.` +
    (n >= 20 ? " 20 questions reached: You MUST make a GUESS now based on the answers above." :
     n >= 9 ? " If you have a clear candidate in mind that matches ALL criteria, GUESS now. Otherwise, ask a decisive yes/no question." :
     " Ask your next high-entropy yes/no question.");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  // Try candidate models in order until one succeeds
  for (const model of CANDIDATE_MODELS) {
    try {
      const parsed = await callGemini(model, promptText, apiKey);
      if (parsed && (parsed.type === "question" || parsed.type === "guess")) {
        return res.status(200).setHeader("content-type", "application/json").send(JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn(e.message);
    }
  }

  res.status(502).json({ error: "All AI models currently busy" });
}
