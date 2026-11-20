import { and, asc, desc, eq, inArray, isNotNull, lte } from "drizzle-orm";
import { db } from "@/db";
import { blocks, posts, projectImages, projects, settings, skills } from "@/db/schema";
import type { Block, BlockCtx, PageKey } from "@/blocks/types";
import type { NavTab, Post, PostSummary, Project, ProjectWithImages, SiteSettings, Skill } from "./types";

export async function getPageBlocks(page: PageKey): Promise<Block[]> {
  const { id, position, type, size, config } = blocks;
  const rows = await db
    .select({ id, page: blocks.page, position, type, size, config })
    .from(blocks)
    .where(eq(blocks.page, page))
    .orderBy(asc(position));
  // type/size are free text in the DB; BlockGrid drops unknown types. config is jsonb: renderers
  // read fields off it, so anything but an object (null, array, string) becomes {}.
  return rows.map((r) => ({
    ...r,
    config: r.config && typeof r.config === "object" && !Array.isArray(r.config) ? r.config : {},
  })) as Block[];
}

const DEFAULT_SETTINGS: SiteSettings = { nav: [], email: "", ownerName: "", socials: [] };

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(settings);
  const v = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  // Admin-written JSON: anything of the wrong shape falls back to the default.
  return {
    nav: Array.isArray(v.nav) ? (v.nav as NavTab[]) : DEFAULT_SETTINGS.nav,
    email: typeof v.email === "string" ? v.email : DEFAULT_SETTINGS.email,
    ownerName: typeof v.ownerName === "string" ? v.ownerName : DEFAULT_SETTINGS.ownerName,
    socials: Array.isArray(v.socials) ? (v.socials as SiteSettings["socials"]) : DEFAULT_SETTINGS.socials,
  };
}

async function withImages(rows: Project[]): Promise<ProjectWithImages[]> {
  if (rows.length === 0) return [];
  const imgs = await db
    .select()
    .from(projectImages)
    .where(inArray(projectImages.projectId, rows.map((p) => p.id)))
    .orderBy(asc(projectImages.position));
  return rows.map((p) => ({ ...p, images: imgs.filter((i) => i.projectId === p.id) }));
}

export async function getPublishedProjects(): Promise<ProjectWithImages[]> {
  return withImages(await db.select().from(projects).where(eq(projects.published, true)).orderBy(desc(projects.createdAt)));
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);
  return (await withImages(rows))[0] ?? null;
}

const isPublic = () => and(eq(posts.draft, false), isNotNull(posts.publishedAt), lte(posts.publishedAt, new Date()));

export async function getPublishedPosts(): Promise<PostSummary[]> {
  return db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverUrl: posts.coverUrl,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(isPublic())
    .orderBy(desc(posts.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await db.select().from(posts).where(and(eq(posts.slug, slug), isPublic())).limit(1);
  return rows[0] ?? null;
}

export async function getSkills(): Promise<Skill[]> {
  return db.select().from(skills).orderBy(asc(skills.position));
}

// A non-uuid projectId would make Postgres reject the whole query.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Fetches only what the given blocks render; everything else stays empty.
export async function loadBlockCtx(list: Block[]): Promise<BlockCtx> {
  const has = (t: Block["type"]) => list.some((b) => b.type === t);
  const ids = [
    ...new Set(list.filter((b) => b.type === "project").map((b) => String(b.config.projectId)).filter((id) => UUID.test(id))),
  ];
  const [projectRows, postRows, skillRows, siteSettings] = await Promise.all([
    ids.length
      ? db.select().from(projects).where(and(inArray(projects.id, ids), eq(projects.published, true))).then(withImages)
      : [],
    has("post-list") ? getPublishedPosts() : [],
    has("skills") || has("languages") ? getSkills() : [],
    has("contact") ? getSettings() : DEFAULT_SETTINGS,
  ]);
  return {
    projects: new Map(projectRows.map((p) => [p.id, p])),
    posts: postRows,
    skills: skillRows,
    settings: siteSettings,
  };
}
