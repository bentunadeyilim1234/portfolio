// One-off move of the old static site content into Neon + Blob. Idempotent per table: a non-empty
// table is skipped, and each table's rows go in one statement/batch so a crash never leaves it half-filled.
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

process.loadEnvFile(".env.local");

type L = { en?: string; tr?: string };

const LEGACY_PROJECTS = [
  {
    slug: "vektorizer",
    file: "vektorize.png",
    title: "Vektorize: Görüntüden Vektöre Dönüşüm Aracı",
    startedAt: "2025-11",
    summary:
      "Vektorize, kullanıcıların raster görüntüleri (JPEG, PNG) yükleyip bunları ölçeklenebilir vektör grafiklerine (SVG) dönüştürmelerini sağlayan bir web uygulamasıdır.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Node.js"],
    link: "https://vektorize.vercel.app/",
  },
  {
    slug: "e-commerce",
    file: "ecommerce.png",
    title: "MONO: Modern E-Ticaret Sitesi",
    startedAt: "2025-11",
    summary:
      "MONO, React'ın getirdiği esneklik ile Tailwind CSS'in sağladığı modern tasarım anlayışını birleştirerek harika bir tasarım örneği olmuştur.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    link: "https://v0-shopping-site-design-lyart.vercel.app/",
  },
  {
    slug: "kaygi-asistani",
    file: "kaygi-asistani.png",
    title: "Kaygı Asistanı",
    startedAt: "2024-08",
    summary:
      "TÜBİTAK yarışmaları için geliştirmeye başlamış olduğum bu proje, kaygıya sahip hastaları görevlendirerek oyun bazlı kendilerini daha iyi hissetmelerini sağlamayı hedeflemektedir.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    link: "https://kaygi-asistani.vercel.app/",
  },
];

const EXPERIENCED: L = { tr: "Deneyimli", en: "Experienced" };
const INTERMEDIATE: L = { tr: "Orta", en: "Intermediate" };
const TECH: [string, L, number][] = [
  ["React / Next.js", EXPERIENCED, 95],
  ["TypeScript", EXPERIENCED, 90],
  ["Tailwind CSS", EXPERIENCED, 90],
  ["Node.js", INTERMEDIATE, 75],
  ["Python", INTERMEDIATE, 70],
  ["UI/UX Design", EXPERIENCED, 85],
];
const LANGUAGES: [L, L, number][] = [
  [{ tr: "Türkçe", en: "Turkish" }, { tr: "Ana Dil", en: "Native" }, 100],
  [{ tr: "İngilizce", en: "English" }, { tr: "B2 - İleri-Orta", en: "B2 - Upper-Intermediate" }, 70],
  [{ tr: "Fransızca", en: "French" }, { tr: "A1 - Başlangıç", en: "A1 - Beginner" }, 20],
];

const NAV = [
  { page: "home", icon: "House", label: { en: "Home", tr: "Ana Sayfa" }, visible: true },
  { page: "projects", icon: "Briefcase", label: { en: "Projects", tr: "Projeler" }, visible: true },
  { page: "blog", icon: "PenLine", label: { en: "Blog", tr: "Blog" }, visible: true },
  { page: "about", icon: "User", label: { en: "About", tr: "Hakkımda" }, visible: true },
  { page: "contact", icon: "Mail", label: { en: "Contact", tr: "İletişim" }, visible: true },
  // Plan 5 turns the guestbook on.
  { page: "guestbook", icon: "BookOpen", label: { en: "Guestbook", tr: "Ziyaretçi Defteri" }, visible: false },
];

const md = (tr: string, en: string) => ({ type: "markdown", config: { body: { tr, en } } });

