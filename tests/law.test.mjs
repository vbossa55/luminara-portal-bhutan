// THE LAW, PINNED — the refusals enforced structurally rather than promised.
//
// The deepest form of the guard is that misusing this portal requires changing the
// code, not merely the intention. These tests are what make that true here.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as C from '../src/canon.mjs';
import * as D from '../src/draw.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const srcFiles = readdirSync(join(root, 'src')).filter((f) => f.endsWith('.mjs'));
const sources = srcFiles.map((f) => ({ f, text: readFileSync(join(root, 'src', f), 'utf8') }));

// ── NO STORED MEANING ───────────────────────────────────────────────
// There is no table of twenty-seven meanings, because there is nowhere for one to live.

test('the only per-card table is NAMES, which the canon names as human-given', () => {
  const perCard = Object.entries(C)
    .filter(([, v]) => Array.isArray(v) && v.length === 27)
    .map(([k]) => k);
  assert.deepEqual(perCard, ['NAMES'], `unexpected per-card table(s): ${perCard.join(', ')}`);
});

test('no export carries meanings, essences, or interpretations', () => {
  const forbidden = /^(MEANINGS|ESSENCES|INTERPRETATIONS|READINGS|TEXTS|FORTUNES)$/i;
  for (const key of Object.keys(C)) assert.ok(!forbidden.test(key), `canon exports ${key}`);
  for (const key of Object.keys(D)) assert.ok(!forbidden.test(key), `draw exports ${key}`);
});

test('a card carries no authored prose about itself', () => {
  const k = C.card(14); // the Scar, the deck's most tempting card to editorialise
  const strings = Object.entries(k)
    .filter(([, v]) => typeof v === 'string')
    .map(([key]) => key);
  // name, code, and the derived interval/house glosses only. No essence, no advice.
  assert.deepEqual(strings.sort(), ['code', 'name']);
});

test('the letters are sealed and appear nowhere', () => {
  const letterish = /\b(LETTERS|ALPHABET|letterFor|letterOf)\b/;
  for (const { f, text } of sources) {
    assert.ok(!letterish.test(text), `${f} reaches for the sealed letters`);
  }
});

// ── NO PREDICTION, NO PERMISSION ────────────────────────────────────
// The moment a calendar exists, the electional question knocks. It is answered here
// by there being no surface to ask it through: no export takes a date.

test('no surface that takes input accepts a date', () => {
  // Every export that reads an argument, named so a new one cannot be added silently.
  const surfaces = [
    ['card', C.card], ['digits', C.digits], ['number', C.number], ['law', C.law],
    ['voice', C.voice], ['answer', C.answer], ['becoming', C.becoming],
    ['form', C.form], ['interval', C.interval], ['standing', C.standing],
    ['freshSeed', D.freshSeed], ['castOne', D.castOne], ['castSpread', D.castSpread],
    ['compose', D.compose], ['declaration', D.declaration],
  ];
  for (const [key, fn] of surfaces) {
    assert.throws(
      () => fn(new Date()),
      (err) => err instanceof RangeError || err instanceof TypeError,
      `${key} accepted a Date`
    );
  }
  // and the roster is complete: every exported function is either listed or takes nothing.
  const nullary = new Set(['deck', 'census']);
  for (const mod of [C, D]) {
    for (const [key, v] of Object.entries(mod)) {
      if (typeof v !== 'function') continue;
      assert.ok(
        surfaces.some(([k]) => k === key) || nullary.has(key),
        `export ${key} is neither pinned against dates nor known to take nothing`
      );
    }
  }
});

test('a date can never seed a cast — the electional boundary, in code', () => {
  assert.throws(() => D.castOne(new Date()), /no auspicious hour/);
  assert.throws(() => D.castSpread(new Date()), /no auspicious hour/);
  // nor by the back door of a stringified date used as a label
  assert.throws(() => D.freshSeed(new Date()), TypeError);
  // a seed must be a declared string, not a number a date could become
  assert.throws(() => D.castOne(Date.now()), TypeError);
  assert.throws(() => D.castOne(''), TypeError);
  assert.throws(() => D.castOne(null), TypeError);
});

