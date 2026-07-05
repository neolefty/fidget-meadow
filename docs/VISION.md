# Vision

## The setting

Family birthdays have become mini reunions: three adult siblings, parents, a
grandmother, sometimes more. The birthday person brings trivia; questions go
around the table one person at a time. The tradition has grown group
mini-games (three-word writing sprints, jigsaw races) and, crucially, the
norm that everyone keeps their hands busy between turns — a fidget toy, a
doodle, a puzzle. Something absorbing but instantly droppable.

fidget-meadow is that norm, as software: a shared pixel-art world everyone at
the table inhabits on their phones, full of small satisfying things to do,
that periodically hands attention *back to the room*.

## Design pillars

1. **The room is the game.** The app serves the in-person gathering. Group
   activities pop up as modals for everyone at once — and often the modal
   just presents instructions for something physical ("grab your jigsaw
   section, go!") with a done button. Screens down is a success state.
2. **Interruptible by design.** No timers on personal play, no failure for
   walking away, nothing that decays or dies from neglect. Your turn to
   answer a trivia question should cost you nothing in-game.
3. **No losing.** No combat, no death, no scarcity. Puzzles reset, gardens
   grow while you're gone, the soccer ball can always be nudged again.
4. **Small delights.** A pushed egg wobbles into the nest. A seed sprouts
   since last month's party. Someone's avatar waves at you. Charm over depth.
5. **Ship simple, iterate forever.** A working meadow with two activities and
   emoji placeholder art at the next birthday beats a beautiful engine that
   isn't done. (See AGENTS.md.)

## The experience, sketched

You scan a QR code, pick a name and an avatar (a round white-haired
grandmother in a blue dress, if that's you), and appear in a small cozy world:
grass, paths, a garden plot, a brick wall, a blackberry arbor. You wander with
taps. You find a soccer ball and spend five pleasant minutes nudging it toward
a goal. Across the meadow you can see your daughter fussing with something in
the garden. Then the screen dims and a card slides up: *"Maya has started a
group activity: Three Words. Your words are thistle, orbit, spoon. Three
minutes — write!"* Everybody groans happily and picks up pens.

## Who it's for

- **Primary:** one family's gatherings of 5–12 people who know each other,
  on phones around a table, a few times a year. Personal use drives priority.
- **Secondary:** anyone on the internet who wants a template for cozy
  local-social games — the project is open source and should stay legible and
  forkable.

## Non-goals

- Scale. One world, one room, ~a dozen players. No sharding, no matchmaking.
- Accounts, auth, moderation. Players are trusted family; a name and a
  localStorage token suffice.
- Monetization, anti-cheat, engagement mechanics. If someone cheats at
  pushing a soccer ball, congratulate them.
- Real-time action gameplay. Discrete grid movement; latency is a non-issue.
