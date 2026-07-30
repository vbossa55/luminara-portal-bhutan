// THE BUILT ARTIFACT, PINNED.
//
// The unit tests import each module into a scope of its own. The portal concatenates
// them into one scope, which is a different artifact and can fail in ways the unit
// tests cannot see — it did: two modules each carried a private gcd, and the bundle
// was a SyntaxError while every other test stayed green. This file watches the output.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const built = join(root, 'portal', 'index.html');

function bundle() {
  if (!existsSync(built)) return null;
  const html = readFileSync(built, 'utf8');
  const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  return m ? { html, script: m[1] } : { html, script: null };
}

test('the portal is built and carries a runtime', () => {
  const b = bundle();
  if (!b) { console.log('  (not built — run npm run build)'); return; }
  assert.ok(b.script, 'the portal carries no module script');
  assert.ok(b.script.length > 5000, 'the runtime looks truncated');
});

test('the inline transform leaves no import or export behind', () => {
  const b = bundle();
  if (!b?.script) return;
  assert.ok(!/^\s*import\s/m.test(b.script), 'an import survived inlining');
  assert.ok(!/^\s*export\s/m.test(b.script), 'an export survived inlining');
});

test('the bundled runtime parses and runs in one scope', async () => {
  const b = bundle();
  if (!b?.script) return;
  const runtimeOnly = b.script.slice(0, b.script.indexOf('const $ ='));
  assert.ok(runtimeOnly.length > 1000, 'could not find the runtime portion');

  const probe = join(root, '.portal-probe.mjs');
  writeFileSync(probe, `${runtimeOnly}
export const api = { card, mandala, knot, rosette, castOne, castSpread, compose, declaration };
`, 'utf8');
  try {
    const { api } = await import(`file://${probe.replace(/\\/g, '/')}?t=${Date.now()}`);

    // the canon survives the trip
    const k = api.card(10);
    assert.equal(k.name, 'The Cut');
    assert.equal(k.q, 9);
    assert.equal(k.becoming, 10); // nothing in it turns, so it does not settle

    // the figures still derive
    assert.ok(api.mandala(10).startsWith('<svg'));
    assert.ok(api.knot(17).includes('<path'));
    assert.ok(api.rosette().includes('<circle'));

    // the law still holds in the browser bundle
    assert.equal(api.castOne('pin').cards[0].n, api.castOne('pin').cards[0].n);
    assert.throws(() => api.castOne(new Date()), /no auspicious hour/);
    assert.equal(api.compose([1, 14, 27]).drawn, false);
    assert.match(api.declaration(api.castOne('pin')), /^Cast: /);

    // seven rings, drawn as seven rings
    const paths = api.knot(17).match(/<path/g) ?? [];
    assert.equal(paths.length, 7, 'The Void should be drawn as seven rings');
  } finally {
    try { unlinkSync(probe); } catch {}
  }
});

test('the portal presents the electional boundary in plain sight', () => {
  const b = bundle();
  if (!b) return;
  assert.match(b.html, /no auspicious hour and no forbidden one/);
  assert.match(b.html, /The agreement is the moon's, not ours/);
  assert.match(b.html, /COMPANIONSHIP/);
  assert.match(b.html, /a companion, never a guide of souls/);
});

test('the portal shows no letters and no karma', () => {
  const b = bundle();
  if (!b) return;
  // the letters are sealed pending the keeper's key
  assert.ok(!/\bthe alphabet\b/i.test(b.html), 'the portal reaches for the sealed letters');
  // the Carry travels as arithmetic only: no claim to succeed any older account
  assert.ok(!/karma/i.test(b.html), 'the portal names karma');
});
