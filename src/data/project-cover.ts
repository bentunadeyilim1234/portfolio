import type { ProjectWithImages } from "./types";

// Chosen cover if it still exists, else the lowest-position image, else null.
export function projectCover(p: Pick<ProjectWithImages, "coverImageId" | "images">): string | null {
  const chosen = p.images.find((i) => i.id === p.coverImageId);
  if (chosen) return chosen.url;
  const first = p.images.reduce<(typeof p.images)[number] | null>((a, i) => (!a || i.position < a.position ? i : a), null);
  return first?.url ?? null;
}