test('no export is named for election, augury, or fortune', () => {
  const forbidden = /auspicious|inauspicious|propitious|elect|augur|fortune|lucky|omen|predict|forecast/i;
  for (const mod of [C, D]) {
    for (const key of Object.keys(mod)) {
      assert.ok(!forbidden.test(key), `export ${key} names an office this portal refuses`);
    }
  }
});

test('nothing scores a person', () => {
  const forbidden = /score|rank|rating|grade|streak|level|xp/i;
  for (const mod of [C, D]) {
    for (const key of Object.keys(mod)) assert.ok(!forbidden.test(key), `export ${key} scores`);
  }
  const k = C.card(7);
  for (const [key, v] of Object.entries(k)) {
    if (typeof v !== 'number') continue;
    assert.ok(!/score|rank|grade/i.test(key), `${key} is a score`);
  }
});

// ── NO NETWORK FROM A READING SURFACE ───────────────────────────────

test('no source reaches the network', () => {
  const net = /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|navigator\.sendBeacon|node:https?\b/;
  for (const { f, text } of sources) {
    assert.ok(!net.test(text), `${f} reaches the network`);
  }
});

test('the built portal reaches nothing outside itself', () => {
  let html;
  try {
    html = readFileSync(join(root, 'portal', 'index.html'), 'utf8');
  } catch {
    return; // not built yet; the build itself runs this pin
  }
  const net = /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|src="https?:|href="https?:\/\/(?!.*#)/;
  assert.ok(!net.test(html), 'the portal reaches outside itself');
  assert.ok(!/<input[^>]+type="date"/i.test(html), 'the portal offers a date surface');
});

// ── THE CAST ────────────────────────────────────────────────────────

test('the seed is declared on every cast', () => {
  assert.ok(D.castOne().seed, 'a single cast declared no seed');
  assert.ok(D.castSpread().seed, 'a spread declared no seed');
  assert.match(D.declaration(D.castOne()), /^Cast: /);
});

test('the same seed returns the same cards, forever', () => {
  for (let i = 0; i < 200; i++) {
    const seed = `pin-${i}`;
    assert.equal(D.castOne(seed).cards[0].n, D.castOne(seed).cards[0].n);
    assert.deepEqual(
      D.castSpread(seed).cards.map((k) => k.n),
      D.castSpread(seed).cards.map((k) => k.n)
    );
  }
});

test('randomisation always: over many seeds every one of the twenty-seven arrives', () => {
  const seen = new Set();
  for (let i = 0; i < 4000; i++) seen.add(D.castOne(`sweep-${i}`).cards[0].n);
  assert.equal(seen.size, 27, `only ${seen.size} of the twenty-seven ever appeared`);
});

test('a spread stands three distinct cards in three positions', () => {
  for (let i = 0; i < 300; i++) {
    const s = D.castSpread(`spread-${i}`);
    assert.equal(s.cards.length, 3);
    assert.equal(new Set(s.cards.map((k) => k.n)).size, 3, 'a card stood in two positions');
    assert.deepEqual(s.positions.map((p) => p.position.key), ['root', 'present', 'becoming']);
  }
});

test('a composed spread can never be presented as drawn', () => {
  const c = D.compose([1, 14, 27]);
  assert.equal(c.drawn, false);
  assert.equal(c.composed, true);
  assert.equal(c.seed, null);
  assert.match(D.declaration(c), /Not a cast/);
});

test('the cast is one cast: no export re-rolls a standing reading', () => {
  const forbidden = /reroll|redraw|again|retry|shuffleAgain/i;
  for (const key of Object.keys(D)) assert.ok(!forbidden.test(key), `draw exports ${key}`);
});
