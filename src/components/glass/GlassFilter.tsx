import type { ReactNode } from "react";

// Displacement map channel value -> pixel shift: 0x80 = none. The ramp lives only in the outer ~15%,
// so the middle stays undistorted and the rim bends the backdrop inward like a thick lens edge.
// feImage has no x/y/width/height on purpose: percentages there resolve against the viewport in
// backdrop-filter, while the default subregion is the filter region (= the element box).
const STOPS: [number, string][] = [[0, "ff"], [0.05, "c8"], [0.15, "80"], [0.85, "80"], [0.95, "38"], [1, "00"]];

// Horizontal ramp in red (drives x), vertical ramp in green (drives y).
function rampMap(vertical: boolean) {
  const stops = STOPS.map(([o, v]) => `<stop offset='${o}' stop-color='#${vertical ? `00${v}00` : `${v}0000`}'/>`).join("");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'>` +
    `<linearGradient id='g' x2='${vertical ? 0 : 1}' y2='${vertical ? 1 : 0}'>${stops}</linearGradient>` +
    `<rect width='100' height='100' fill='url(#g)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const MAP_X = rampMap(false);
const MAP_Y = rampMap(true);

// Keep a single colour channel (+ alpha) of a displaced copy.
const ONLY_R = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0";
const ONLY_G = "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0";
const ONLY_B = "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0";

// R/G/B are displaced with slightly different scales and summed: faint chromatic fringing at the rim.
// `children` must produce the displacement map as result="map".
export function Refraction({ id, scale, children }: { id: string; scale: number; children: ReactNode }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      {children}
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" result="dr" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={(scale * 6) / 7} xChannelSelector="R" yChannelSelector="G" result="dg" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={(scale * 5) / 7} xChannelSelector="R" yChannelSelector="G" result="db" />
      <feColorMatrix in="dr" type="matrix" values={ONLY_R} result="r" />
      <feColorMatrix in="dg" type="matrix" values={ONLY_G} result="g" />
      <feColorMatrix in="db" type="matrix" values={ONLY_B} result="b" />
      <feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg" />
      <feComposite in="rg" in2="b" operator="arithmetic" k2="1" k3="1" />
    </filter>
  );
}

// Referenced by `backdrop-filter: url(#lg-refract)` in glass.css (refract tier, Chromium only).
export function GlassFilter() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <Refraction id="lg-refract" scale={56}>
        <feImage href={MAP_X} preserveAspectRatio="none" result="mx" />
        <feImage href={MAP_Y} preserveAspectRatio="none" result="my" />
        <feComposite in="mx" in2="my" operator="arithmetic" k2="1" k3="1" result="map" />
      </Refraction>
    </svg>
  );
}
