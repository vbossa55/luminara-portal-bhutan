// THE CAST — chance, unsteerable, declared and replayable.
//
// The Caster's Law, enforced here rather than promised:
//   randomisation always · the seed declared and replayable · one cast and one reading ·
//   no composed spread ever presented as drawn.
//
// No network call is made from this file, ever. A public beacon value may be PASTED
// in as a seed by the operator; nothing here fetches one. A reading surface that
// reached the network with reading content would break PRIVACY and DAYLIGHT both.

import { card, POSITIONS } from './canon.mjs';

// xmur3 → sfc32. Deterministic, dependency-free, identical in node and the browser.
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function sfc32(a, b, c, d) {
  return function () {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * A seed is a declared string, and never a date.
 *
 * This guard is the electional boundary in code. Were a Date accepted here, the
 * portal would deterministically map a day to a card, and "today's card" is exactly
 * the surface the Aleatory Law closed: a calendar answers what o'clock it is on the
 * deck and nothing else. There is no auspicious hour and no forbidden one.
 */
function assertSeed(seed) {
  if (seed instanceof Date) {
    throw new TypeError(
      'A date may not seed a cast. There is no auspicious hour and no forbidden one.'
    );
  }
  if (typeof seed !== 'string' || seed.length === 0) {
    throw new TypeError(`Not a seed: ${String(seed)} — a seed is a declared, non-empty string.`);
  }
}

function rngFrom(seed) {
  assertSeed(seed);
  const h = xmur3(seed);
  return sfc32(h(), h(), h(), h());
}

/** A seed nobody chose by hand. Declared in full on every cast that uses it. */
export function freshSeed(label = 'cast') {
  if (typeof label !== 'string' || label.length === 0) {
    throw new TypeError(`Not a label: ${String(label)} — a label is a non-empty string.`);
  }
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // no crypto source: fall back honestly, and say so in the seed itself.
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    label = `${label}-unverified`;
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${label}|${Date.now().toString(36)}:${hex}`;
}

/**
 * One card, drawn. The walk of a single card.
 * The same seed always returns the same card, forever.
 */
export function castOne(seed = freshSeed('one')) {
  const rng = rngFrom(seed);
  const n = 1 + Math.floor(rng() * 27);
  return { drawn: true, composed: false, seed, cards: [card(n)] };
}

/**
 * Three cards into the three fixed positions. Without replacement:
 * the positions are the frame, and one card cannot stand in two of them.
 */
export function castSpread(seed = freshSeed('spread')) {
  const rng = rngFrom(seed);
  const pool = Array.from({ length: 27 }, (_, i) => i + 1);
  // Fisher–Yates, consuming the stream in a fixed order so the cast is replayable.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const chosen = pool.slice(0, 3);
  return {
    drawn: true,
    composed: false,
    seed,
    cards: chosen.map((n) => card(n)),
    positions: POSITIONS.map((p, i) => ({
      position: p,
      card: card(chosen[i]),
      homeGround: card(chosen[i]).digits[0] === p.motion,
    })),
  };
}

/**
 * A spread assembled by hand, for teaching. It is marked composed and can never
 * be marked drawn — the law forbids presenting a composed spread as a cast.
 */
export function compose(numbers) {
  if (!Array.isArray(numbers) || numbers.length !== 3) {
    throw new RangeError('A composed spread is three cards.');
  }
  return {
    drawn: false,
    composed: true,
    seed: null,
    cards: numbers.map((n) => card(n)),
    positions: POSITIONS.map((p, i) => ({
      position: p,
      card: card(numbers[i]),
      homeGround: card(numbers[i]).digits[0] === p.motion,
    })),
  };
}

/** The cast declared, so anyone may replay it and receive the same card. */
export function declaration(cast) {
  if (typeof cast !== 'object' || cast === null || typeof cast.drawn !== 'boolean') {
    throw new TypeError('Not a cast.');
  }
  if (!cast.drawn) return 'Composed by hand for teaching. Not a cast.';
  return `Cast: ${cast.seed}`;
}
