# Working agreement for agents (and humans)

fidget-meadow is a cozy multiplayer grid game for family gatherings, built by
one developer with AI coding agents over many small sessions across 6–8
months. This file is the contract for how those sessions work.

## The prime directive: finish on a downward slope

Hemingway stopped writing mid-sentence so the next day started with momentum
instead of a blank page. We do the same:

- **End every session by setting up the next one, not by tying a bow.** A
  half-built function with a clear note beats a clean stopping point with an
  open question about what to do next.
- **`NEXT.md` is the rail.** It describes exactly where the next session
  starts: the task, the relevant files, what's half-done, and what "done"
  looks like. Rewrite it entirely each session — it is a launchpad, not a log.
- **Functional and simple beats ambitious and stalled.** When an
  *engineering* question threatens to eat the session, pick the boring
  option, record it in `docs/DECISIONS.md`, and move. Taste-flavored
  questions — gameplay feel, art, how the game meets the party — are never
  boring-optioned; they go to the consult beat (below) or into `NEXT.md`'s
  Live questions.

## The second directive: the human's taste enters every session

A session that runs start-to-finish with no questions is not a triumph — it
means the ambiguity lives one level up, undiscussed. The one input agents
cannot synthesize is what the game should *feel* like. Autonomy is for
execution, not direction: every session includes one deliberate consult.

## Session protocol

The session is a cycle: **warm up on the unfinished task → summarize where
we are → consult on what matters most → tackle the hardest thing → leave an
easy one Hemingway-unfinished.**

**1. Warm up (the downhill step):**
- Read `NEXT.md` and finish its deliberately-unfinished task first —
  momentum before conversation. Resist substituting a more interesting one.
- Skim `docs/BACKLOG.md` only if `NEXT.md` points there.

**2. Summarize where we are:**
- A few sentences for the human at the table, not the log: what just landed,
  what state the game is in, what's on deck.

**3. Consult (do not skip, even when the plan is unambiguous —
*especially* then):**
- Hunt for the ambiguity that is foremost *right now*. It is not the same
  domain every time: gameplay feel, art direction, product choices (how the
  game interacts with the physical party around it), technical direction, or
  simply what to focus on next. One sharp question, or a small batch.
- `NEXT.md`'s Live questions are candidates, not a ceiling — a fresher
  ambiguity beats a stale queued one.
- Come with a recommendation and what changes either way, then wait. The
  answer steers the session.

**4. Work:**
- Tackle the most difficult item the consult points at — prime session
  energy goes to the hard thing, not the most tractable one.
- Scope is one roadmap chunk or less. New ideas and discovered problems go to
  `docs/BACKLOG.md` (one line: what, where, why it matters) — not into the
  current session.
- No TODO comment without a matching BACKLOG entry.

**5. End of session (budget ~5 minutes for this):**
1. Leave an *easy* task Hemingway-unfinished — cut it off mid-implementation
   with a clear note. That is next session's warm-up. (Hard problems don't
   get left half-done overnight; easy ones do.)
2. Rewrite `NEXT.md`: the task, entry-point files, current state (including
   anything intentionally broken: "X fails until Y exists — that's the rail"),
   acceptance criteria, and **Live questions** — 1–3 ambiguities noticed but
   not yet consulted on, as seeds for the next session's consult.
3. Sweep loose ends into `docs/BACKLOG.md`; record decisions in
   `docs/DECISIONS.md`.
4. Leave the build green, or say exactly how and why it's red in `NEXT.md`.

## Conventions

- **TypeScript strict everywhere.** The shared protocol types in `shared/`
  are the source of truth for client–server communication; extend the
  discriminated unions there first, then implement both sides.
- **Server is authoritative.** Clients send intents ("move north"), the server
  decides what happened and broadcasts patches. Game rules live server-side.
- **Placeholders are first-class.** Every sprite id must render as a colored
  square + emoji until real art exists. Never block a feature on art.
- **Everything is interruptible.** No mechanic may punish a player for
  putting the phone down mid-anything. This is a design invariant, not a
  preference.
- **Think in Activities.** When adding anything interactive, check
  `docs/ARCHITECTURE.md` § Activity framework — most features should be
  activities so the host console and group-modal machinery apply to them.
- **Boring dependencies, few of them.** pnpm workspaces: `client/`, `server/`,
  `shared/`, `tools/`.
- **Mobile first.** Test at phone width; desktop is the dev convenience, the
  party runs on phones. Big touch targets — grandmothers play this game.
- **Tests where they earn their keep:** vitest on game rules and protocol
  handling. No coverage chasing, no UI test theater.

## Project layout of truth

| File | Purpose |
|---|---|
| `NEXT.md` | Where the next session starts. Always current. |
| `docs/ROADMAP.md` | Milestone chunks, each sized for 1–3 sessions. |
| `docs/BACKLOG.md` | Loose-end parking lot. Append freely, groom rarely. |
| `docs/DECISIONS.md` | ADR-lite. One entry per decision, with the why. |
| `docs/VISION.md` | The pitch and design pillars. Read when scope is unclear. |
| `docs/ARCHITECTURE.md` | System design: protocol, activities, art pipeline. |
