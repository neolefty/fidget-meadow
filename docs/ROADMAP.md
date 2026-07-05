# Roadmap

The unit of planning is the **session**, not the month. (Recalibrated
2026-07-05 after session 1 shipped M1 plus most of M6 — roughly a fifth of
the original 40-session budget in one sitting.) Even at a third of that
pace, the engine milestones below are ~10–15 sessions; the surplus buys
activities and charm, not schedule compression. See D13.

Rules of thumb:

- A milestone defaults to **one session**. If it won't fit, split it in this
  file rather than letting a session sprawl.
- Milestone numbers are stable identifiers — other docs and NEXT.md refer to
  them — so they never renumber. The ordering below is the recommended
  sequence and is allowed to change.

## Operating goal: party-ready always

After M8 (host taps a button → every phone at the table pops the same card),
the game is usable at a real gathering. There is no single debut party:
every family birthday and dinner between now and 2027 is a playtest slot for
whatever exists. **If a gathering is coming up, aim the nearest sessions
at M8.**

## Calendar-gated work (start earlier than the code requires)

Agent assistance compresses code time, not wall-clock time. These need real
elapsed time or real humans, so they start earlier than code dependencies
alone would dictate:

- **Garden (M9):** proving "grows between parties" is charming needs weeks
  on the clock. Plant it as soon as persistence and a minimal interact exist.
- **Art style (feeds M10):** taste converges over look-see iterations.
  `tools/` style experiments can run as a warm-down in any session from M5
  onward; nothing blocks on them.
- **Phone feel and grandma usability (M4, then always):** needs real devices
  at real dinners. Every gathering, hand someone a phone.

## Done

- **M0 — Project setup** ✅ 2026-07-05. Docs, decisions, working agreement.
- **M1 — Walking skeleton** ✅ 2026-07-05, session 1. Monorepo,
  join/welcome round-trip, tests, Docker. Live at
  https://meadow.orangecrayon.org.
- **M6 — Deploy** ✅ absorbed into session 1 (trunk-based auto-deploy, D11).
  Remainder: QR-code generation for the join URL — rides along with M8
  or M12.

## Remaining, in recommended order

### M2 — A world to look at

Map JSON → Pixi tile grid via the placeholder system (colored square +
emoji per kind); hand-authored starter meadow; fixed camera.
**Done means:** meadow renders on phone and desktop; editing
starter-meadow.json changes the world. *(NEXT.md carries the detailed rail.)*

### M3 — People in the world

Join screen (name + avatar from a hardcoded list), server-authoritative
movement, other players visible live, localStorage-token reconnect.
**Done means:** two phones side by side see each other walk around.

### M4 — Feels good on a phone

Tap-to-move with simple pathing, viewport/safe-area handling, touch targets
sized for grandmothers, arrow keys on desktop.
**Done means:** a non-developer family member joins and wanders unassisted.

### M5 — The world remembers

SQLite persistence for players and objects; restarts lose nothing; lazy
timestamp-derived state (groundwork for the garden).
**Done means:** restart the server mid-walk; everyone resumes in place.

### M7 — Touching the world

`interact` message, pushable objects with server-side rules. Soccer ball →
goal (celebration toast, ball resets); egg → nest to prove the rules
generalize.
**Done means:** two pushable puzzles work multiplayer; rules live
server-side with tests.

### → Fork: order M8 vs. M9 by the calendar

Family gathering within about a month? Do **M8** next — party-ready beats
everything. Otherwise plant **M9** first so the real-world clock starts
running on the garden.

### M9 — The garden *(pulled early; calendar-gated)*

Plant seeds, water them, growth stages derived from `planted_at` across real
days and weeks. The showpiece of returning to the meadow at the next
gathering — which is why it can't wait for its old slot after M8.

### M8 — Activity framework + host console *(the party MVP)*

Activity registry per ARCHITECTURE.md, `activity:start/end` protocol, group
modal machinery, `/host` console. Ship one real instructions-card group
activity ("Three Words" style — text + timer + done button) with content
from config. Bring the M6 QR-code remnant along.
**Done means:** the host taps a button and every phone at the table pops the
same card.

### M10 — Real art

`tools/gen-sprite.ts` pipeline per ARCHITECTURE.md; regenerate the starter
meadow's tiles, objects, and avatars. By now the style should already be
converging from warm-down experiments. Placeholder fallback stays forever.

### M11 — Juice

Sounds (off by default at the table), emotes/waves, movement and interaction
animations, seeing what others are up to.

### M12 — Party runbook

Load a party's content (activities, avatar roster, prompts) from the private
family repo. Written host runbook: pre-party checklist, QR printout, host
console cheat sheet. Dry run with 2–3 family members.

## After the engine: the activity shelf

When the milestones run out — plausibly well before 2027 — sessions shift to
a steady rhythm: pick one activity from docs/BACKLOG.md (jigsaw race,
writing sprint, spectate/peek, trivia integration, seasonal palettes…) and
ship it end-to-end, same one-session, downward-slope discipline. This is
where the game gets rich, and it's the pattern worth demonstrating for
anyone forking the project.
