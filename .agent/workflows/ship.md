# /ship
1. Run `npx vercel dev` and play one full game (Claude mode and archive fallback).
2. Check mobile width 390px: no horizontal scroll, buttons reachable.
3. `npx vercel --prod`, then confirm `/api/jinn` returns 405 on GET.
4. Confirm `ANTHROPIC_API_KEY` is set in Vercel env and the domain jinn.lakshya.uk points to the project.
