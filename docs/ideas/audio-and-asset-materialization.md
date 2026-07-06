# Idea: audio, and lazy asset materialization

**Status: staged.** Synth placeholders + the fetch tool land with M11 (juice).
The AI-generation backend is a later flag on the same tool. Lazy runtime
materialization is post-MVP and belongs to the little-language era
(ideas/interaction-chains.md) — they are effectively one feature.

## Three tiers of sound assets

1. **Synthesized placeholders — the emoji-square of audio.** A tiny Web
   Audio module makes sfxr-style parametric blips, pitch and envelope
   derived from a hash of the sound id, so `guinea-pig-wheek` always makes
   the same cheerful chirp before any real asset exists. Zero assets,
   on-brand for pixel art, and it extends the AGENTS.md invariant: no
   feature ever blocks on audio.

2. **Curated commons — plan of record for real sounds.** Freesound.org has
   actual recorded guinea pig wheeks; real animal sounds beat AI generation
   for charm. Kenney.nl CC0 packs cover UI pops. Mirror the sprite pipeline:
   `tools/get-sound.ts --id guinea-pig-wheek --query "guinea pig wheek"` →
   search Freesound API, normalize (trim, loudness, small ogg/m4a), write to
   `client/public/sounds/`, update the manifest. **The manifest records
   source URL and license per asset** (prefer CC0, allow CC-BY) and
   `ATTRIBUTION.md` is generated from it — licensing stays a solved problem,
   not a pre-publish scramble.

3. **AI generation — gap-filler.** Text-to-SFX APIs are good at foley the
   commons lacks ("rustling plastic bag, short, close-mic"). Same tool,
   different backend flag; manifest entry records `source: generated` plus
   the prompt.

## Lazy asset materialization (sounds AND sprites)

D9's philosophy applied to assets: when a chain definition references
`sprite: "a plastic bag of kitchen scraps"` or `sound: "distant excited
meeping"` with no asset behind it, the **server** (which holds the API keys —
never the client) generates it once on first encounter, runs it through the
style-lock/palette pipeline, caches it into the manifest keyed by a
content-hash of the description, and serves it as static content forever
after. The placeholder tier makes this safe: while an asset materializes,
players see the emoji square and hear the synth blip; nothing waits.

Payoff: a forking family writes `chains/koi-pond.yaml` with plain-English
asset descriptions and the assets materialize themselves on first play. No
art skills, no tooling session. Cost is bounded — once per asset ever, not
per event.

## Sound design principles

- **Every sound has a visual twin.** The wheek plays *and* «wheek wheek»
  blinks at the edge of the screen on the side it came from — direction
  conveyed visually, sound never required. Not a fallback: captions with
  personality are part of the charm, and accessibility comes free.
- **Audio enhances; it never informs alone.** The game is fully playable
  silent. Design every sound as garnish on a visual event.
- **Opt-in at join, expect partial compliance.** Ask players to turn sound
  on at the join screen, knowing some won't (or the iPhone silent switch
  will win). Any mix of sound-on and sound-off phones at the table must
  work.
- **The table moment is the point.** A wheek escaping from one phone,
  unconnected to the social flow — heads turn, someone laughs, someone goes
  hunting for their guinea pigs. Future refinement: the server could pick
  ONE phone to emit an ambient sound rather than all phones at once —
  avoids cacophony and turns the whole table into a distributed speaker
  ("whose phone was that?").

## Mobile gotchas (so M11 isn't ambushed)

- iOS won't start an AudioContext without a user gesture — unlock it on the
  join tap.
- The iPhone silent switch mutes web audio entirely. Reinforces everything
  above: sound is garnish.
