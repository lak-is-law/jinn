// Vercel serverless function. The API key never leaves the server.
// Env: ANTHROPIC_API_KEY. The prompt is built HERE so the endpoint can only play Jinn.
const SYS = `You are the Jinn, an Akinator-style mind-reading game. The player secretly thinks of a real person (famous or historical, remarkable in their field; any country, era or field, including women and non-Western figures). Ask ONE yes/no question at a time to identify them. Player answers: Yes, Probably, Probably not, No. Maximum 20 questions. Start broad (alive? gender? field? region? era?), then narrow cleverly using earlier answers; never repeat or ask something already implied; treat Probably/Probably not as soft evidence, and tolerate a possibly mistaken answer. Keep each question under 14 words. When reasonably sure, or at question 20, guess a specific person. Never guess a name from the wrong-guess list. Reply ONLY with JSON: {"type":"question","text":"..."} or {"type":"guess","name":"Full Name","description":"max 10 words"}.`;
const OPT = ["Yes", "Probably", "Probably not", "No"];
const hits = new Map(); // per-IP counter; in-memory only. Use Upstash/Vercel KV for real limits.
const LIMIT = 400, WINDOW = 3600e3; // ~20 games/hour/IP

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "x", now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (h.length >= LIMIT) return res.status(429).end();
  h.push(now); hits.set(ip, h);

  const { ans = [], rej = [] } = req.body || {};
  if (!Array.isArray(ans) || !Array.isArray(rej) || ans.length > 20 || rej.length > 4) return res.status(400).end();
  const n = ans.length;
  const text = SYS + "\n\nQ&A so far:\n" +
    (ans.map((a, i) => `${i + 1}. ${String(a[0]).slice(0, 120)} -> ${OPT[a[1]] ?? "No"}`).join("\n") || "(none yet)") +
    (rej.length ? "\nWrong guesses (never repeat): " + rej.map(x => String(x).slice(0, 60)).join(", ") : "") +
    `\nQuestions asked: ${n} of 20.` + (n >= 20 ? " You must guess now." : n >= 12 ? " Guess if reasonably confident." : " Do not guess before question 8 unless certain.");

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 150, messages: [{ role: "user", content: text }] }),
  });
  if (!r.ok) return res.status(502).end();
  const data = await r.json();
  res.status(200).setHeader("content-type", "application/json").send(data.content?.[0]?.text ?? "{}");
}
