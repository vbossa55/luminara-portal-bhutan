// THE CANON — the derivation, and the only source of truth in this portal.
//
// Nothing in this file stores what a card MEANS. Every property below is computed
// from three ternary digits. The one human-given table is NAMES, permitted because
// the canon names it as human-given (THE LIGHT OF LUMINARA, Ch. I: everything is
// recoverable from number "except two things: the names ... and the letters").
// The letters are sealed and do not appear here at all.
//
// Derived, never drawn. Computed and chosen stay named.

// ── THE THREE STATES ────────────────────────────────────────────────
// A digit is 0, 1, or 2. Its sign is what the arithmetic uses.
export const STILL = 0;
export const FLOWING = 1;
export const TURNING = 2;

export const MARK = { [STILL]: '●', [FLOWING]: '—', [TURNING]: '~' }; // dot, bar, wave
export const STATE_NAME = { [STILL]: 'still', [FLOWING]: 'flowing', [TURNING]: 'turning' };

// still adds nothing; flowing reaches outward, +1; turning draws inward, -1.
const SIGN = { [STILL]: 0, [FLOWING]: +1, [TURNING]: -1 };

// The answer negates every motion: still stays still, flowing and turning exchange.
const NEGATE = { [STILL]: STILL, [FLOWING]: TURNING, [TURNING]: FLOWING };

// The becoming resolves only what has begun to turn home. Flow is still running outward.
const SETTLE = { [STILL]: STILL, [FLOWING]: FLOWING, [TURNING]: STILL };

// ── THE THREE DEPTHS ────────────────────────────────────────────────
// Read outward to inward. Weighted by the places of base three: the field is heaviest.
export const DEPTHS = [
  { key: 'field', gloss: 'the world', weight: 9 },
  { key: 'relation', gloss: 'the between', weight: 3 },
  { key: 'core', gloss: 'the heart', weight: 1 },
];

// ── THE THREE HOUSES ────────────────────────────────────────────────
// The house is the heaviest digit. Not nine houses: three provinces of nine.
export const HOUSES = {
  [STILL]: { name: 'AUM', gloss: 'the bulk: what could be', metal: 'bronze' },
  [FLOWING]: { name: 'MA', gloss: 'the splitter: what cuts', metal: 'silver' },
  [TURNING]: { name: 'RA', gloss: 'the surface: what radiates', metal: 'gold' },
};

// ── THE NAMES (the one human-given table) ───────────────────────────
export const NAMES = [
  'The Seed', 'The Drift', 'The Fold', 'The Resonance', 'The Depth',
  'The Saturation', 'The Dreamer', 'The Knot', 'The Threshold', 'The Cut',
  'The Mirror', 'The Gate', 'The Surgeon', 'The Scar', 'The Twins',
  'The Labyrinth', 'The Void', 'The Bridge', 'The Ray', 'The Face',
  'The Echo', 'The Mask', 'The Beacon', 'The Spectrum', 'The Witness',
  'The Crown', 'The Return',
];

// ── THE SILENCES ────────────────────────────────────────────────────
// Four cells that do not answer. They ask instead. Seated by the canon, not derived:
// which four is a decision of the sealed layer (THE LIGHT, Ch. XI).
export const SILENCES = {
  4: 'descent',
  16: 'widening',
  22: 'surrender',
  25: 'recognition',
};

export const SILENCE_ASKS = {
  descent: 'What holds this lies below where symbols work. Go down, and do not translate.',
  widening: 'This opens past the frame you brought. Do not shrink it to the question.',
  surrender: 'This is a crossing between orders. The one who emerges is not yet the one who asked.',
  recognition: 'You have been here before. Be still and know it, and do not rename it.',
};

// ── THE READING FRAME ───────────────────────────────────────────────
// The three positions are the three motions applied one level up, to time itself.
export const POSITIONS = [
  { key: 'root', motion: STILL, gloss: 'what is knotted in and cannot be undone' },
  { key: 'present', motion: FLOWING, gloss: 'the live cut of the moment' },
  { key: 'becoming', motion: TURNING, gloss: 'what draws forward' },
];

// ── THE INTERVAL LEXICON ────────────────────────────────────────────
// Keyed by the reduced ratio, never by card. Two cards with one ratio share one name.
const INTERVALS = {
  '0:1': 'silence',
  '1:1': 'the unison',
  '1:2': 'the octave',
  '2:1': 'the octave',
  '2:3': 'the perfect fifth',
  '3:2': 'the perfect fifth',
  '3:4': 'the perfect fourth',
  '4:3': 'the perfect fourth',
  '4:1': 'the double octave',
  '5:7': 'the tritone',
  '7:5': 'the tritone',
  '8:3': 'the eleventh',
  '9:2': 'the tone, twice raised',
  '10:3': 'the sixth beyond the octave',
  '11:7': 'the alien interval',
  '13:7': 'the far dissonance',
};

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