async function main() {
  // After loadEnvFile: src/db reads DATABASE_URL at import time.
  const { count, eq } = await import("drizzle-orm");
  const { put } = await import("@vercel/blob");
  const { db } = await import("@/db");
  const { adminUsers, blocks, projectImages, projects, settings, skills } = await import("@/db/schema");
  const { hashPassword } = await import("@/lib/auth/password");

  const isEmpty = async (t: typeof adminUsers | typeof settings | typeof projects | typeof skills | typeof blocks) =>
    (await db.select({ n: count() }).from(t))[0].n === 0;
  const log = (table: string, n: number | null) => console.log(n === null ? `${table}: skipped` : `${table}: inserted ${n}`);

  // Admin
  if (await isEmpty(adminUsers)) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
    await db.insert(adminUsers).values({ email, passwordHash: await hashPassword(password) });
    log("admin_users", 1);
  } else log("admin_users", null);

  // Settings
  if (await isEmpty(settings)) {
    const rows = [
      { key: "ownerName", value: "Ali Tuna Baylan" },
      { key: "email", value: "tunaonair@gmail.com" },
      { key: "socials", value: [] },
      { key: "nav", value: NAV },
    ];
    await db.insert(settings).values(rows);
    log("settings", rows.length);
  } else log("settings", null);

  // Projects + their images, in one transaction.
  if (await isEmpty(projects)) {
    const projectRows = [];
    const imageRows = [];
    for (const p of LEGACY_PROJECTS) {
      const id = randomUUID();
      const imageId = randomUUID();
      // allowOverwrite: a rerun after a failed DB batch re-uploads the same path. Explicit token: a pulled
      // VERCEL_OIDC_TOKEN would otherwise win, and Blob rejects OIDC from the development environment.
      const blob = await put(`projects/${p.slug}.png`, await readFile(`public/${p.file}`), {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
        contentType: "image/png",
      });
      projectRows.push({
        id,
        slug: p.slug,
        title: { tr: p.title },
        category: { tr: "Web Sitesi Geliştirme" },
        summary: { tr: p.summary },
        status: "in_progress" as const,
        startedAt: p.startedAt,
        technologies: p.technologies,
        link: p.link,
        coverImageId: imageId,
      });
      imageRows.push({ id: imageId, projectId: id, url: blob.url, alt: { tr: p.title }, position: 0 });
    }
    await db.batch([db.insert(projects).values(projectRows), db.insert(projectImages).values(imageRows)]);
    log("projects", projectRows.length);
    log("project_images", imageRows.length);
  } else {
    log("projects", null);
    log("project_images", null);
  }

  // Skills
  if (await isEmpty(skills)) {
    const rows = [
      ...TECH.map(([name, level, percentage]) => ({ kind: "tech" as const, name: { tr: name, en: name }, level, percentage })),
      ...LANGUAGES.map(([name, level, percentage]) => ({ kind: "language" as const, name, level, percentage })),
    ].map((r, position) => ({ ...r, position }));
    await db.insert(skills).values(rows);
    log("skills", rows.length);
  } else log("skills", null);

  // Blocks: reference projects by id, so read them back (they may come from an earlier run).
  if (await isEmpty(blocks)) {
    const ids = [];
    for (const p of LEGACY_PROJECTS) {
      const [row] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, p.slug));
      if (!row) throw new Error(`project ${p.slug} missing; cannot seed blocks`);
      ids.push(row.id);
    }
    const projectBlocks = ids.map((projectId) => ({ type: "project", size: "small", config: { projectId } }));
    const pages: Record<string, { type: string; size?: string; config: Record<string, unknown> }[]> = {
      home: [
        {
          type: "hero",
          config: {
            title: { tr: "Ali Tuna Baylan", en: "Ali Tuna Baylan" },
            tagline: {
              tr: "Yazılım alanında yılların getirdiği tecrübe ile size yardım etmek için buradayım.",
              en: "Here to help you with years of software experience.",
            },
            ctas: [
              { label: { tr: "Projeler", en: "Projects" }, page: "projects" },
              { label: { tr: "İletişim", en: "Contact" }, page: "contact" },
            ],
          },
        },
        ...projectBlocks,
      ],
      projects: [md("# Projeler", "# Projects"), ...projectBlocks],
      blog: [md("# Blog", "# Blog"), { type: "post-list", config: {} }],
      about: [
        md(
          "# Hakkımda\n\nBen Ali. Lise öğrencisiyim. Boş zamanlarımda programlama ile ilgileniyorum. Next.JS ve React ile web siteleri geliştirme konusunda 3+ yıllık bir deneyime sahibim.\n\nYazılım macerama 8 yaşımda Python öğrenmek ile başladım. O gün bu gündür yazılım benim için bir hobiden fazlası olmuştur.",
          "# About\n\nI'm Ali, a high school student. In my free time I work on programming. I have 3+ years of experience building websites with Next.js and React.\n\nMy software journey started when I learned Python at the age of 8. Ever since, software has been more than a hobby for me.",
        ),
        { type: "languages", config: { title: { tr: "Dil Seviyelerim", en: "Languages" } } },
        { type: "skills", config: { title: { tr: "Teknik Yeteneklerim", en: "Technical Skills" } } },
      ],
      contact: [
        md(
          "# İletişime Geçelim\n\nAklınızda gerçekleştirmek istediğiniz bir proje mi var? Size yardımcı olmaktan memnun olurum.",
          "# Let's Get in Touch\n\nHave a project in mind that you'd like to bring to life? I'd be happy to help.",
        ),
        { type: "contact", config: { title: { tr: "Doğrudan E-Posta Gönderin", en: "Email Me Directly" } } },
      ],
    };
    const rows = Object.entries(pages).flatMap(([page, list]) =>
      list.map((b, position) => ({ page, position, type: b.type, size: b.size ?? "full", config: b.config })),
    );
    await db.insert(blocks).values(rows);
    log("blocks", rows.length);
  } else log("blocks", null);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
