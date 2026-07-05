# Next session

**Milestone:** M2 — A world to look at (docs/ROADMAP.md)

## The task

Render the meadow from map JSON with the placeholder system.

1. Finish `shared/src/map.ts` (already sketched — tile kinds + placeholder
   table exist): add `parseMeadowMap()` in the same defensive style as
   `parseClientMsg`, plus a vitest for it.
2. Hand-author `client/public/starter-meadow.json` — something like 24×16
   with a path, a pond, hedges around the edge.
3. Replace the hardcoded rectangle in `client/src/game/stage.ts` with the
   tile grid: colored square per tile, emoji on top (Pixi Text), nearest-
   neighbor. Camera can stay fixed this session; clamped follow needs a
   player position, which is M3's business.
4. Placeholder rendering is a small reusable helper — avatars and objects
   will use it too (AGENTS.md: placeholders are first-class).

## Done means

- The meadow renders at phone width and desktop; editing starter-meadow.json
  visibly changes the world after reload.
- `pnpm test` green (map parser tested). Deploy stays green.

## Current state (M1 shipped 2026-07-05)

- Walking skeleton is LIVE: join/welcome/toast round-trips over ws, verified
  with two clients; 12 tests green; Docker image builds and runs.
- Trunk-based auto-deploy works: push to main → GitHub Actions tests →
  ssh to home server → compose build → healthcheck on :3011. See
  NOTES.local.md (untracked) for server details. Public URL is
  https://meadow.orangecrayon.org (DNS done 2026-07-05); if it doesn't
  respond, the Caddy route may still be pending — one-liner in
  NOTES.local.md.
- `shared/src/map.ts` is a deliberate half-sketch, imported by nothing.
  `MeadowMap.objects` is commented out on purpose — object placements wait
  for M7's interact rules.
- One browser-eyeball check of the live client (rectangle + "joined as"
  pill) hasn't been done by a human yet — do that first, it's 30 seconds.

## Notes

- Versions: TypeScript 6, Vite 8, Vitest 4, Pixi 8.19, React 19.2, pnpm 10.
- Client store pattern: `client/src/net/socket.ts` exposes
  subscribe/getState (useSyncExternalStore); Pixi should subscribe to the
  same store when it starts caring about state (M3).
- Emoji-on-Pixi-Text renders differently per platform; if it looks bad on
  someone's phone, that's a BACKLOG note, not a session derail.
