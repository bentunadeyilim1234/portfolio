export type GlassTier = "refract" | "blur" | "solid";

export type GlassEnv = {
  isChromium: boolean;
  cores: number;
  memoryGb: number | null;
  reducedTransparency: boolean;
  reducedMotion: boolean;
  supportsBackdrop: boolean;
};

// Must stay self-contained (no imports/closures): glassTierScript embeds its source via toString().
export function detectGlassTier(env: GlassEnv): GlassTier {
  if (env.reducedTransparency || !env.supportsBackdrop) return "solid";
  if (env.cores <= 2 && env.memoryGb !== null && env.memoryGb <= 2) return "solid";
  // SVG filters inside backdrop-filter only render in Chromium; they cost GPU, so only on capable devices.
  if (env.isChromium && !env.reducedMotion && env.cores >= 6 && (env.memoryGb === null || env.memoryGb >= 4)) return "refract";
  return "blur";
}

// Runs in <head> before first paint. Unknown core count is treated as 4 (blur tier); any error falls back to solid.
export const glassTierScript = `(function(){var d=document.documentElement;try{var n=navigator,b=(n.userAgentData&&n.userAgentData.brands)||[],m=function(q){return window.matchMedia(q).matches},s=function(p){return CSS.supports(p,"blur(1px)")};d.dataset.glass=(${detectGlassTier.toString()})({isChromium:!!window.chrome||b.some(function(x){return x.brand==="Chromium"}),cores:n.hardwareConcurrency||4,memoryGb:typeof n.deviceMemory==="number"?n.deviceMemory:null,reducedTransparency:m("(prefers-reduced-transparency: reduce)"),reducedMotion:m("(prefers-reduced-motion: reduce)"),supportsBackdrop:s("backdrop-filter")||s("-webkit-backdrop-filter")})}catch(e){d.dataset.glass="solid"}})()`;
