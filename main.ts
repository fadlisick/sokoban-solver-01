import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const D = [[0, -1], [0, 1], [-1, 0], [1, 0]], L = 'udlr';
function P(t) {
  const r = t.split('\n').filter(x => x.length), h = r.length, w = Math.max(...r.map(x => x.length)), a = new Uint8Array(w * h).fill(1), g = [], b = [];
  let p = -1;
  r.forEach((s, y) => { for (let x = 0; x < s.length; x++) { const c = s[x], i = y * w + x; if (c == '#') continue; a[i] = 0; if ('.*+'.includes(c)) g.push(i); if ('$*'.includes(c)) b.push(i); if ('@+'.includes(c)) p = i; } });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!x || !y || x == w - 1 || y == h - 1) a[y * w + x] = 1;
  return { w, a, g, b: b.sort((x, y) => x - y), p };
}
function V(l) {
  const v = new Uint8Array(l.a.length), q = [...l.g];
  for (const g of l.g) v[g] = 1;
  for (let i = 0; i < q.length; i++) { const x = q[i]; for (const [dx, dy] of D) { const d = dy * l.w + dx, y = x - d; if (!l.a[y] && !l.a[y - d] && !v[y]) { v[y] = 1; q.push(y); } } }
  return v;
}
function E(l, o, f, s, t, k) {
  let m = f, n = 0;
  k[n++] = f; s[f] = t;
  while (n) { const p = k[--n]; if (p < m) m = p; for (const [dx, dy] of D) { const q = p + dy * l.w + dx; if (!l.a[q] && !o[q] && s[q] != t) { s[q] = t; k[n++] = q; } } }
  return m;
}
function F(l, o, g, t) {
  const w = l.w, a = l.a;
  for (const x of [t, t - 1, t - w, t - w - 1]) { const b = x + 1, c = x + w, d = c + 1; if (!(a[x] || o[x]) || !(a[b] || o[b]) || !(a[c] || o[c]) || !(a[d] || o[d])) continue; if ((o[x] && !g[x]) || (o[b] && !g[b]) || (o[c] && !g[c]) || (o[d] && !g[d])) return 1; }
  return 0;
}
function W(l, o, f, t) {
  if (f == t) return '';
  const w = l.w, p = new Int32Array(l.a.length).fill(-1), h = new Array(l.a.length), q = [f];
  p[f] = f;
  for (let i = 0; i < q.length; i++) { const x = q[i]; if (x == t) break; for (let k = 0; k < 4; k++) { const [dx, dy] = D[k], y = x + dy * w + dx; if (l.a[y] || o[y] || p[y] >= 0) continue; p[y] = x; h[y] = L[k]; q.push(y); } }
  if (p[t] < 0) throw new Error('x');
  let s = '';
  for (let x = t; x != f; x = p[x]) s = h[x] + s;
  return s;
}
function S(l, M, e) {
  const { w, a, g } = l, z = a.length, G = new Uint8Array(z);
  for (const x of g) G[x] = 1;
  const v = V(l), o = new Uint8Array(z), s = new Int32Array(z), m = new Int32Array(z), k = new Int32Array(z);
  let t = 0;
  const done = b => b.every(x => G[x]);
  if (l.b.some(x => !v[x])) return null;
  const B = [l.b.slice()], Y = [l.p], A = [-1], N = [-1], T = [-1], J = [-1], X = new Map;
  for (const b of l.b) o[b] = 1;
  const l0 = E(l, o, l.p, s, ++t, k);
  for (const b of l.b) o[b] = 0;
  X.set(l0 + ':' + B[0], 0);
  let f = done(B[0]) && (e < 0 || s[e] == t) ? 0 : -1;
  for (let h = 0; f < 0 && h < B.length; h++) {
    const b = B[h];
    for (const x of b) o[x] = 1;
    E(l, o, Y[h], s, ++t, k);
    const q = t;
    for (let i = 0; i < b.length && f < 0; i++) {
      const c = b[i];
      for (let j = 0; j < 4; j++) {
        const [dx, dy] = D[j], d = dy * w + dx, u = c + d;
        if (s[c - d] != q || a[u] || o[u] || !v[u]) continue;
        o[c] = 0; o[u] = 1;
        if (!F(l, o, G, u)) {
          const n = b.slice(); n[i] = u; n.sort((x, y) => x - y);
          const w2 = E(l, o, c, m, ++t, k), key = w2 + ':' + n;
          if (!X.has(key)) {
            if (B.length >= M) { for (const x of b) o[x] = 0; return null; }
            const ok = !done(n) || e < 0 || m[e] == t;
            X.set(key, B.length); B.push(n); Y.push(c); A.push(h); N.push(c); T.push(u); J.push(j);
            if (ok && done(n)) f = B.length - 1;
          }
        }
        o[u] = 0; o[c] = 1;
      }
    }
    for (const x of b) o[x] = 0;
  }
  if (f < 0) return null;
  const path = [];
  for (let x = f; x > 0; x = A[x]) path.push(x);
  path.reverse();
  let mv = '', p = l.p, b = l.b.slice();
  for (const x of path) {
    const n = B[x], fr = N[x], to = T[x], d = to - fr;
    for (const y of b) o[y] = 1;
    mv += W(l, o, p, fr - d);
    for (const y of b) o[y] = 0;
    mv += L[J[x]]; p = fr; b = n;
  }
  return [mv, p];
}
function C(l) {
  const { w, a, g, b, p } = l, v = V(l), r = Math.floor(p / w), c = new Uint8Array(a.length);
  for (let i = r * w; i < (r + 1) * w; i++) if (!a[i] && !v[i]) c[i] = 1;
  if (b.some(x => c[x])) return null;
  const n = new Int32Array(a.length).fill(-1), R = [];
  for (let s = 0; s < a.length; s++) {
    if (a[s] || c[s] || n[s] >= 0) continue;
    const q = [s]; n[s] = R.length;
    for (let i = 0; i < q.length; i++) for (const [dx, dy] of D) { const y = q[i] + dy * w + dx; if (!a[y] && !c[y] && n[y] < 0) { n[y] = R.length; q.push(y); } }
    R.push({ q, b: [], g: [], d: -1, o: 0 });
  }
  for (const x of b) R[n[x]].b.push(x);
  for (const x of g) if (n[x] >= 0) R[n[x]].g.push(x);
  if (g.some(x => n[x] < 0) || R.some(x => x.b.length != x.g.length)) return null;
  const O = R.filter(x => x.b.length);
  for (const x of O) {
    for (const s of x.q) { let ok = 0; for (const [dx, dy] of D) if (c[s + dy * w + dx]) { x.d = s; ok = 1; break; } if (ok) break; }
    if (x.d < 0) return null;
  }
  return O;
}
function K(t) {
  const l = P(t), r = C(l);
  if (!r) { const s = S(l, 250000, -1); return s ? s[0] : ''; }
  const G = new Uint8Array(l.w * l.h);
  for (const x of l.g) G[x] = 1;
  const O = [...r].sort((a, b) => (G[a.d] ? 1 : 0) - (G[b.d] ? 1 : 0));
  let p = l.p, mv = '';
  for (let i = 0; i < O.length; i++) {
    const x = O[i], last = i == O.length - 1, a = l.a.slice();
    for (const y of O) if (y != x) for (const b of y.o ? y.g : y.b) a[b] = 1;
    const s = S({ w: l.w, a, g: x.g.slice().sort((u, v) => u - v), b: x.b.slice().sort((u, v) => u - v), p }, 250000, last ? -1 : x.d);
    if (!s) return '';
    mv += s[0]; p = s[1]; x.o = 1;
  }
  return mv;
}
for (const id of readdirSync(I).sort()) {
  const mv = K(readFileSync(join(I, id, 'level.txt'), 'utf8'));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'solution.txt'), mv + '\n');
}
