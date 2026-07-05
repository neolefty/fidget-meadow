# Roadmap

Milestones sized for 1–3 agent sessions each. Order is firm through M6
(deploy early — party logistics are the risk, not the code), flexible after.
Each milestone has a "done means" so sessions know when to stop.

Timeline sanity check: 6–8 months at a session or two a week is roughly 40
sessions. M1–M8 is the core game (~15–20 sessions); the rest is cushion for
activities, art, and polish before the first birthday deployment.

## M0 — Project setup ✅ (2026-07-05)

Docs, decisions, working agreement. This file.

## M1 — Walking skeleton

pnpm monorepo (`client/`, `server/`, `shared/`, `tools/`). Vite + React +
PixiJS client showing a colored rectangle; Node + ws server; shared protocol
package with `join`/`welcome` round-trip displayed in the client. Vitest wired
up in `shared/` and `server/`. Dockerfile that builds and runs the whole thing.

**Done means:** `pnpm dev` starts both; browser shows proof of a message
round-trip; `docker build` succeeds.

## M2 — A world to look at

Map defined as JSON (tile kinds + object placements), rendered as a Pixi tile
grid with the placeholder system (colored square + emoji per kind). Camera
with clamped follow. One hand-authored starter meadow.

**Done means:** the meadow renders on phone and desktop; changing map JSON
changes the world.

## M3 — People in the world

Join screen (name + avatar pick from a hardcoded list), server-authoritative
movement, other players visible and moving live. localStorage token reconnect.

**Done means:** two phones side by side see each other walk around.

## M4 — Feels good on a phone

Tap-to-move with simple pathing, viewport/safe-area handling, touch targets
sized for grandmothers, arrow keys on desktop. Address whatever feels bad in
M3's real-device test.

**Done means:** a non-developer family member can join and wander unassisted.

## M5 — The world remembers

SQLite persistence for players and objects; server restarts lose nothing;
lazy timestamp-derived state (groundwork for the garden).

**Done means:** restart the server mid-walk; everyone resumes in place.

## M6 — On the basement server

Docker compose deployment behind the existing reverse proxy (WebSocket
upgrade!), SQLite on a volume, QR code generation for the join URL, deploy
script or one-liner documented.

**Done means:** a phone on cellular data joins the meadow via QR code.

## M7 — Touching the world

Interaction system: `interact` message, pushable objects with server-side
rules. First activity: push the soccer ball into the goal (celebration toast,
ball resets). Second: egg into nest, to prove the rules generalize.

**Done means:** two pushable puzzles work multiplayer; pushing logic lives
server-side with tests.

## M8 — The activity framework + host console

Activity registry per ARCHITECTURE.md, `activity:start/end` protocol, group
modal machinery, `/host` console with trigger buttons. Ship one real group
activity: an instructions-card activity ("Three Words" style — text + timer +
done button) with content loaded from config.

**Done means:** the host taps a button and every phone at the table pops the
same card. This is the party MVP.

## M9 — The garden

Plant seeds, water them, growth stages derived from `planted_at` across real
days/weeks. The showpiece of returning to the meadow at the *next* party.

## M10 — Real art

`tools/gen-sprite.ts` pipeline per ARCHITECTURE.md, style-lock prompt and
palette, regenerate the starter meadow's tiles/objects/avatars. Placeholder
fallback stays forever.

## M11 — Juice

Sounds (toggleable, off by default at the table), emotes/waves between
players, movement and interaction animations, seeing what others are up to.

## M12 — Party runbook

Load a party's content (activities, avatar roster, prompts) from the private
family repo. Written host runbook: pre-party checklist, QR printout, host
console cheat sheet. Dry run with 2–3 family members before the real thing.
