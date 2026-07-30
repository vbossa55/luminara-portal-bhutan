// THE PINS — the derivation, checked against the sealed canon's own tables.
// If a claim in this portal and the arithmetic ever disagree, the portal is wrong.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/canon.mjs';

test('the deck is twenty-seven, and there is no twenty-eighth', () => {
  assert.equal(C.deck().length, 27);
  assert.throws(() => C.card(0), RangeError);
  assert.throws(() => C.card(28), RangeError);
  assert.throws(() => C.card(1.5), RangeError);
  assert.throws(() => C.card('10'), RangeError);
});

test('balanced ternary: every value from -13 to +13, each exactly once', () => {
  const qs = C.deck().map((k) => k.q).sort((a, b) => a - b);
  assert.deepEqual(qs, Array.from({ length: 27 }, (_, i) => i - 13));
});

test('digits and number are inverse for all twenty-seven', () => {
  for (let n = 1; n <= 27; n++) assert.equal(C.number(C.digits(n)), n);
});

test('the law: the Seed is nought, the Scar +13, the Return -13', () => {
  assert.equal(C.card(1).q, 0);
  assert.equal(C.card(14).q, +13);
  assert.equal(C.card(27).q, -13);
  assert.equal(C.card(1).name, 'The Seed');
  assert.equal(C.card(14).name, 'The Scar');
  assert.equal(C.card(27).name, 'The Return');
});

test('the answer is an involution with exactly one fixed point, and it is the Seed', () => {
  let fixed = [];
  for (let n = 1; n <= 27; n++) {
    assert.equal(C.answer(C.answer(n)), n, `card ${n} is not its answer's answer`);
    if (C.answer(n) === n) fixed.push(n);
  }
  assert.deepEqual(fixed, [1]);
});

test('a card met by its answer sums to nought', () => {
  for (let n = 1; n <= 27; n++) {
    assert.equal(C.card(n).q + C.card(C.answer(n)).q, 0);
  }
});

test('AUM is closed under the involution; MA and RA map to each other', () => {
  for (const k of C.deck()) {
    const a = C.card(k.answer);
    if (k.house.name === 'AUM') assert.equal(a.house.name, 'AUM');
    if (k.house.name === 'MA') assert.equal(a.house.name, 'RA');
    if (k.house.name === 'RA') assert.equal(a.house.name, 'MA');
  }
});

test('three provinces of nine, and the houses are the only thirds of the line', () => {
  const by = { AUM: [], MA: [], RA: [] };
  for (const k of C.deck()) by[k.house.name].push(k.q);
  assert.equal(by.AUM.length, 9);
  assert.equal(by.MA.length, 9);
  assert.equal(by.RA.length, 9);
  assert.ok(Math.max(...by.AUM.map(Math.abs)) <= 4, 'AUM gathers close about the Seed');
  assert.ok(Math.min(...by.MA) === 5 && Math.max(...by.MA) === 13, 'MA is the far positive country');
  assert.ok(Math.max(...by.RA) === -5 && Math.min(...by.RA) === -13, 'RA is the far negative country');
});

test('the voice: one more than the moving depths, redoubled when the last stillness leaves', () => {
  for (const k of C.deck()) {
    const moving = k.digits.filter((d) => d !== C.STILL).length;
    assert.equal(k.p, moving === 3 ? 7 : 1 + moving, `${k.name} winds wrongly`);
  }
  assert.equal(C.card(1).p, 1);   // the Seed winds nothing
  assert.equal(C.card(14).p, 7);  // the Scar, restless
  assert.equal(C.card(23).p, 7);  // the Beacon, met in the wild by the canon's own walk
});

test('the census is what the canon counts: 1 circle, 2 coils, 18 knots (4 trefoils), 6 links', () => {
  assert.deepEqual(C.census(), { circle: 1, coil: 2, knot: 18, link: 6, trefoil: 4 });
});

test('the six link-cards stand in three bound pairs, and the pairs are answer-pairs', () => {
  const links = C.deck().filter((k) => k.form.kind === 'link').map((k) => k.n);
  assert.equal(links.length, 6);
  const pairs = new Set();
  for (const n of links) {
    assert.ok(links.includes(C.answer(n)), `link ${n}'s answer is not a link`);
    pairs.add([n, C.answer(n)].sort((a, b) => a - b).join('-'));
  }
  assert.equal(pairs.size, 3);
});

test('the Beacon is genus twelve, as the canon walked it', () => {
  assert.equal(C.card(23).form.genus, 12);
  assert.equal(C.card(23).form.kind, 'knot');
  assert.equal(C.card(23).form.strands, 1);
});

test('the Scar carries the greatest genus in the deck', () => {
  const max = Math.max(...C.deck().map((k) => k.form.genus));
  assert.equal(C.card(14).form.genus, max);
});

