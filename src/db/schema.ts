import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { Localized } from "@/lib/localized";

const id = () => uuid().defaultRandom().primaryKey();
const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();
const localized = () => jsonb().$type<Localized>().notNull().default({});

export const settings = pgTable("settings", {
  key: text().primaryKey(),
  value: jsonb().notNull(),
});

export const blocks = pgTable(
  "blocks",
  {
    id: id(),
    page: text().notNull(),
    position: integer().notNull(),
    type: text().notNull(),
    size: text().notNull().default("full"),
    config: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index("blocks_page_position_idx").on(t.page, t.position)],
);

export const projects = pgTable("projects", {
  id: id(),
  slug: text().unique().notNull(),
  title: localized(),
  category: localized(),
  summary: localized(),
  body: localized(),
  status: text({ enum: ["completed", "in_progress", "archived"] }).notNull(),
  startedAt: text(), // "YYYY-MM"
  technologies: text().array().notNull().default([]),
  link: text(),
  repoUrl: text(),
  coverImageId: uuid(), // nullable, intentionally no FK
  published: boolean().notNull().default(true),
  createdAt: createdAt(),
});

export const projectImages = pgTable("project_images", {
  id: id(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text().notNull(),
  alt: jsonb().$type<Localized>().notNull().default({}),
  position: integer().notNull(),
});

export const posts = pgTable("posts", {
  id: id(),
  slug: text().unique().notNull(),
  title: localized(),
  excerpt: localized(),
  body: localized(),
  coverUrl: text(),
  tags: text().array().notNull().default([]),
  publishedAt: timestamp({ withTimezone: true }),
  draft: boolean().notNull().default(true),
  createdAt: createdAt(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const skills = pgTable("skills", {
  id: id(),
  kind: text({ enum: ["tech", "language"] }).notNull(),
  name: localized(),
  level: localized(),
  percentage: integer().notNull(),
  position: integer().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: id(),
  email: text().unique().notNull(),
  passwordHash: text().notNull(),
});

export const sessions = pgTable("sessions", {
  id: id(),
  tokenHash: text().unique("sessions_token_hash_unique").notNull(),
  userId: uuid()
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
});

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: id(),
    ipHash: text().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("login_attempts_ip_hash_created_at_idx").on(t.ipHash, t.createdAt)],
);
