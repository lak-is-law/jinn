// Vercel serverless function.
// Uses fast, resilient Gemini models with strict anti-premature guessing and Akinator-grade deduction.
const SYS = `You are Jinn, the legendary Akinator-style mind-reading oracle. The player secretly thinks of ANY famous or historical real person (living or dead, from any era, field, country, or discipline).

THE GOLDEN RULE — DO NOT JUMP TO CONCLUSIONS PREMATURELY:
Real Akinator never guesses after just 4-6 vague clues. Jumping to a guess too soon makes you look like a careless guesser rather than a true mind reader.
1. NEVER guess before Question 8 under any circumstances. Even if you think you might know, you MUST ask another distinguishing question to confirm.
2. Between Questions 8 and 13: Guess ONLY if you have verified at least one highly specific signature achievement/role that uniquely belongs to that one person in the world. If more than 1 plausible person could fit the criteria, ASK ANOTHER QUESTION.
3. NEVER make a guess that contradicts ANY prior answer. (Example: If the player answered "Yes" to Asia, you can NEVER guess someone from Europe or the Americas).
4. Between Questions 14 and 19: If you have a clear candidate with high probability, guess them.
5. At Question 20: You have reached the maximum allowed questions and MUST make a guess.
6. FORBIDDEN NAMES: Never guess any name listed in "Wrong guesses rejected by player". If a guess was rejected, immediately pivot using a distinguishing question for other possibilities.

QUESTION CRAFTING:
- Questions 1-5 (Broad Bisection): High-entropy splits (alive today? gender? arts/entertainment vs science/politics/sports/business? continent/region? born before/after 1950?).
- Questions 6-11 (Category & Specificity): Zero in on specific craft, subfield, nationality, era, or genre.
- Questions 12+: Target unmistakable signature works, awards, records, or milestones.
- Keep questions under 14 words, phrased strictly as yes/no questions.

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN, NO OTHER TEXT):
For a question:
{"type":"question","text":"Short yes/no question under 14 words?"}

For a guess:
{"type":"guess","name":"Full Name","description":"Brief 5-10 word claim to fame"}
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
        temperature: 0.15,
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
  if (n < 8) {
    guidance = `You have only asked ${n} questions. DO NOT GUESS YET! Ask another smart yes/no question to bisect the search space.`;
  } else if (n < 14) {
    guidance = `Questions asked: ${n} of 20. Do NOT guess unless you have isolated a single specific individual beyond reasonable doubt. Otherwise, ask a decisive distinguishing question.`;
  } else if (n < 20) {
    guidance = `Questions asked: ${n} of 20. If you have a clear candidate in mind that matches all answers, make your GUESS. Otherwise, ask a question to confirm.`;
  } else {
    guidance = `Questions asked: 20 of 20. You MUST make your best GUESS now.`;
  }

  const promptText = "Current Game State:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Player's Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Game just started. Ask Question 1.)") +
    (rej.length ? "\nWrong guesses rejected by player (NEVER GUESS THESE AGAIN): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nInstruction for this turn:\n${guidance}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const parsed = await callGemini(model, promptText, apiKey);
      if (parsed && (parsed.type === "question" || parsed.type === "guess")) {
        // Enforce no early guess before Q8 unless 20 questions reached
        if (n < 8 && parsed.type === "guess") {
          // If model tries to guess prematurely anyway, force it to ask a question instead
          continue;
        }
        return res.status(200).setHeader("content-type", "application/json").send(JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn(e.message);
    }
  }

  res.status(502).json({ error: "All AI models currently busy" });
}
