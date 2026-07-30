// THE FIGURES — derived, never drawn.
//
// No card has an illustration. Both views are computed from p and q alone:
//   from above, the mandala, whose petals number |q|;
//   from the side, the body of the knot itself, the strand winding a ring.
// Where the strand closes early, the figure is several rings, and the figure
// says so by being several rings. Nothing is added to a card by hand.

import { card } from './canon.mjs';

const TAU = Math.PI * 2;

// The strand count is not recomputed here. The canon derives it; the figure only draws it.

/**
 * The mandala: the figure from above. Petals number |q|, sign set aside.
 * The Seed, winding nothing, is a plain ring — a dark disc within a ring.
 */
export function mandala(n, { size = 220, stroke = 1.6 } = {}) {
  const k = card(n);
  const q = Math.abs(k.q);
  const c = size / 2;
  const base = size * 0.30;
  const amp = q === 0 ? 0 : size * 0.085;
  const steps = 720;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const r = base + amp * Math.cos(q * t);
    pts.push([c + r * Math.cos(t), c + r * Math.sin(t)]);
  }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('') + 'Z';
  const inner = q === 0
    ? `<circle cx="${c}" cy="${c}" r="${(base * 0.55).toFixed(2)}" class="lum-null"/>`
    : '';
  return `<svg viewBox="0 0 ${size} ${size}" class="lum-fig lum-mandala" aria-hidden="true">
  <path d="${d}" fill="none" stroke="currentColor" stroke-width="${stroke}"/>
  ${inner}
</svg>`;
}

/**
 * The knot: the figure from the side. The strand winds p times one way and q the other.
 * Where p and q share a factor the strand closes after a fraction of the full turn,
 * and the remaining rings are that same strand rotated — a link, drawn as what it is.
 */
export function knot(n, { size = 220, stroke = 1.5, tilt = 0.42 } = {}) {
  const k = card(n);
  const { p, q } = k;
  const c = size / 2;
  const R = size * 0.26;   // the ring
  const r = size * 0.105;  // the tube
  const strands = k.form.strands; // derived by the canon, never recounted here

  if (q === 0) {
    // The Seed: the loop that closes without turning.
    return `<svg viewBox="0 0 ${size} ${size}" class="lum-fig lum-knot" aria-hidden="true">
  <ellipse cx="${c}" cy="${c}" rx="${R.toFixed(2)}" ry="${(R * tilt).toFixed(2)}"
           fill="none" stroke="currentColor" stroke-width="${stroke}"/>
</svg>`;
  }

  const span = TAU / strands; // the strand closes early when it closes early
  const steps = 900;
  const paths = [];
  for (let s = 0; s < strands; s++) {
    const offset = (s * TAU) / strands;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = offset + (i / steps) * span * p;
      const phi = (q / p) * (t - offset) + offset;
      const rad = R + r * Math.cos(phi);
      const x = c + rad * Math.cos(t);
      const y = c + rad * Math.sin(t) * tilt + r * Math.sin(phi) * (1 - tilt);
      pts.push([x, y]);
    }
    paths.push(
      `<path d="${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('')}"
            fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round"/>`
    );
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="lum-fig lum-knot" aria-hidden="true">
  ${paths.join('\n  ')}
</svg>`;
}

/** The code at the foot of the card: three marks, field then relation then core. */
export function codeMarks(n) {
  return card(n).code;
}

/** The rosette: all twenty-seven, laid on the circle they close on. */
export function rosette({ size = 460 } = {}) {
  const c = size / 2;
  const R = size * 0.40;
  const cells = [];
  for (let i = 0; i < 27; i++) {
    const k = card(i + 1);
    const t = (i / 27) * TAU - Math.PI / 2;
    const x = c + R * Math.cos(t);
    const y = c + R * Math.sin(t);
    // radius carries the law: the Seed smallest, the far dissonances largest.
    const rad = 3 + (Math.abs(k.q) / 13) * 7;
    const house = ['aum', 'ma', 'ra'][k.digits[0]];
    cells.push(
      `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${rad.toFixed(2)}" class="lum-cell lum-${house}"/>`
    );
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="lum-fig lum-rosette" aria-hidden="true">
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="currentColor" stroke-opacity="0.18" stroke-width="1"/>
  ${cells.join('\n  ')}
</svg>`;
}
