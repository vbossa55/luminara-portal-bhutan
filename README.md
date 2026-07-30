# LUMINARA PORTAL — BHUTAN

**Luminara, introduced plainly.** A self-contained portal prepared for the Royal Government of
Bhutan, ahead of Project 108 at Gelephu Mindfulness City.

Nothing here predicts, and nothing here prescribes.

---

## Run it

```bash
node build.mjs        # presses portal/index.html
```

Then open `portal/index.html` in any browser. One file, no server, no network, no dependencies —
it works from a memory stick in a room with no connection.

```bash
npm test              # 45 pins across the canon, the law, and the built artifact
npm run verify        # build, then test
```

Node 18+. There are no dependencies and there will not be any.

---

## What this is

An elementary introduction to the Luminara system in seven movements:

1. **Three motions, and there is no fourth** — hold, extend, turn; across three depths; 3³ = 27.
2. **A card is a coordinate, not a picture** — the deck means by position, not by reference.
3. **The law, and the cube** — balanced ternary, and the answer as antipode.
4. **Every card sounds** — two windings are a ratio, and a ratio is an interval.
5. **What it refuses** — the three refusals, the nine names, the four Silences.
6. **One card, drawn** — committed, declared, replayable.
7. **What is not being asked for** — the electional boundary, and the sealed room.

The presentation notes, including what to say and in what order, are in
[docs/PRESENTATION.md](docs/PRESENTATION.md).

## What this is not

- **Not** a Bhutan-tuned edition of Luminara. The canon forbids blending systems
  (*"the method transfers, the vocabularies never"*), and a system that broke its own law to
  flatter an audience would be worth nothing to that audience.
- **Not** an almanac and **not** a chooser of auspicious days. See below.
- **Not** a claim on anyone's tradition, vocabulary, calendar, or office.
- **Not** carrying the sealed letters. The 27-letter correspondence is withheld pending its
  keeper's confirmation, and nothing in this portal depends on it.

---

## The electional boundary

The single most important line in this repository, and it is enforced in code rather than promised:

> The moment a calendar exists, the electional question knocks: which hour is auspicious? … The
> calendar answers what o'clock it is on the deck, and nothing else. **There is no auspicious hour
> and no forbidden one.**
> — *The Astrolabe of the 27*, §IX

A date cannot seed a cast. The attempt throws by name:

```js
castOne(new Date());
// TypeError: A date may not seed a cast.
//            There is no auspicious hour and no forbidden one.
```

This is why the portal cannot encroach on the office of those who do choose auspicious days. It is
not applying for that office, and it is built so that it could not take it up by accident.

## On the twenty-seven, said plainly and then deflated

The moon's true lap against the stars takes 27.32 days, which is why lunar-station systems across
several civilisations counted twenty-seven or twenty-eight. **The agreement is the moon's, not
ours.** Any system that gives the lunar month daily stations is *forced* to that number. It is
arithmetic, not a marvel, and no correspondence is reported as striking here until the territory
around it has been counted.

---

## How it is built

```
src/canon.mjs      the derivation — the only source of truth
src/figures.mjs    the mandala and the knot, derived from p and q alone
src/draw.mjs       the cast: unsteerable, declared, replayable, offline
build.mjs          presses portal/index.html and verifies its own output
tests/             45 pins
portal/index.html  the built artifact (committed, so it can be opened without a toolchain)
```

**No stored meanings.** There is no table of twenty-seven meanings, because there is nowhere for one
to live — `tests/law.test.mjs` fails the build if any per-card table other than `NAMES` appears.
`NAMES` is permitted because the canon names it as the human-given part. Everything else — the code,
the law `q`, the voice `p`, the house, the form, the genus, the interval, the answer, the becoming —
is computed.

**Derived, never drawn.** No card has an illustration. Both views come from `p` and `q`: from above
the mandala, whose petals number `|q|`; from the side the body of the knot. Where the strand closes
early the figure is several rings, because that is what the card is — The Void is drawn as seven
rings, and a test checks that it is seven.

**The guard is structural.** Misusing this instrument requires changing the code, not merely the
intention. It cannot quietly begin predicting (there are no stored meanings to weight), cannot
become a score (a number attached to a person is a test failure), cannot be seeded by a date, and
cannot reach the network (no source may contain `fetch`, and the build refuses its own output if it
does).

**The build checks its own artifact.** The unit tests import each module into a scope of its own; the
portal concatenates them into one. That is a different artifact, and it can fail where the unit tests
cannot see — it did once, and `tests/portal.test.mjs` and a build-time probe now exist because of it.

---

## Provenance

The canon of record is the Luminara corpus (`THE_LIGHT_OF_LUMINARA`, `THE_BOOK_OF_LUMINARA`,
`THE_ASTROLABE_OF_THE_27`, `WHAT_LUMINARA_IS`, the Caster's Law, the nine first names). This portal
is a faithful reading of it for one audience; where this repository and the canon disagree, the canon
wins and this repository is wrong. Every number on the page is computed at build time rather than
transcribed.

*Convergence is evidence, never authority.*