// ── THE GUARDS ──────────────────────────────────────────────────────
// Every entry to the derivation validates. A card is an integer from one to
// twenty-seven and nothing else — in particular never a date, because a date
// must never select a card. There is no auspicious hour and no forbidden one.

function assertCardNumber(n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > 27) {
    throw new RangeError(
      `Not a card: ${String(n)} — the deck is 1 to 27 and there is no twenty-eighth.`
    );
  }
}

function assertDigits(d) {
  const ok = Array.isArray(d) && d.length === 3
    && d.every((x) => x === STILL || x === FLOWING || x === TURNING);
  if (!ok) {
    throw new RangeError(
      `Not a code: ${String(d)} — three digits, each still, flowing, or turning.`
    );
  }
}

// ── THE DERIVATION ──────────────────────────────────────────────────

/** The three digits of a card number, outward to inward. */
export function digits(n) {
  assertCardNumber(n);
  const i = n - 1;
  return [Math.floor(i / 9) % 3, Math.floor(i / 3) % 3, i % 3];
}

/** The card number from three digits. Nine, three, one, plus one. */
export function number(d) {
  assertDigits(d);
  return 9 * d[0] + 3 * d[1] + d[2] + 1;
}

/** The law. q = 9s0 + 3s1 + s2, each s in {-1,0,+1}. Balanced ternary: [-13,+13], each once. */
export function law(d) {
  assertDigits(d);
  return 9 * SIGN[d[0]] + 3 * SIGN[d[1]] + SIGN[d[2]];
}

/** The voice. One more than the moving depths — and when the last stillness leaves, redoubled. */
export function voice(d) {
  assertDigits(d);
  const moving = d.filter((x) => x !== STILL).length;
  return moving === 3 ? 7 : 1 + moving;
}

/** The answer: layerwise negation. The antipode through the cube's centre. */
export function answer(n) {
  return number(digits(n).map((x) => NEGATE[x]));
}

/** The becoming: resolve every turning to the stillness it is completing into. */
export function becoming(n) {
  return number(digits(n).map((x) => SETTLE[x]));
}

/** The form. T(p,q) on the torus; where p and q share a factor the strand closes into rings. */
export function form(n) {
  const d = digits(n);
  const q = law(d), p = voice(d);
  if (q === 0) return { kind: 'circle', strands: 1, genus: 0 };
  const strands = gcd(p, q);
  const genus = ((p - 1) * (Math.abs(q) - 1)) / 2;
  if (strands > 1) return { kind: 'link', strands, genus };
  if (Math.abs(q) === 1 || p === 1) return { kind: 'coil', strands: 1, genus };
  return { kind: 'knot', strands: 1, genus };
}

/** The sound. The two winding frequencies, |q| against p, reduced. */
export function interval(n) {
  const d = digits(n);
  const q = Math.abs(law(d)), p = voice(d);
  if (q === 0) return { ratio: '0:1', name: INTERVALS['0:1'], locked: false };
  const g = gcd(q, p);
  const ratio = `${q / g}:${p / g}`;
  return {
    ratio,
    name: INTERVALS[ratio] ?? `${q / g} against ${p / g}`,
    locked: g > 1, // the strand no longer needs to be one strand
  };
}

/** Everything a card is, computed. No stored meaning anywhere. */
export function card(n) {
  const d = digits(n);
  const q = law(d);
  const f = form(n);
  const iv = interval(n);
  const silence = SILENCES[n] ?? null;
  return {
    n,
    name: NAMES[n - 1],
    code: d.map((x) => MARK[x]).join(' '),
    digits: d,
    states: d.map((x) => STATE_NAME[x]),
    q,
    p: voice(d),
    house: HOUSES[d[0]],
    form: f,
    interval: iv,
    // consonance: nearness to the still centre. 0 at the Seed, 1 at the far dissonance.
    dissonance: Math.abs(q) / 13,
    answer: answer(n),
    becoming: becoming(n),
    // how far the card must travel: how many of its depths are turning.
    turning: d.filter((x) => x === TURNING).length,
    silence,
    asks: silence ? SILENCE_ASKS[silence] : null,
  };
}

/** The whole deck, in order. */
export function deck() {
  return Array.from({ length: 27 }, (_, i) => card(i + 1));
}

/** The census of forms, counted rather than declared. */
export function census() {
  const c = { circle: 0, coil: 0, knot: 0, link: 0, trefoil: 0 };
  for (const k of deck()) {
    c[k.form.kind] += 1;
    const pair = [k.p, Math.abs(k.q)].sort((a, b) => a - b).join(':');
    if (pair === '2:3') c.trefoil += 1;
  }
  return c;
}

/** Where a card stands. The fourth ternary place: a card in a position. */
export function standing(n, positionKey) {
  const pos = POSITIONS.find((p) => p.key === positionKey);
  if (!pos) throw new RangeError(`Not a position: ${positionKey}`);
  const k = card(n);
  return {
    card: k,
    position: pos,
    // home ground: the diagonal of the eighty-one, where the newest digit agrees with the first.
    homeGround: k.digits[0] === pos.motion,
  };
}
