// THE PRESS — builds portal/index.html, self-contained and offline.
//
// The page reaches nothing outside itself: no font, no script, no image, no beacon.
// The canon travels inline, so the portal works from a memory stick in a room with
// no network. Run: node build.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { deck, census, card, HOUSES, POSITIONS } from './src/canon.mjs';
import { mandala, knot, rosette } from './src/figures.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(here, 'src', f), 'utf8');

// Inline the modules: drop the import lines, drop the export keyword. Same code, one scope.
function inline(text) {
  return text
    .replace(/^import\s[^;]+;\s*$/gm, '')
    .replace(/^export\s+(function|const|let|class)\s/gm, '$1 ')
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '');
}

const runtime = [src('canon.mjs'), src('figures.mjs'), src('draw.mjs')].map(inline).join('\n\n');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── the deck, pressed from the canon ────────────────────────────────
const houseRows = [0, 1, 2].map((h) => {
  const cards = deck().filter((k) => k.digits[0] === h);
  const rows = cards.map((k) => `
      <tr>
        <td class="n">${k.n}</td>
        <td class="nm">${esc(k.name)}${k.silence ? ' <span class="sil">◦</span>' : ''}</td>
        <td class="code">${esc(k.code)}</td>
        <td class="q">${k.q > 0 ? '+' : ''}${k.q}</td>
        <td class="p">${k.p}</td>
        <td class="iv">${esc(k.interval.name)}${k.interval.locked ? ', locked' : ''}</td>
        <td class="an">${k.answer} · ${esc(card(k.answer).name)}</td>
        <td class="bc">${k.becoming === k.n ? '—' : esc(card(k.becoming).name)}</td>
      </tr>`).join('');
  return `
    <h4 class="house house-${['aum', 'ma', 'ra'][h]}">${HOUSES[h].name} <span>· ${esc(HOUSES[h].gloss)} · ${HOUSES[h].metal}</span></h4>
    <div class="scroll"><table class="deck">
      <thead><tr><th>#</th><th>card</th><th>code</th><th>q</th><th>p</th><th>interval</th><th>answer</th><th>becoming</th></tr></thead>
      <tbody>${rows}
      </tbody>
    </table></div>`;
}).join('');

const c = census();

