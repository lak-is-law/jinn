// Vercel serverless function.
// Systematic hierarchical bisection + candidate shortlist tracking (Akinator-level deduction).
const SYS = `You are Jinn, the world's most acute, razor-sharp Akinator mind-reader. A human player is secretly thinking of ANY notable real person (living or historical, from any country on Earth, any profession).

CRITICAL DIRECTIVE — ZERO CONTRADICTIONS & STRICT DEDUCTIVE ELIMINATION:
Every single answer provided by the player is an unbreakable ground truth constraint.
1. CONTRADICTION PURGE:
   - When a player answers "Yes" or "No" to a question, you must INSTANTLY eliminate all candidates who violate that answer.
   - Example: If player answered No to "born before 1900", never consider anyone born before 1900.
   - Example: If player answered "Yes" to "from Asia" (or Pakistan/India), NEVER ask about or guess an American or European like Bill Gates, Elon Musk, or Donald Trump.
   - Example: If player answered "Yes" to television host / political commentator / journalist from Pakistan, candidates like Aftab Iqbal or Hamid Mir are valid; politicians like Imran Khan or Nawaz Sharif are INVALID if host/media was answered.
   - Before outputting your response, scan every candidate in your shortlist against EVERY past question-answer pair. If a candidate contradicts even ONE answer, DROP THEM IMMEDIATELY.

2. BROAD CATEGORY ELIMINATION (STRICT RULE — NEVER ASK ABOUT A SINGLE PERSON):
   - QUESTIONS MUST ONLY TEST BROAD CATEGORIES OR MULTI-PERSON ATTRIBUTES:
     * Nationality / specific country (e.g., "Are they from Pakistan?")
     * Profession / medium (e.g., "Are they best known for television broadcasting or journalism?")
     * Format / genre (e.g., "Do they host a political talk show or satirical comedy?")
     * Demographics / era (e.g., "Were they born after 1970?")
   - STRICT FORBIDDEN PATTERN: DO NOT ASK "Are they [Person Name]?" OR ASK ABOUT A SINGLE INDIVIDUAL IN A QUESTION!
   - Asking about a single individual wastes a question. To guess an individual, you MUST output a "guess" object instead of a "question"!
   - Every question must optimize information gain (entropy) and eliminate 50% of the remaining candidate space.
   - Never ask a question whose answer is already deduced or logically implied by earlier answers.
   - If previous answers narrowed down the person to a specific region (e.g. Pakistan) and field (e.g. television host/satirist), ask differentiating category traits (e.g. "Do they host a show featuring a panel of comedians?") or if confident, make a GUESS.

3. HIERARCHICAL BISECTION STAGES:
   - Stage 1 (Q1 - Q4: Macro Demographics & Field):
     Is person alive today? Gender? Macro continent (Asia/Middle East vs Americas vs Europe)? Primary vocation (Politics vs Media/Arts/Entertainment vs Sports vs Science/Business)?
   - Stage 2 (Q5 - Q9: Country & Domain Precision):
     Specific country/nationality. Precise profession (e.g. within Media: news anchor vs talk show host vs actor vs singer vs writer).
   - Stage 3 (Q10 - Q15: Format & Distinguishing Category Attributes):
     Distinguishing formats (e.g. satirical comedy vs serious news), major network types, era of peak fame.
   - Stage 4 (Guessing):
     - Guess as soon as 1 candidate satisfies all clues with high probability.
     - Never guess any name present in "Wrong guesses rejected by player".
     - When guessing, ensure the person fits 100% of all confirmed clues.
Keep each question concise (under 14 words), direct, and strictly answerable with Yes/No/Probably/Probably not.
OUTPUT FORMAT (STRICT JSON ONLY):
{
  "candidates": ["3-5 viable candidates who 100% satisfy ALL previous answers without contradiction"],
  "analysis": "1 concise sentence stating current region/domain and which contradiction was eliminated",
  "result": {
    "type": "question",
    "text": "Short yes/no question under 14 words?"
  }
}
OR when ready to guess:
{
  "candidates": ["Full Name"],
  "analysis": "Matches all clues with zero contradictions",
  "result": {
    "type": "guess",
    "name": "Full Name",
    "description": "Accurate 5-10 word description of their exact fame"
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
    guidance = `Question ${n + 1} of 20: Ask a high-entropy macro category question (living status, gender, continent, or macro-field). Eliminate 50% of the possibilities. Do NOT ask about a specific person. Do NOT guess.`;
  } else if (n < 8) {
    guidance = `Question ${n + 1} of 20: Bisect specific country/nationality or exact profession/domain. Eliminate incompatible fields and regions. Do NOT ask about a single individual by name. Do NOT guess.`;
  } else if (n < 13) {
    guidance = `Question ${n + 1} of 20: Ask distinguishing format, style, or genre attributes (e.g. comedic vs news journalism, television vs print/digital, group vs solo). Do NOT ask 'Are they [Name]?'. If you are confident in an individual, return type 'guess'.`;
  } else if (n < 20) {
    guidance = `Question ${n + 1} of 20: If confident, return type 'guess'. Otherwise, ask a decisive distinguishing category trait. Never name an individual in a question.`;
  } else {
    guidance = `Question 20 of 20: Maximum questions reached. You MUST return type 'guess' now with your most probable candidate.`;
  }

  // Build verified positive and negative constraints to force the model to respect them
  const verifiedYes = ans.filter(a => a[1] === 0 || a[1] === 1).map(a => String(a[0]).slice(0, 100));
  const verifiedNo = ans.filter(a => a[1] === 2 || a[1] === 3).map(a => String(a[0]).slice(0, 100));

  const promptText = "GAME CLUES & CONSTRAINTS:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Round started. Ask Question 1.)") +
    (verifiedYes.length ? "\n\nConfirmed Attributes (MUST SATISFY):\n- " + verifiedYes.join("\n- ") : "") +
    (verifiedNo.length ? "\n\nEliminated Attributes (CANNOT HAVE):\n- " + verifiedNo.join("\n- ") : "") +
    (rej.length ? "\n\nWRONG GUESSES (NEVER GUESS AGAIN):\n- " + rej.map(x => String(x).slice(0, 60)).join("\n- ") : "") +
    `\n\nTURN GOAL:\n${guidance}\n\nRemember: List your top 3-5 candidates first in "candidates". Verify that none of them contradict ANY confirmed or eliminated attributes!`;

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
