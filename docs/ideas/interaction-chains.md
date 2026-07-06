# Idea: interaction chains and a content "little language"

**Status: post-MVP. Do not start before the activity-shelf era, and not
before the rule of three is satisfied (below).**

## The concept

Discoverable, interruptible progression chains woven into the world. The
motivating example, from a family that has kept guinea pigs several times:

> You found some seeds → seeds grow into greens → greens + knife = scraps →
> scraps + plastic bag = *rustling* → guinea pigs off-screen hear it and
> start meeping → go find them.

No quest log, no assignment — you stumble into step one and curiosity does
the rest. Every step persists, so a chain interrupted by a trivia turn (or a
month between parties) resumes exactly where it left off.

The point of abstraction: this chain is deeply *one family's*. Another
family's chains involve fish, or a vegetable garden, or hockey. The chains
are content, not engine — which is exactly the D5 boundary (game repo public,
party content private) extended to mechanics.

## Eventual shape

A declarative format — JSON/YAML/whatever proves easiest, a "little
language" — describing a chain separately from the game: steps, required
items/objects, what each combination produces, ambient effects (rustling,
off-screen meeping), spawns, and completion delight. The private family repo
would carry `chains/guinea-pigs.yaml`; a forking family writes
`chains/koi-pond.yaml` without touching TypeScript. Likely consumed by a
generic "chain runner" built on the Activity framework
(ARCHITECTURE.md § Activity framework).

## Discipline: the rule of three

Do **not** design the format first. Hardcode two or three chains in plain
TypeScript (guinea pigs is chain #1; pick dissimilar ones for #2–3), ship
them at real gatherings, and only then extract the format from what they
turned out to share. A little language designed before its programs exist
will describe the wrong things. Corollary: the guinea pigs themselves are a
strong early activity-shelf item on their own merits, no abstraction needed.

## Inherited design constraints

Chains obey the pillars (VISION.md): discoverable, never assigned; fully
interruptible with persistent progress; nothing decays or fails; charm at
every step, not just the end.
