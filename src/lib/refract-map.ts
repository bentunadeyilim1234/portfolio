// RGBA displacement map for a w×h pill (radius h/2), in px: inside a `band`-px rim, R/G push the sample
// inward along the edge normal (0x80 = no shift), so the round ends bend radially and the rim is the
// same thickness whatever the pill's aspect ratio. The middle stays flat.
export function pillMap(w: number, h: number, band: number): Uint8ClampedArray<ArrayBuffer> {
  const r = h / 2;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Vector from the nearest point of the pill's centre line to this pixel.
      const dx = x + 0.5 - Math.min(Math.max(x + 0.5, r), w - r);
      const dy = y + 0.5 - r;
      const d = Math.hypot(dx, dy);
      const t = Math.min(1, Math.max(0, 1 - (r - d) / band));
      const k = d ? (t * t) / d : 0;
      const i = (y * w + x) * 4;
      out[i] = 128 - 127 * dx * k;
      out[i + 1] = 128 - 127 * dy * k;
      out[i + 2] = 128;
      out[i + 3] = 255;
    }
  }
  return out;
}
