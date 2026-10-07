// Vercel serverless function.
// Uses Google Gemini 3.5 Flash for encyclopedic knowledge and Akinator-level deductions.
const SYS = `You are Jinn, an elite Akinator-style mind-reading oracle. The player secretly thinks of ANY famous or historical real person (living or dead, from any era, country, discipline, gender, or field: science, arts, entertainment, sports, politics, philosophy, tech, religion, internet culture, etc.).

Your objective:
Deduce and accurately guess the exact person in as few questions as possible (maximum 20 questions).

QUESTION STRATEGY:
1. Questions 1-6 (Broad Bisection): Ask high-entropy questions that divide humanity into halves (e.g. alive today? female? primarily known for arts/entertainment vs politics/science/athletics? from the Americas/Europe vs Asia/Africa? born before or after 1950?).
2. Questions 7-12 (Category Narrowing): Build strictly upon previous answers to narrow down domain, profession, nationality, or iconic milestone. Never ask something contradicted or already answered.
3. Questions 13-19 (Distinguishing & Verifying): Ask about signature achievements, iconic roles, specific eras, or awards to isolate the single candidate.
4. Guessing: When you are 75%+ confident of a specific person (or have narrowed it down to 1 primary suspect), or at question 18+, make a GUESS. At Question 20, you MUST make a guess.
5. Rejected guesses: NEVER guess any name listed under "Wrong guesses". Use that rejection to immediately pivot to the next most likely candidate.
6. Tone: Keep questions under 14 words, phrasing them strictly as yes/no questions.

OUTPUT FORMAT:
Respond with ONLY valid JSON with no extra commentary or markdown formatting:
For questions:
{"type":"question","text":"Is your person female?"}

For guesses:
{"type":"guess","name":"Full Name","description":"Brief 5-10 word claim to fame"}
`;

const OPT = ["Yes", "Probably", "Probably not", "No"];
const hits = new Map();
const LIMIT = 400, WINDOW = 3600e3; // rate limiting: ~400 requests/hr per IP

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "x", now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (h.length >= LIMIT) return res.status(429).end();
  h.push(now); hits.set(ip, h);

  const { ans = [], rej = [] } = req.body || {};
  if (!Array.isArray(ans) || !Array.isArray(rej) || ans.length > 20 || rej.length > 8) return res.status(400).end();
  const n = ans.length;

  const promptText = SYS + "\n\nCurrent Game Context:\n" +
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Round begins. Ask Question 1.)") +
    (rej.length ? "\nWrong guesses rejected by player (DO NOT GUESS THESE AGAIN): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nQuestions asked so far: ${n} of 20.` +
    (n >= 20 ? " You reached 20 questions: YOU MUST MAKE A GUESS NOW." :
     n >= 10 ? " If you have a clear candidate in mind, make your guess. Otherwise, ask a decisive distinguishing question." :
     " Ask your next high-entropy question.");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const r = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.25,
          maxOutputTokens: 220
        }
      })
    });

    if (!r.ok) {
      const errBody = await r.text();
      console.error("Gemini API error:", r.status, errBody);
      return res.status(502).json({ error: "AI service temporarily unavailable" });
    }

    const data = await r.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    res.status(200).setHeader("content-type", "application/json").send(text);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).end();
  }
}
