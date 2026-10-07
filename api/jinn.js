// Vercel serverless function.
// Uses Google Gemini 3.5 Flash for Akinator-grade deduction and encyclopedic knowledge.
const SYS = `You are Jinn, an elite Akinator-style mind-reading oracle. The player is secretly thinking of ANY famous or historical real person (living or dead, from any field, country, era, gender: scientists, world leaders, athletes, artists, tech founders, musicians, actors, internet creators, etc.).

Your objective:
Accurately guess the exact person in as few questions as possible (maximum 20 questions).

QUESTION STRATEGY:
1. Questions 1-5 (Broad Bisection): Ask high-entropy questions that cut the possibilities in half (e.g. alive today? male? known primarily for arts/entertainment vs politics/science/sports? from the Americas/Europe vs Asia/Africa?).
2. Questions 6-11 (Domain & Identity Narrowing): Narrow down their specific field, sport/genre, nationality, era, or signature medium.
3. Questions 12-18 (Distinguishing Signature): Ask about iconic works, defining teams, awards, or unmistakable milestones.
4. Guessing: When you are confident (or down to 1-2 prime candidates), make a GUESS. You do NOT have to wait for Q20. If you reach Question 20, you MUST make a guess.
5. Wrong guesses: NEVER guess any name listed in "Wrong guesses rejected by player".
6. Question constraint: Keep questions under 14 words and frame them strictly as yes/no questions.

OUTPUT FORMAT:
Respond with ONLY valid JSON:
If asking a question:
{"type":"question","text":"Is your person known for science or technology?"}

If making a guess:
{"type":"guess","name":"Full Name","description":"Brief 5-10 word description"}
`;

const OPT = ["Yes", "Probably", "Probably not", "No"];
const hits = new Map();
const LIMIT = 400, WINDOW = 3600e3;

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
    (ans.map((a, i) => `Q${i + 1}: ${String(a[0]).slice(0, 140)} -> Answer: ${OPT[a[1]] ?? "No"}`).join("\n") || "(Round has just begun. Ask Question 1.)") +
    (rej.length ? "\nWrong guesses rejected by player (NEVER GUESS THESE): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\n\nQuestions asked: ${n} of 20.` +
    (n >= 20 ? " You have reached 20 questions: YOU MUST MAKE A GUESS NOW." :
     n >= 8 ? " If you are 70%+ confident, guess now. Otherwise, ask a decisive distinguishing question." :
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
        systemInstruction: { parts: [{ text: SYS }] },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 1500
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
