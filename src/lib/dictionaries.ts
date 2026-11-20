import type { Lang } from "./i18n";

const en = {
  onlyIn: { tr: "Only available in Turkish", en: "Only available in English" },
  nav: { main: "Main", lang: "Language", theme: "Theme" },
  theme: { system: "System", light: "Light", dark: "Dark" },
  pages: { projects: "Projects", blog: "Blog", about: "About", contact: "Contact" },
  projects: {
    status: { completed: "Completed", in_progress: "In progress", archived: "Archived" },
    statusLabel: "Status",
    gallery: "Gallery",
    visit: "Visit site",
    repo: "Source code",
    since: "Since",
    tech: "Built with",
  },
  blog: { empty: "No posts yet.", readMore: "Read more" },
  contact: { emailMe: "Email me" },
  common: { back: "Back" },
  notFound: { title: "Page not found", body: "This page does not exist or is no longer public.", home: "Back to home" },
  footer: { rights: "All rights reserved." },
};

// Typed as the EN shape so a missing or extra key fails tsc.
const tr: typeof en = {
  onlyIn: { tr: "Yalnızca Türkçe mevcut", en: "Yalnızca İngilizce mevcut" },
  nav: { main: "Ana menü", lang: "Dil", theme: "Tema" },
  theme: { system: "Sistem", light: "Açık", dark: "Koyu" },
  pages: { projects: "Projeler", blog: "Blog", about: "Hakkımda", contact: "İletişim" },
  projects: {
    status: { completed: "Tamamlandı", in_progress: "Devam ediyor", archived: "Arşivlendi" },
    statusLabel: "Durum",
    gallery: "Galeri",
    visit: "Siteyi ziyaret et",
    repo: "Kaynak kod",
    since: "Başlangıç",
    tech: "Teknolojiler",
  },
  blog: { empty: "Henüz yazı yok.", readMore: "Devamını oku" },
  contact: { emailMe: "Bana e-posta gönder" },
  common: { back: "Geri" },
  notFound: { title: "Sayfa bulunamadı", body: "Bu sayfa mevcut değil ya da artık herkese açık değil.", home: "Ana sayfaya dön" },
  footer: { rights: "Tüm hakları saklıdır." },
};

export type Dict = typeof en;

export function dict(lang: Lang): Dict {
  return lang === "tr" ? tr : en;
}
