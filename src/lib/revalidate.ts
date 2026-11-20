import { revalidatePath } from "next/cache";

// shortcut: her yazımda tüm site tazelenir; sayfa sayısı büyürse sayfa bazlı revalidate'e geç.
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}