test('only turnings resolve: a card with no turning mark settles to itself', () => {
  for (const k of C.deck()) {
    if (k.turning === 0) assert.equal(k.becoming, k.n, `${k.name} should not settle`);
    else assert.notEqual(k.becoming, k.n, `${k.name} should settle somewhere else`);
  }
});

test('the becomings the canon states by name', () => {
  assert.equal(C.becoming(27), 1);  // The Return settles all the way to the Seed
  assert.equal(C.becoming(3), 1);   // The Fold: the shortest cadence in the deck
  assert.equal(C.becoming(23), 5);  // The Beacon becomes The Depth
  assert.equal(C.becoming(12), 10); // The Gate remembers it began as an opening
  assert.equal(C.becoming(8), 2);   // The Knot loosens into The Drift
  assert.equal(C.becoming(6), 4);   // The Saturation falls back into The Resonance
  assert.equal(C.becoming(22), 4);  // Lift the Mask and the pure fifth stands behind it
  assert.equal(C.becoming(17), 11); // The Void, faced, becomes reflection
  assert.equal(C.becoming(15), 13); // Bifurcation submits to the operation that binds
  assert.equal(C.becoming(10), 10); // The Cut does not settle: nothing in it turns
});

test('the sound: the intervals the canon names', () => {
  assert.equal(C.interval(1).name, 'silence');
  assert.equal(C.interval(4).ratio, '3:2');
  assert.equal(C.interval(4).name, 'the perfect fifth');
  assert.equal(C.interval(7).name, 'the perfect fifth');  // the fifth in the left hand
  assert.equal(C.interval(5).name, 'the perfect fourth');
  assert.equal(C.interval(18).name, 'the tritone');       // The Bridge
  assert.equal(C.interval(23).name, 'the tritone');       // The Beacon, the same span
  assert.equal(C.interval(14).name, 'the far dissonance');
  assert.equal(C.interval(27).name, 'the far dissonance');
});

test('a card and its answer sound the same interval in opposite hands', () => {
  for (const k of C.deck()) {
    assert.equal(C.interval(k.n).ratio, C.interval(k.answer).ratio, `${k.name} and its answer differ`);
  }
});

test('where the ratio reduces the strand has locked into rings', () => {
  for (const k of C.deck()) {
    assert.equal(k.interval.locked, k.form.kind === 'link', `${k.name} disagrees with its own sound`);
  }
});

test('the four Silences are seated at four, sixteen, twenty-two and twenty-five', () => {
  const silent = C.deck().filter((k) => k.silence).map((k) => k.n);
  assert.deepEqual(silent, [4, 16, 22, 25]);
  assert.deepEqual(silent.map((n) => C.card(n).silence),
    ['descent', 'widening', 'surrender', 'recognition']);
});

test('every Silence holds a still core — the signature of the unreadable', () => {
  for (const n of [4, 16, 22, 25]) {
    assert.equal(C.card(n).digits[2], C.STILL, `card ${n} does not hold a still core`);
  }
});

test('every suit-opener has a still core; every suit-closer is inward-turning', () => {
  for (const n of [1, 10, 19]) assert.equal(C.card(n).digits[2], C.STILL);
  for (const n of [9, 18, 27]) {
    assert.equal(C.card(n).digits[1], C.TURNING);
    assert.equal(C.card(n).digits[2], C.TURNING);
  }
});

test('the eighty-one: the map in use, and its diagonal is a third of it', () => {
  let cells = 0, home = 0;
  const byHouse = { AUM: 0, MA: 0, RA: 0 };
  for (let n = 1; n <= 27; n++) {
    for (const pos of C.POSITIONS) {
      const s = C.standing(n, pos.key);
      cells += 1;
      if (s.homeGround) { home += 1; byHouse[s.card.house.name] += 1; }
    }
  }
  assert.equal(cells, 81);
  // The diagonal cells, where the fourth ternary place agrees with the first: every card
  // is at home in exactly one of the three positions, so the diagonal is 27, not 9 —
  // nine AUM cards in the root, nine MA in the present, nine RA in the becoming.
  assert.equal(home, 27);
  assert.deepEqual(byHouse, { AUM: 9, MA: 9, RA: 9 });
});

test('a card is at home in exactly one position', () => {
  for (let n = 1; n <= 27; n++) {
    const at = C.POSITIONS.filter((p) => C.standing(n, p.key).homeGround);
    assert.equal(at.length, 1, `${C.card(n).name} is at home in ${at.length} positions`);
  }
});

test('the circle closes: counted one further, the last card becomes the first', () => {
  const next = (n) => (n % 27) + 1;
  assert.equal(next(27), 1);
  assert.equal(C.card(27).code, '~ ~ ~');
  assert.equal(C.card(1).code, '● ● ●');
});
