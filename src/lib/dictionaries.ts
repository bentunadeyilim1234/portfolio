import type { Lang } from "./i18n";

const en = {
  onlyIn: { tr: "Only available in Turkish", en: "Only available in English" },
  nav: { main: "Main", lang: "Language", theme: "Theme" },
  theme: { system: "System", light: "Light", dark: "Dark" },
  projects: {
    status: { completed: "Completed", in_progress: "In progress", archived: "Archived" },
    visit: "Visit site",
    repo: "Source code",
    since: "Since",
    tech: "Built with",
  },
  blog: { empty: "No posts yet.", readMore: "Read more" },
  contact: { emailMe: "Email me" },
  common: { back: "Back" },
  footer: { rights: "All rights reserved." },
};

// Typed as the EN shape so a missing or extra key fails tsc.
const tr: typeof en = {
  onlyIn: { tr: "Yalnızca Türkçe mevcut", en: "Yalnızca İngilizce mevcut" },
  nav: { main: "Ana menü", lang: "Dil", theme: "Tema" },
  theme: { system: "Sistem", light: "Açık", dark: "Koyu" },
  projects: {
    status: { completed: "Tamamlandı", in_progress: "Devam ediyor", archived: "Arşivlendi" },
    visit: "Siteyi ziyaret et",
    repo: "Kaynak kod",
    since: "Başlangıç",
    tech: "Teknolojiler",
  },
  blog: { empty: "Henüz yazı yok.", readMore: "Devamını oku" },
  contact: { emailMe: "Bana e-posta gönder" },
  common: { back: "Geri" },
  footer: { rights: "Tüm hakları saklıdır." },
};

export type Dict = typeof en;

export function dict(lang: Lang): Dict {
  return lang === "tr" ? tr : en;
}