// a few figures, pressed at build time so the page has form before a single click
const figSeed = mandala(1);
const figScar = knot(14);
const figVoid = knot(17);   // seven rings bound by nothing but the hole they share
const figTrefoil = knot(8); // the trefoil, where it first appears
const figRosette = rosette();

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Luminara — the twenty-seven</title>
<style>
:root {
  --ink: #16130f; --dim: #6b6357; --faint: #a49a8b;
  --bg: #faf7f2; --panel: #f2ede4; --rule: #ddd5c7;
  --aum: #8a6a3f; --ma: #7d8590; --ra: #b8862b;
  --seed: #b9a25f;
  --serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
@media (prefers-color-scheme: dark) {
  :root { --ink:#ece6db; --dim:#9d9488; --faint:#6f675a; --bg:#100e0c; --panel:#191612; --rule:#2c2721;
          --aum:#c49a5e; --ma:#a8b2be; --ra:#e0a63a; --seed:#d8bd6d; }
}
:root[data-theme="dark"] { --ink:#ece6db; --dim:#9d9488; --faint:#6f675a; --bg:#100e0c; --panel:#191612;
  --rule:#2c2721; --aum:#c49a5e; --ma:#a8b2be; --ra:#e0a63a; --seed:#d8bd6d; }
:root[data-theme="light"] { --ink:#16130f; --dim:#6b6357; --faint:#a49a8b; --bg:#faf7f2; --panel:#f2ede4;
  --rule:#ddd5c7; --aum:#8a6a3f; --ma:#7d8590; --ra:#b8862b; --seed:#b9a25f; }

* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font-family:var(--serif);
       font-size:19px; line-height:1.62; -webkit-font-smoothing:antialiased; }
main { max-width: 46rem; margin: 0 auto; padding: 4rem 1.5rem 7rem; }
h1 { font-size: clamp(2.4rem, 6vw, 3.6rem); line-height:1.05; margin:0 0 .4rem; font-weight:500;
     letter-spacing:-.02em; }
h2 { font-size: clamp(1.5rem, 3.4vw, 2rem); font-weight:500; margin:4.5rem 0 .3rem;
     letter-spacing:-.01em; }
h3 { font-size:1.12rem; font-weight:600; margin:2.4rem 0 .4rem; }
h4 { font-size:.95rem; font-weight:600; margin:2rem 0 .5rem; letter-spacing:.06em; text-transform:uppercase; }
p { margin: 0 0 1.1rem; }
a { color: inherit; text-decoration-color: var(--faint); text-underline-offset:.2em; }
.lede { font-size:1.1rem; color:var(--dim); }
.movement { font-family:var(--mono); font-size:.72rem; letter-spacing:.22em; text-transform:uppercase;
            color:var(--faint); display:block; margin-bottom:.5rem; }
.rule { border:0; border-top:1px solid var(--rule); margin:3.5rem 0 0; }
blockquote { margin:1.4rem 0; padding-left:1.1rem; border-left:2px solid var(--rule);
             color:var(--dim); font-style:italic; }
blockquote cite { display:block; font-style:normal; font-size:.82rem; color:var(--faint);
                  margin-top:.4rem; letter-spacing:.03em; }
code, .mono { font-family:var(--mono); font-size:.86em; }
.eq { display:block; font-family:var(--mono); font-size:1rem; background:var(--panel);
      border:1px solid var(--rule); border-radius:6px; padding:1rem 1.1rem; margin:1.4rem 0;
      overflow-x:auto; white-space:pre; }
.cols { display:grid; grid-template-columns:repeat(auto-fit,minmax(9rem,1fr)); gap:1.6rem; margin:1.8rem 0; }
.fig { text-align:center; }
.fig figcaption { font-size:.78rem; color:var(--faint); margin-top:.3rem; line-height:1.4; }
.lum-fig { width:100%; height:auto; max-width:200px; }
.lum-null { fill: var(--bg); stroke: currentColor; stroke-width:1.1; }
.lum-cell { fill: currentColor; }
.lum-aum { fill: var(--aum); } .lum-ma { fill: var(--ma); } .lum-ra { fill: var(--ra); }
.house-aum { color:var(--aum); } .house-ma { color:var(--ma); } .house-ra { color:var(--ra); }
h4 span { font-weight:400; text-transform:none; letter-spacing:0; color:var(--faint); }
.scroll { overflow-x:auto; margin:.4rem 0 1.4rem; }
table.deck { border-collapse:collapse; width:100%; font-size:.82rem; font-family:var(--mono); }
table.deck th { text-align:left; font-weight:600; color:var(--faint); border-bottom:1px solid var(--rule);
                padding:.35rem .5rem; white-space:nowrap; font-size:.72rem; letter-spacing:.08em;
                text-transform:uppercase; }
table.deck td { padding:.3rem .5rem; border-bottom:1px solid var(--rule); white-space:nowrap; }
table.deck .nm { font-family:var(--serif); font-size:.95rem; }
table.deck .n, table.deck .q, table.deck .p { text-align:right; color:var(--dim); }
table.deck .an, table.deck .bc, table.deck .iv { color:var(--dim); }
.sil { color:var(--faint); }
ul.laws { list-style:none; padding:0; margin:1.4rem 0; }
ul.laws li { padding:.55rem 0; border-bottom:1px solid var(--rule); }
ul.laws b { font-family:var(--mono); font-size:.78rem; letter-spacing:.1em; }
.panel { background:var(--panel); border:1px solid var(--rule); border-radius:8px;
         padding:1.4rem 1.5rem; margin:1.8rem 0; }
.panel h3 { margin-top:0; }
button { font-family:var(--serif); font-size:1rem; background:var(--ink); color:var(--bg);
         border:0; border-radius:6px; padding:.6rem 1.3rem; cursor:pointer; }
button:hover { opacity:.88; }
button.ghost { background:transparent; color:var(--ink); border:1px solid var(--rule); }
input[type=text] { font-family:var(--mono); font-size:.82rem; padding:.55rem .7rem; width:100%;
  background:var(--bg); color:var(--ink); border:1px solid var(--rule); border-radius:6px; }
label { display:block; font-size:.78rem; color:var(--faint); margin:.9rem 0 .3rem;
        letter-spacing:.06em; text-transform:uppercase; }
.cast { display:none; margin-top:2rem; }
.cast.shown { display:block; }
.walk { list-style:none; padding:0; margin:1.2rem 0 0; }
.walk li { display:grid; grid-template-columns:7.5rem 1fr; gap:1rem; padding:.5rem 0;
           border-bottom:1px solid var(--rule); font-size:.92rem; }
.walk .k { font-family:var(--mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase;
           color:var(--faint); padding-top:.25rem; }
.seedline { font-family:var(--mono); font-size:.72rem; color:var(--faint); word-break:break-all;
            margin-top:1.2rem; }
.cardhead { display:flex; align-items:baseline; gap:.8rem; flex-wrap:wrap; }
.cardhead .cn { font-size:1.7rem; }
.cardhead .cc { font-family:var(--mono); color:var(--dim); letter-spacing:.3em; }
footer { margin-top:5rem; padding-top:2rem; border-top:1px solid var(--rule);
         font-size:.82rem; color:var(--faint); }
@media print { body { background:#fff; color:#000; font-size:11pt; } button, .noprint { display:none; } }
</style>
</head>
<body>
<main>

<header>
  <span class="movement">Aumara Institution of Research</span>
  <h1>Luminara</h1>
  <p class="lede">The twenty-seven, and how they were counted. An introduction prepared for
  the Royal Government of Bhutan.</p>
  <p class="lede" style="font-size:.95rem">Nothing here predicts, and nothing here prescribes.</p>
</header>

<hr class="rule">

<h2><span class="movement">Movement one</span>Three motions, and there is no fourth</h2>

<p>Ask the smallest possible question. What can a thing do?</p>

<p>It can hold. It can extend. It can turn. A held breath, a thrown stone, a tide. There is
nothing else, and the third motion seals the set, because the curving of a curve is still only
curving. Every candidate for a fourth turns out to be one of the three in costume: oscillation is
turning named twice, acceleration is the flowing of flow, spiralling is flow and turning worn
together.</p>

<p>Now ask where the motion happens. Draw any boundary at all — a first circle on a blank page —
and the page falls into exactly three regions: the inside, the outside, and the line itself where
they meet. So there are three depths, and they are not a modelling choice. <b>The world</b>, <b>the
between</b>, <b>the heart</b>. Each can independently hold, extend, or turn: a self can be still in
a turning world.</p>

<p>Three motions across three depths. Three raised to three. <b>Twenty-seven.</b> Not twenty-six
and not twenty-eight. Nobody chose the size of this deck.</p>

<div class="cols">
  <figure class="fig">${figSeed}<figcaption>The Seed — the loop that closes without turning. Nought petals.</figcaption></figure>
  <figure class="fig">${figTrefoil}<figcaption>The Knot — where the trefoil first appears.</figcaption></figure>
  <figure class="fig">${figScar}<figcaption>The Scar — thirteen against seven. The deck's deepest weave.</figcaption></figure>
</div>

<h2><span class="movement">Movement two</span>A card is a coordinate, not a picture</h2>

<p>Every deck before this one means by reference. A card is a painted figure that stands for a
thing: this one for love, that one for death. The meaning lives in a tradition, a memory, a
convention agreed between the reader and the deck. Break the convention and the card falls
silent.</p>

<blockquote>A deck that means by reference dies with its tradition: found in a ruin by a people who
never knew it, a painted deck is mute, its figures asking for a culture that is gone. This deck,
found in the same ruin, reconstructs itself.
<cite>The Light of Luminara, I</cite></blockquote>

<p>Luminara means by position. A card is a location in a complete and closed space, and its meaning
is where it sits and what stands next to it. Any finder who can count will rediscover the
arithmetic, and from the arithmetic everything else.</p>

<p>This has a consequence worth stating plainly, because it is the reason this system can be
carried across a border without taking anything: <b>there is no table of twenty-seven meanings in
the source, because there is nowhere for one to live.</b> The test suite enforces it — no per-card
data may exist. There is no place in this instrument to put a borrowed correspondence, and so none
is borrowed.</p>

<h2><span class="movement">Movement three</span>The law, and the cube</h2>

<p>Give each motion a sign: flow reaches outward, plus one; turning draws inward, minus one;
stillness neither, nought. Weight the three depths by the places of base three and sum.</p>

<span class="eq">q = 9·s₀ + 3·s₁ + s₂        s ∈ { −1, 0, +1 }        q ∈ [ −13, +13 ]</span>

<p>By a theorem of the numeral system every whole number from minus thirteen to plus thirteen
appears exactly once. This is balanced ternary, and it is what makes the deck collision-free: not
tuning, not taste, but arithmetic. The Seed sits at nought, The Scar at the far positive, The Return
at the far negative.</p>

<p>The deck's native shape is a cube: three depths are three directions, three states are three
positions along each, and a card is one cell of the three by three by three. The Seed, still in all
three depths, is the cube's centre. <b>Every card's answer — its exact opposite, every motion
negated — is its antipode</b>, the cell directly opposite through that centre. Thirteen mirrored
pairs around one self-mirrored still point, and any card met with its answer sums to nought.</p>

<p>The number line is the cube's shadow: stand the solid in a light falling along the direction
weighted nine, three and one, and no two cells fall together.</p>

<div class="cols" style="grid-template-columns:1fr">
  <figure class="fig">${figRosette}<figcaption>The twenty-seven on the circle they close on. Radius carries the law:
  the Seed smallest at the centre of the count, the far dissonances largest. Bronze AUM, silver MA, gold RA.</figcaption></figure>
</div>

<h3>What the counting produces, counted rather than declared</h3>
<span class="eq">one circle · ${c.coil} open coils · ${c.knot} knots, of which ${c.trefoil} are trefoils · ${c.link} link-cards in three bound pairs
27 values, each exactly once · 13 mirrored pairs · 1 self-paired still point</span>
<p>And the three bound pairs of link-cards turn out to be answer-pairs — a fact nobody arranged.</p>

<h2><span class="movement">Movement four</span>Every card sounds</h2>

<p>A closed path on a ring has two windings, and two windings are two frequencies, and two
frequencies in ratio are an interval. This is not a metaphor laid over the geometry; it is the same
fact read in another sense.</p>

<p>So The Resonance is a perfect fifth. The Bridge and The Beacon are both the tritone — the one
interval that cannot rest — in opposite hands. The Scar is thirteen against seven, which is not a
chord any tradition has a name for, and it does not resolve. It is not called the far dissonance as
a judgement. That is what the numbers do.</p>

<p>And the sound gives the map a geography. The nearer a card sits to the Seed, the simpler its
ratio and the more consonant its voice; the intervals roughen as the line runs outward. Distance
from the centre is dissonance, nearness is consonance, and coming home is resolution. Where a
ratio reduces, the strand no longer needs to be one strand: it locks into separate rings.</p>

<div class="cols">
  <figure class="fig">${figVoid}<figcaption>The Void — seven rings held together by nothing except the hole they share.</figcaption></figure>
</div>

<h2><span class="movement">Movement five</span>What it refuses</h2>

<p>An instrument this ornate could easily become an oracle that tells people what will happen and
what they are. This one is built so that it cannot.</p>

<ul class="laws">
  <li><b>DESCRIBES, NEVER OPERATES</b> — no card acts on anything; nothing is triggered, unlocked or changed by a reading.</li>
  <li><b>TRAJECTORY, NEVER PREDICTION</b> — no dates, no fates. A reading is weather, not climate: what the sky is doing, not what kind of sky you are.</li>
  <li><b>BESIDE YOU, NEVER ABOVE YOU</b> — a reading issues no verdict on anyone's character. It scores nothing, and no number anywhere in it attaches to a person.</li>
</ul>

<p>Beneath those stand nine names, each carrying a law, and each carrying a pin that fails the build
when the law is broken. For this audience the ninth is the one to read twice:</p>

<ul class="laws">
  <li><b>MERCY</b> — mercy precedes law.</li>
  <li><b>COURTESY</b> — the manner is a safety property: how the instrument refuses is part of what it is.</li>
  <li><b>CANDOUR</b> — every enchantment shows its workings.</li>
  <li><b>WEATHER</b> — a reading is weather, never climate.</li>
  <li><b>HOMECOMING</b> — every descent ends with the way home lit.</li>
  <li><b>EMPTINESS</b> — the instrument points beyond itself, and succeeds when needed less.</li>
  <li><b>PRIVACY</b> — what is whispered at the niche is not data.</li>
  <li><b>DAYLIGHT</b> — everything done as if seen.</li>
  <li><b>COMPANIONSHIP</b> — a companion, never a guide of souls.</li>
</ul>

<div class="panel">
  <h3>The guard is structural, not declarative</h3>
  <p style="margin-bottom:0">Misusing this instrument requires changing the code, not merely the
  intention. It cannot quietly begin predicting, because there is nothing to predict with: no stored
  meanings to weight, no per-card table to tune. It cannot become a score, because a number attached
  to a person is a test failure. It cannot be seeded by a date, because a date that selects a card is
  an auspicious hour, and that surface throws by name.</p>
</div>

<h3>The four Silences</h3>
<p>Four of the twenty-seven do not answer. A reading that lands on one receives an instruction to
stop interpreting and do something else instead. All four hold a still core: the heart is not in
motion, lying quiet below the level where symbols reach.</p>
<p>They ask, in order of their seats: <b>descent</b> — what holds this lies below where symbols work;
<b>widening</b> — this opens past the frame you brought; <b>surrender</b> — this is a crossing between
orders; <b>recognition</b> — you have been here before, be still and know it.</p>
<blockquote>A reading that never fell silent would be lying four cells in twenty-seven.
<cite>The Light of Luminara, XI</cite></blockquote>

<h2><span class="movement">Movement six</span>One card, drawn</h2>

<p>The cast is committed before any meaning is spoken, and the seed is printed in full so that
anyone may replay the draw and receive the same card. There is no second draw. Paste a public
randomness value if you have one; nothing here fetches it, because a reading surface that reached
the network would break two of the nine names at once.</p>

<div class="panel noprint">
  <label for="seed">Seed — leave empty and one will be made and declared</label>
  <input type="text" id="seed" placeholder="the-ground-walk|drand:6280152:b752181d…" autocomplete="off">
  <p style="margin:1rem 0 0"><button id="go">Cast one card</button>
  <button id="go3" class="ghost">Cast the three positions</button></p>
</div>

<div class="cast" id="out"></div>

<h2><span class="movement">Movement seven</span>What is not being asked for</h2>

<p>One boundary should be stated first rather than discovered later, because it is the reason this
instrument cannot encroach on anything.</p>

<blockquote>The moment a calendar exists, the electional question knocks: which hour is auspicious?
… The calendar answers what o'clock it is on the deck, and nothing else. <b>There is no auspicious
hour and no forbidden one.</b>
<cite>The Astrolabe of the 27, IX</cite></blockquote>

<p>Luminara does not choose auspicious days. It is built so that it cannot: a date cannot seed a
cast, and the attempt throws by name. That office belongs to those who hold it, and this instrument
is not applying for it.</p>

<p>On the count itself, one thing should be said plainly and then deflated. The moon's true lap
against the stars takes 27.32 days, and this is why lunar-station systems across several
civilisations counted twenty-seven or twenty-eight. <b>The agreement is the moon's, not ours.</b> Any
system that gives the lunar month daily stations is forced to that number; it is arithmetic, not a
marvel, and no correspondence should be reported as striking until the territory around it has been
counted.</p>

<h3>The room that is locked, and says so</h3>
<p>One coordinate of the map is withheld. The twenty-seven cells answer to twenty-seven letters,
and which letter seats where is held by its keeper until the day it is confirmed. Nothing in the
system depends on it: every figure, number and pairing above derives without a single letter.</p>
<blockquote>Laid onto the cells, the twenty-seven sounds will either fit the geometry already drawn,
or they will not. … A book that could not fail its own last test would not be worth the tests it
passed.
<cite>The Light of Luminara, XIV</cite></blockquote>
<p>This is not a finished truth brought for endorsement. It is an instrument with a falsification
still pending, brought to readers whose judgement of the structure would be valued — with no claim
on anyone's vocabulary, anyone's calendar, or anyone's office.</p>

<h2><span class="movement">Appendix</span>The twenty-seven</h2>
<p>Pressed from the arithmetic at build time. <span class="mono">q</span> is the law and belongs to
no house; <span class="mono">p</span> is the voice. A dash under <i>becoming</i> means the card has
no turning depth and therefore no slope: nothing in it has begun to come home.
<span class="sil">◦</span> marks a Silence.</p>
${houseRows}

<footer>
  <p>Luminara — the twenty-seven. Figures derived, never drawn. The letters are sealed.
  Built from the sealed canon; every number on this page is computed, and if a claim here and the
  arithmetic ever disagree, this page is wrong.</p>
  <p>This portal makes no network request of any kind. Convergence is evidence, never authority.
  Nothing here predicts, and nothing here prescribes.</p>
</footer>

</main>

<script type="module">
${runtime}

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function walkOf(k) {
  const rows = [
    ['code', k.code + ' — the ' + k.states.join(', the ')],
    ['house', k.house.name + ' · ' + k.house.gloss + ' · ' + k.house.metal],
    ['law', 'q = ' + (k.q > 0 ? '+' : '') + k.q + (k.q === 0 ? ' — the count\\'s own zero' : '')],
    ['voice', 'p = ' + k.p + (k.p === 7 ? ' — no stillness remains, so the windings redouble' : '')],
    ['form', k.form.kind + (k.form.strands > 1 ? ', ' + k.form.strands + ' rings' : ', one strand')
             + ', genus ' + k.form.genus],
    ['sound', k.interval.name + ' (' + k.interval.ratio + ')' + (k.interval.locked ? ', locked' : '')],
    ['answer', k.answer + ' · ' + card(k.answer).name + ' — its antipode through the centre'],
    ['slope', k.turning === 0
        ? 'none: no depth is turning, so nothing has begun to come home'
        : card(k.becoming).name + ' — ' + k.turning + ' of three depths turning'],
  ];
  if (k.silence) rows.push(['silence', 'this cell asks ' + k.silence + ' — ' + k.asks]);
  return '<ul class="walk">' + rows.map(([a,b]) =>
    '<li><span class="k">' + esc(a) + '</span><span>' + esc(b) + '</span></li>').join('') + '</ul>';
}

function cardBlock(k, standing) {
  return '<div class="cardhead"><span class="cn">' + k.n + ' · ' + esc(k.name) + '</span>'
    + '<span class="cc">' + esc(k.code) + '</span></div>'
    + (standing ? '<p style="color:var(--dim);margin:.4rem 0 0">In <b>' + esc(standing.position.key)
        + '</b> — ' + esc(standing.position.gloss)
        + (standing.homeGround ? ' · <b>home ground</b>: the card stands in the position whose motion is its own.' : '')
        + '</p>' : '')
    + '<div class="cols" style="margin:1.2rem 0"><figure class="fig">' + mandala(k.n)
    + '<figcaption>from above — ' + Math.abs(k.q) + ' petals</figcaption></figure>'
    + '<figure class="fig">' + knot(k.n) + '<figcaption>from the side — the body of the '
    + k.form.kind + '</figcaption></figure></div>'
    + walkOf(k);
}

function render(cast) {
  let html = '';
  if (cast.positions) {
    html += cast.positions.map((p) => cardBlock(p.card, p)).join('<hr class="rule">');
  } else {
    html += cardBlock(cast.cards[0], null);
  }
  html += '<p class="seedline">' + esc(declaration(cast))
       + '<br>Replayable: the same seed returns the same cards, forever. There is no second draw.</p>';
  const out = $('out');
  out.innerHTML = html;
  out.classList.add('shown');
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('go').addEventListener('click', () => {
  const s = $('seed').value.trim();
  render(s ? castOne(s) : castOne());
});
$('go3').addEventListener('click', () => {
  const s = $('seed').value.trim();
  render(s ? castSpread(s) : castSpread());
});
</script>
</body>
</html>
`;

const outPath = join(here, 'portal', 'index.html');
writeFileSync(outPath, page, 'utf8');

// ── the build checks its own output ─────────────────────────────────

// 1. it must reach nothing outside itself
const net = /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|src="https?:/;
if (net.test(page)) {
  throw new Error('the portal reaches outside itself — build refused');
}

// 2. the inlined bundle must actually parse and run. Concatenating modules into one
//    scope can collide in ways the unit tests never see, because they import each
//    module into a scope of its own. This pin exists because that happened.
const script = page.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('the portal carries no runtime — build refused');
if (/^\s*(import|export)\s/m.test(script)) {
  throw new Error('the inline transform left an import/export behind — build refused');
}

const probe = join(here, '.build-probe.mjs');
try {
  // everything above the DOM wiring is the runtime; run it headlessly.
  const runtimeOnly = script.slice(0, script.indexOf('const $ ='));
  writeFileSync(probe, `${runtimeOnly}
export const check = () => {
  const k = card(10);
  if (k.name !== 'The Cut' || k.q !== 9) throw new Error('canon disagrees with itself');
  if (!mandala(10).startsWith('<svg')) throw new Error('no mandala');
  if (!knot(17).includes('<path')) throw new Error('no knot');
  if (castOne('probe').cards[0].n !== castOne('probe').cards[0].n) throw new Error('not replayable');
  let refused = false;
  try { castOne(new Date()); } catch (e) { refused = /no auspicious hour/.test(e.message); }
  if (!refused) throw new Error('a date seeded a cast');
  return true;
};
`, 'utf8');
  const { check } = await import(`file://${probe.replace(/\\\\/g, '/')}?t=${Date.now()}`);
  check();
} finally {
  try { (await import('node:fs')).unlinkSync(probe); } catch {}
}

console.log(`pressed portal/index.html — ${(page.length / 1024).toFixed(1)} KB, `
  + 'no external requests, runtime verified');
