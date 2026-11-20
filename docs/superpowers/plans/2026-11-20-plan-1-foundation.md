# Liquid Glass Portfolyo — Plan 1: Temel (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Siteyi Neon'dan okunan blok tabanlı sayfalara, iki dile, liquid glass görsel sistemine, island bar'a ve yönetici girişine taşımak. Bu planın sonunda site yeni görünümüyle, tüm içeriği veritabanından gelerek yayında olur. Düzenleme henüz yoktur (Plan 2).

**Architecture:** Next.js 16 App Router. `proxy.ts`, çerez/`Accept-Language` ile dili seçip isteği içeride `/{lang}/...` yoluna yeniden yazar (URL'de önek görünmez). Böylece public sayfalar dil başına statik üretilir. Her yönetici yazma işlemi `revalidatePath('/', 'layout')` ile tüm siteyi tazeler. Veri erişimi Drizzle + `drizzle-orm/neon-http`. Çok satırlı atomik yazımlar `db.batch()` ile yapılır (neon-http'de batch bir transaction'dır).

**Tech Stack:** Next.js 16, React 19, Tailwind v4, TypeScript, Drizzle ORM + `@neondatabase/serverless`, `@vercel/blob`, `next-themes`, `react-markdown` + `remark-gfm` + `rehype-sanitize`, `lucide-react`, Vitest, tsx.

**Spec:** `docs/superpowers/specs/2026-11-20-liquid-glass-portfolio-design.md`

## Yol haritası (bu plan 1/6)

Spec birden fazla bağımsız alt sistem içerdiği için 6 plana bölündü. Her plan kendi başına çalışan bir site bırakır. Sonraki planlar, bir önceki bittikten sonra gerçek koda bakılarak yazılır.

1. **Temel** (bu plan): DB, seed, i18n, tema, glass sistemi, island bar, blok ızgarası + içerik blokları, public sayfalar, giriş.
2. **Düzenleme modu + /admin iskeleti**: titreşim modu, dnd-kit sıralama, blok ekle/sil, ayar sheet'leri, Bitti/İptal kaydı; gezinme sekmeleri, yetenekler, genel ayarlar, şifre değiştirme.
3. **Projeler yönetimi**: proje CRUD, çoklu görsel (ekle/sil/sırala/kapak), Blob client upload route'u, GitHub'dan içe aktarma.
4. **Blog**: Markdown editörü (sürükle/yapıştır ile Blob'a yükleme, canlı önizleme), YouTube/Vimeo gömme, video, sanitize edilmiş render, `/admin/blog`.
5. **Ziyaretçi defteri**: BotID, honeypot, süre kontrolü, hız sınırı, tekrar/link reddi, TR+EN küfür filtresi, `/admin/guestbook` moderasyonu, `guestbook` bloğu ve sayfası.
6. **Widget'lar**: 14 widget, Spotify OAuth + takip anahtarı + `/api/now-playing`, BMC paneli.

## Global Constraints

- Varsayılan dil `en`; desteklenen diller tam olarak `en`, `tr`. Dil `lang` çerezinde tutulur; URL'de dil öneki yok.
- Çevrilebilir içerik alanları `{ en?: string; tr?: string }` (jsonb). İstenen dil yoksa diğer dil gösterilir + "Only available in Turkish" / "Yalnızca İngilizce mevcut" etiketi. İçerik asla gizlenmez.
- Sayfa anahtarları tam olarak: `home`, `projects`, `blog`, `about`, `contact`, `guestbook`. Yeni sayfa oluşturma yok.
- Izgara: masaüstünde 4, mobilde 2 sütun. Boyutlar `small` (1×1 kare), `medium` (2×1), `large` (2×2), `full` (tüm satır). `project` varsayılanı `small`. Diğer içerik blokları her zaman `full`. `grid-auto-flow: dense` kullanılmaz.
- Glass kademeleri tam olarak `refract` | `blur` | `solid`, `<html data-glass="...">` olarak.
- Tema: next-themes, `system` | `light` | `dark`; varsayılan `system`.
- Her yazma işlemi sunucuda oturum kontrolü yapar (`requireAdmin()`); arayüzü gizlemek yeterli değil.
- Oturum çerezi `session`: `HttpOnly`, `Secure`, `SameSite=Lax`; DB'de yalnızca token'ın SHA-256 hash'i. Şifre: Node `crypto.scrypt`.
- Giriş kilidi: aynı IP hash'inden 15 dakikada 5 hatalı deneme.
- Ham IP saklanmaz; `IP_HASH_SALT` ile SHA-256.
- Yönetici arayüzü (login, /admin, ileride düzenleme modu) yalnızca Türkçedir (karar: tek kullanıcı sahip, Türkçe konuşuyor).
- Metin kontrastı her glass kademesinde WCAG AA.
- Hosting yalnızca Vercel.

## Review Focus

1. **Ziyaretçinin dilinde içerik yok** (ör. yalnızca TR yazılmış proje, EN ziyaretçi) → TR metin + "Only available in Turkish" etiketi, boş kart değil. → Task 3 `pickLocalized` testleri.
2. **Tuhaf `Accept-Language` başlıkları** (`tr-TR`, `en-US,tr;q=0.9`, `TR`, boş, bozuk) → doğru dil, asla hata yok. → Task 3 `negotiateLang` testleri.
3. **Geçersiz `lang` çerezi** (`de`, `""`, `../x`) → yok sayılır, başlıktan seçilir. → Task 3 `resolveLang` testleri.
4. **Görseli olmayan veya kapağı silinmiş proje** → kart yer tutucu ile render edilir, sayfa çökmez. → Task 6 `projectCover` testleri.
5. **`backdrop-filter` desteklemeyen veya düşük donanımlı tarayıcı** → `solid` kademesi; `prefers-reduced-transparency` → `solid`. → Task 4 `detectGlassTier` testleri.

---

## Dosya yapısı

```
proxy.ts                                   dil seçimi + rewrite
drizzle.config.ts
vitest.config.ts
scripts/seed.ts                            ilk veri + admin
src/db/schema.ts                           Drizzle tabloları
src/db/index.ts                            db istemcisi
src/lib/localized.ts                       Localized tipi, pickLocalized
src/lib/i18n.ts                            Lang, negotiateLang, resolveLang
src/lib/dictionaries.ts                    arayüz metinleri en/tr
src/lib/glass-tier.ts                      detectGlassTier
src/lib/auth/password.ts                   hashPassword, verifyPassword
src/lib/auth/session.ts                    createSession, getSession, requireAdmin, destroySession
src/lib/ip.ts                              hashIp, clientIp
src/lib/revalidate.ts                      revalidateSite()
src/data/queries.ts                        public okuma fonksiyonları
src/blocks/types.ts                        PageKey, BlockSize, BlockType, Block
src/blocks/grid.ts                         sizeClass
src/blocks/BlockGrid.tsx                   ızgara render
src/blocks/registry.tsx                    type → bileşen
src/blocks/content/*.tsx                   Hero, MarkdownBlock, ProjectCard, PostList, Skills, Languages, ContactCard
src/components/glass/Glass.tsx             cam yüzey bileşeni
src/components/glass/GlassFilter.tsx       gizli SVG refraction filtresi
src/components/glass/glass.css             kademe stilleri
src/components/IslandBar.tsx
src/components/ThemeToggle.tsx
src/components/LangToggle.tsx
src/components/Markdown.tsx                sanitize edilmiş render
src/components/FallbackBadge.tsx
src/app/(site)/[lang]/layout.tsx           site kök layout'u
src/app/(site)/[lang]/page.tsx             home
src/app/(site)/[lang]/projects/page.tsx
src/app/(site)/[lang]/projects/[slug]/page.tsx
src/app/(site)/[lang]/blog/page.tsx
src/app/(site)/[lang]/blog/[slug]/page.tsx
src/app/(site)/[lang]/about/page.tsx
src/app/(site)/[lang]/contact/page.tsx
src/app/(admin)/layout.tsx                 yönetim kök layout'u
src/app/(admin)/login/page.tsx + actions.ts
src/app/(admin)/admin/page.tsx             korumalı yer tutucu + çıkış
public/wallpaper.(webp|avif)               statik arka plan
```

Silinecek: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/{about,blog,contact,projects}/**`, `src/components/{Blog,Hero,LanguageLevels,Navbar,Projects,TechLevels}.tsx`, `src/data/{blog,projects}.ts`, BMC script etiketi, seed'den sonra `public/*.png`.

---

### Task 0: Ön koşullar (sahip ile birlikte)

- [ ] **Step 1:** `master` dalından `redesign` dalı aç: `git checkout -b redesign`.
- [ ] **Step 2:** Vercel projesinde Neon (Marketplace) ve bir Blob store bağlı mı kontrol et (Vercel MCP veya `vercel env ls`). Bağlı değilse sahipten bağlamasını iste. Sonra `vercel env pull .env.local` çalıştır. `.env.local` dosyasında `DATABASE_URL` ve `BLOB_READ_WRITE_TOKEN` olmalı.
- [ ] **Step 3:** Sahipten `.env.local` dosyasına `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IP_HASH_SALT` eklemesini iste. Değerleri sohbette tekrar etme. Aynı değişkenlerin Vercel'e de eklenmesi gerekir; `ADMIN_*` hariç.
- [ ] **Step 4:** `npm install` çalıştır. Beklenen: hatasız.

### Task 1: Bağımlılıklar, test altyapısı, DB şeması

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts`, `drizzle/` (üretilen migration)

**Interfaces:**
- Produces: `db` (`src/db/index.ts`), tablolar `settings`, `blocks`, `projects`, `projectImages`, `posts`, `skills`, `adminUsers`, `sessions`, `loginAttempts` (`src/db/schema.ts`), tip `Localized` (`src/lib/localized.ts` içinden import edilir; Task 3 o dosyayı genişletir).

- [ ] **Step 1: Paketleri kur**

```
npm i drizzle-orm @neondatabase/serverless @vercel/blob react-markdown remark-gfm rehype-sanitize
npm i -D drizzle-kit vitest tsx
```
`package.json` script'leri: `"test": "vitest run"`, `"db:generate": "drizzle-kit generate"`, `"db:migrate": "drizzle-kit migrate"`, `"db:seed": "tsx scripts/seed.ts"`.

- [ ] **Step 2: `vitest.config.ts`** — `@` → `./src` alias'ı, `environment: 'node'`.

- [ ] **Step 3: `src/lib/localized.ts`** — yalnızca `export type Localized = { en?: string; tr?: string };`.

- [ ] **Step 4: `src/db/schema.ts`** — Drizzle `pg-core`. Tüm id'ler `uuid().defaultRandom().primaryKey()`, zaman damgaları `timestamp({ withTimezone: true }).defaultNow()`.
  - `settings`: `key text pk`, `value jsonb notNull`.
  - `blocks`: `id`, `page text notNull`, `position integer notNull`, `type text notNull`, `size text notNull default 'full'`, `config jsonb notNull default {}`, `createdAt`. İndeks `(page, position)`.
  - `projects`: `id`, `slug text unique notNull`, `title/category/summary/body jsonb.$type<Localized>() notNull default {}`, `status text notNull` (`'completed' | 'in_progress' | 'archived'`), `startedAt text` (`'YYYY-MM'`), `technologies text[] notNull default []`, `link text`, `repoUrl text`, `coverImageId uuid` (null olabilir, FK yok), `published boolean notNull default true`, `createdAt`.
  - `projectImages`: `id`, `projectId uuid notNull references projects.id onDelete cascade`, `url text notNull`, `alt jsonb.$type<Localized>() default {}`, `position integer notNull`.
  - `posts`: `id`, `slug unique`, `title/excerpt/body Localized`, `coverUrl text`, `tags text[] default []`, `publishedAt timestamp`, `draft boolean notNull default true`, `createdAt`, `updatedAt`.
  - `skills`: `id`, `kind text notNull` (`'tech' | 'language'`), `name/level Localized`, `percentage integer notNull`, `position integer notNull`.
  - `adminUsers`: `id`, `email text unique notNull`, `passwordHash text notNull`.
  - `sessions`: `id`, `tokenHash text unique notNull`, `userId uuid references adminUsers.id onDelete cascade`, `expiresAt timestamp notNull`.
  - `loginAttempts`: `id`, `ipHash text notNull`, `createdAt`. İndeks `(ipHash, createdAt)`.

- [ ] **Step 5: `src/db/index.ts`** — `export const db = drizzle(neon(process.env.DATABASE_URL!), { schema })` (`drizzle-orm/neon-http`).

- [ ] **Step 6: `drizzle.config.ts`** — başta `process.loadEnvFile('.env.local')` (dosya yoksa try/catch ile yut), `dialect: 'postgresql'`, `schema: './src/db/schema.ts'`, `out: './drizzle'`.

- [ ] **Step 7: Migration üret ve uygula**
Run: `npm run db:generate && npm run db:migrate`. Beklenen: `drizzle/0000_*.sql` oluşur, migrate "applied" der.

- [ ] **Step 8: Commit** — `feat(db): add drizzle schema for neon`

### Task 2: Kimlik doğrulama çekirdeği

**Files:**
- Create: `src/lib/auth/password.ts`, `src/lib/auth/session.ts`, `src/lib/ip.ts`
- Test: `src/lib/auth/password.test.ts`, `src/lib/ip.test.ts`

**Interfaces:**
- Produces:
  - `hashPassword(plain: string): Promise<string>` → biçim `scrypt$<N>$<saltB64>$<hashB64>`, N=16384, keylen 64.
  - `verifyPassword(plain: string, stored: string): Promise<boolean>` → `timingSafeEqual`; bozuk biçimde `false`.
  - `hashIp(ip: string): string` → `sha256(IP_HASH_SALT + ip)` hex.
  - `clientIp(h: Headers): string` → `x-forwarded-for` ilk değer, yoksa `'0.0.0.0'`.
  - `createSession(userId: string): Promise<void>` → 32 bayt rastgele token, DB'ye hash'i, 30 gün; `session` çerezi + istemci arayüzü için `admin_hint=1` çerezi (HttpOnly değil, yetki taşımaz).
  - `getSession(): Promise<{ userId: string } | null>` → süresi geçmişse null.
  - `requireAdmin(): Promise<{ userId: string }>` → yoksa `redirect('/login')`.
  - `destroySession(): Promise<void>` → DB satırını ve iki çerezi siler.

- [ ] **Step 1: Failing testler**

```ts
// password.test.ts
it('verifies the right password', async () => {
  const h = await hashPassword('correct horse');
  expect(h.startsWith('scrypt$16384$')).toBe(true);
  expect(await verifyPassword('correct horse', h)).toBe(true);
});
it('rejects a wrong password', async () => {
  expect(await verifyPassword('nope', await hashPassword('correct horse'))).toBe(false);
});
it('two hashes of the same password differ (salted)', async () => {
  expect(await hashPassword('x')).not.toBe(await hashPassword('x'));
});
it('returns false on a malformed stored hash', async () => {
  expect(await verifyPassword('x', 'garbage')).toBe(false);
});
// ip.test.ts
it('hashIp is stable and does not contain the ip', () => {
  process.env.IP_HASH_SALT = 's';
  expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
  expect(hashIp('1.2.3.4')).not.toContain('1.2.3.4');
});
it('clientIp takes the first forwarded address', () => {
  expect(clientIp(new Headers({ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' }))).toBe('9.9.9.9');
  expect(clientIp(new Headers())).toBe('0.0.0.0');
});
```

- [ ] **Step 2:** `npm test` → FAIL (modüller yok).
- [ ] **Step 3:** `password.ts` ve `ip.ts` dosyalarını yaz (`node:crypto` `scrypt`, `randomBytes`, `timingSafeEqual`, `createHash`).
- [ ] **Step 4:** `session.ts` dosyasını yaz (`next/headers` `cookies()`, `next/navigation` `redirect`). Bu dosyanın birim testi yok; Task 9'da tarayıcıda doğrulanır.
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6: Commit** — `feat(auth): password hashing, sessions, ip hashing`

### Task 3: Dil (i18n) çekirdeği ve proxy

**Files:**
- Modify: `src/lib/localized.ts`
- Create: `src/lib/i18n.ts`, `src/lib/dictionaries.ts`, `proxy.ts`
- Test: `src/lib/i18n.test.ts`, `src/lib/localized.test.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'en' | 'tr'`, `LANGS: readonly Lang[]`, `isLang(x: unknown): x is Lang`.
  - `negotiateLang(acceptLanguage: string | null): Lang` → q değerlerine göre en yüksek öncelikli `tr*` veya `en*`; hiçbiri yoksa `'en'`.
  - `resolveLang(cookie: string | undefined, acceptLanguage: string | null): Lang` → geçerli çerez varsa o, yoksa `negotiateLang`.
  - `pickLocalized(v: Localized | null | undefined, lang: Lang): { text: string; fallbackFrom: Lang | null }` → boş string "yok" sayılır; ikisi de yoksa `{ text: '', fallbackFrom: null }`.
  - `dict(lang: Lang)` → arayüz metinleri nesnesi. Gerekli anahtarlar: `onlyIn.tr`, `onlyIn.en`, `nav.lang`, `nav.theme`, `projects.status.{completed,in_progress,archived}`, `projects.visit`, `projects.repo`, `projects.since`, `projects.tech`, `blog.empty`, `blog.readMore`, `contact.emailMe`, `common.back`, `footer.rights`. `onlyIn.tr` = "Only available in Turkish" / "Yalnızca Türkçe mevcut", `onlyIn.en` = "Only available in English" / "Yalnızca İngilizce mevcut".

- [ ] **Step 1: Failing testler**

```ts
// i18n.test.ts
it.each([
  ['tr-TR,tr;q=0.9,en;q=0.8', 'tr'],
  ['en-US,tr;q=0.9', 'en'],
  ['de-DE,tr;q=0.5', 'tr'],
  ['TR', 'tr'],
  ['de-DE', 'en'],
  ['', 'en'],
  [null, 'en'],
  [';;;q=abc,,', 'en'],
])('negotiateLang(%j) -> %s', (h, want) => expect(negotiateLang(h)).toBe(want));
it('resolveLang prefers a valid cookie', () => expect(resolveLang('tr', 'en-US')).toBe('tr'));
it.each(['de', '', '../x', undefined])('resolveLang ignores invalid cookie %j', (c) =>
  expect(resolveLang(c, 'tr-TR')).toBe('tr'));
// localized.test.ts
it('returns requested language', () =>
  expect(pickLocalized({ en: 'Hi', tr: 'Selam' }, 'tr')).toEqual({ text: 'Selam', fallbackFrom: null }));
it('falls back and reports source', () =>
  expect(pickLocalized({ tr: 'Selam' }, 'en')).toEqual({ text: 'Selam', fallbackFrom: 'tr' }));
it('treats empty string as missing', () =>
  expect(pickLocalized({ en: '', tr: 'Selam' }, 'en')).toEqual({ text: 'Selam', fallbackFrom: 'tr' }));
it('both missing', () => expect(pickLocalized({}, 'en')).toEqual({ text: '', fallbackFrom: null }));
it('null value', () => expect(pickLocalized(null, 'tr')).toEqual({ text: '', fallbackFrom: null }));
```

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `i18n.ts`, `localized.ts` (`pickLocalized`) ve `dictionaries.ts` dosyalarını yaz.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: `proxy.ts`** — `export function proxy(req: NextRequest)`:
  - `lang = resolveLang(req.cookies.get('lang')?.value, req.headers.get('accept-language'))`.
  - Yol zaten `/en` veya `/tr` ile başlıyorsa dokunma.
  - Değilse `NextResponse.rewrite(new URL('/' + lang + pathname + search, req.url))`.
  - Çerez yoksa ya da geçersizse yanıta `lang` çerezini yaz (1 yıl, `SameSite=Lax`).
  - `config.matcher`: `/api`, `/_next`, `/admin`, `/login` ve uzantılı dosyalar hariç her şey: `['/((?!api|_next|admin|login|.*\\..*).*)']`.
- [ ] **Step 6: Commit** — `feat(i18n): language negotiation, localized fallback, proxy rewrite`

### Task 4: Glass sistemi, tema, arka plan, site layout'u

**Files:**
- Create: `src/lib/glass-tier.ts`, `src/lib/glass-tier.test.ts`, `src/components/glass/{Glass.tsx,GlassFilter.tsx,glass.css}`, `src/components/ThemeToggle.tsx`, `src/components/LangToggle.tsx`, `src/components/FallbackBadge.tsx`, `src/app/(site)/[lang]/layout.tsx`, `public/wallpaper.webp`
- Modify: `src/app/globals.css`
- Delete: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/{about,blog,contact,projects}/**` (eski kök layout gidince bu rotalar derlenmez; yeni sayfalar Task 8'de gelir), `src/components/Hero.tsx`, `src/components/Navbar.tsx`

**Interfaces:**
- Produces:
  - `type GlassTier = 'refract' | 'blur' | 'solid'`.
  - `detectGlassTier(env: { isChromium: boolean; cores: number; memoryGb: number | null; reducedTransparency: boolean; reducedMotion: boolean; supportsBackdrop: boolean }): GlassTier`.
  - `glassTierScript: string` → `<head>` içine boyamadan önce çalışan inline script. Ortamı okur, `detectGlassTier` mantığını çalıştırır, `document.documentElement.dataset.glass` yazar. `detectGlassTier.toString()` ile aynı fonksiyondan üretilir, mantık kopyalanmaz.
  - `<Glass as?: ElementType, className?, children>` → `.glass` sınıflı yüzey.
  - `<FallbackBadge from: Lang | null lang: Lang />` → `from` null ise hiçbir şey render etmez.

- [ ] **Step 1: Failing testler**

```ts
const base = { isChromium: true, cores: 8, memoryGb: 8, reducedTransparency: false, reducedMotion: false, supportsBackdrop: true };
it('strong chromium -> refract', () => expect(detectGlassTier(base)).toBe('refract'));
it('non-chromium -> blur', () => expect(detectGlassTier({ ...base, isChromium: false })).toBe('blur'));
it('weak cpu chromium -> blur', () => expect(detectGlassTier({ ...base, cores: 4 })).toBe('blur'));
it('low memory -> blur', () => expect(detectGlassTier({ ...base, memoryGb: 2 })).toBe('blur'));
it('unknown memory does not block refract', () => expect(detectGlassTier({ ...base, memoryGb: null })).toBe('refract'));
it('reduced motion -> blur', () => expect(detectGlassTier({ ...base, reducedMotion: true })).toBe('blur'));
it('reduced transparency -> solid', () => expect(detectGlassTier({ ...base, reducedTransparency: true })).toBe('solid'));
it('no backdrop-filter -> solid', () => expect(detectGlassTier({ ...base, isChromium: false, supportsBackdrop: false })).toBe('solid'));
it('very weak device -> solid', () => expect(detectGlassTier({ ...base, isChromium: false, cores: 2, memoryGb: 1 })).toBe('solid'));
```
Eşikler: `refract` için `cores >= 6` ve (`memoryGb === null` veya `>= 4`). `solid` için `cores <= 2` ve `memoryGb !== null && memoryGb <= 2`.

- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** `glass-tier.ts` dosyasını yaz. **Step 4:** `npm test` → PASS.
- [ ] **Step 5: `globals.css` ve `glass.css`**
  - `@custom-variant dark (&:where(.dark, .dark *));`.
  - Renkleri token olarak tanımla (açık/koyu).
  - `body`: sabit `wallpaper.webp` arka planı (`background-attachment: fixed`, koyu modda daha karanlık bir overlay).
  - `.glass` için üç kademe:
    - `[data-glass=refract] .glass { backdrop-filter: url(#lg-refract) blur(6px) saturate(1.6) }`
    - `[data-glass=blur] .glass { backdrop-filter: blur(18px) saturate(1.6) }`
    - `[data-glass=solid] .glass { background: <yarı opak token> }`
    - Tüm kademelerde iç parlama gradyanı (`::before`), 1px parlak kenar ve yumuşak gölge.
  - `@media (prefers-reduced-motion: reduce)` içinde animasyonları kapat.
- [ ] **Step 6: `GlassFilter.tsx`** — `aria-hidden`, 0×0 boyutlu `<svg>`. İçinde `<filter id="lg-refract">`: kenarlarda güçlü, merkezde sıfıra yakın bükülme veren bir displacement haritası (`feImage` ile inline SVG/data-URL radyal gradyan) + `feDisplacementMap` (scale ≈ 30–60) + hafif kromatik ayrışma için R/B kanallarına ayrı ölçek.
- [ ] **Step 7: `public/wallpaper.webp`** — renkli, yumuşak gradyan "mesh" bir duvar kâğıdı üret: en fazla 200 KB, 2560px. Script ile SVG→webp ya da elle; kaynak dosyayı commit etme. Arka plan statik olmalı.
- [ ] **Step 8: `(site)/[lang]/layout.tsx`** — kök layout:
  - `generateStaticParams` → `[{lang:'en'},{lang:'tr'}]`, `dynamicParams = false`.
  - `<html lang={lang} suppressHydrationWarning>`, `<head>` içinde `glassTierScript`.
  - `ThemeProvider attribute="class" defaultTheme="system" enableSystem`, `GlassFilter`, `Analytics`, `{children}`, `IslandBar` (Task 7'de eklenir).
  - Geist fontları; `metadata.title` "Ali Tuna Baylan".
  - BMC `<script>` etiketi kaldırılır.
- [ ] **Step 9: `ThemeToggle`** — tek düğme `system → light → dark → system` döngüsü; ikonlar `Monitor` / `Sun` / `Moon`; `aria-label` sözlükten. **`LangToggle`** — `EN`/`TR` düğmesi: `document.cookie = 'lang=..;path=/;max-age=31536000;samesite=lax'`, ardından `location.reload()`.
- [ ] **Step 10: Commit** — `feat(ui): liquid glass tiers, theme and language toggles, site layout`

### Task 5: Blok modeli, ızgara ve Markdown

**Files:**
- Create: `src/blocks/types.ts`, `src/blocks/grid.ts`, `src/blocks/grid.test.ts`, `src/blocks/BlockGrid.tsx`, `src/blocks/registry.tsx`, `src/components/Markdown.tsx`

**Interfaces:**
- Produces:
  - `type PageKey = 'home' | 'projects' | 'blog' | 'about' | 'contact' | 'guestbook'`.
  - `type BlockSize = 'small' | 'medium' | 'large' | 'full'`.
  - `type ContentBlockType = 'hero' | 'markdown' | 'project' | 'post-list' | 'skills' | 'languages' | 'contact'` (widget tipleri Plan 6'da `BlockType` birleşimine eklenir).
  - `type Block = { id: string; page: PageKey; position: number; type: ContentBlockType; size: BlockSize; config: Record<string, unknown> }`.
  - `SIZEABLE: ReadonlySet<ContentBlockType>` = `{'project'}`; diğer tüm içerik blokları için boyut her zaman `full`.
  - `effectiveSize(b: Pick<Block,'type'|'size'>): BlockSize` → sizeable değilse `'full'`.
  - `sizeClass(s: BlockSize): string` → `small: 'col-span-1 row-span-1 aspect-square'`, `medium: 'col-span-2 row-span-1'`, `large: 'col-span-2 row-span-2 aspect-square'`, `full: 'col-span-full'`.
  - `<BlockGrid blocks: Block[] lang: Lang ctx: BlockCtx />` → `grid grid-cols-2 lg:grid-cols-4 gap-4`. Satır yüksekliği bir hücre genişliği kadar (`grid-auto-rows: minmax(var(--cell), auto)`, `--cell` container query birimiyle hesaplanır). Sıra = `position`.
  - `type BlockCtx = { projects: Map<string, ProjectWithImages>; posts: PostSummary[]; skills: Skill[]; settings: SiteSettings }` (tipler Task 6'da).
  - `registry: Record<ContentBlockType, (p: { block: Block; lang: Lang; ctx: BlockCtx }) => ReactNode>`. Bilinmeyen tip → `null` (silinmiş widget tipi sayfayı çökertmez).
  - `<Markdown source: string />` → `react-markdown` + `remark-gfm` + `rehype-sanitize` (varsayılan şema).

- [ ] **Step 1: Failing testler**

```ts
it('only project is sizeable', () => {
  expect(effectiveSize({ type: 'project', size: 'large' })).toBe('large');
  expect(effectiveSize({ type: 'markdown', size: 'small' })).toBe('full');
});
it('sizeClass maps sizes', () => {
  expect(sizeClass('small')).toContain('col-span-1');
  expect(sizeClass('full')).toBe('col-span-full');
});
```
- [ ] **Step 2:** FAIL. **Step 3:** `types.ts`, `grid.ts` dosyalarını yaz. **Step 4:** PASS.
- [ ] **Step 5:** `BlockGrid.tsx`, `registry.tsx` (bileşenler Task 6'da; şimdilik registry'yi boş fonksiyonlarla derlenebilir tut), `Markdown.tsx` dosyalarını yaz.
- [ ] **Step 6: Commit** — `feat(blocks): block model, grid sizing, markdown renderer`

### Task 6: Okuma sorguları ve içerik blokları

**Files:**
- Create: `src/data/queries.ts`, `src/data/project-cover.ts`, `src/data/project-cover.test.ts`, `src/blocks/content/{Hero,MarkdownBlock,ProjectCard,PostList,Skills,Languages,ContactCard}.tsx`
- Modify: `src/blocks/registry.tsx`
- Delete: `src/components/{Projects,Blog,TechLevels,LanguageLevels}.tsx`

**Interfaces:**
- Consumes: `db`, şema, `pickLocalized`, `dict`, `Markdown`, `Glass`, `FallbackBadge`, `Block`, `BlockCtx`.
- Produces:
  - `type ProjectWithImages = typeof projects.$inferSelect & { images: (typeof projectImages.$inferSelect)[] }`.
  - `type PostSummary = Pick<Post, 'id'|'slug'|'title'|'excerpt'|'coverUrl'|'publishedAt'>`.
  - `type Skill = typeof skills.$inferSelect`.
  - `type NavTab = { page: PageKey; icon: string; label: Localized; visible: boolean }`.
  - `type SiteSettings = { nav: NavTab[]; email: string; ownerName: string; socials: { kind: string; url: string }[] }` (ayar anahtarları: `nav`, `email`, `ownerName`, `socials`).
  - `getPageBlocks(page: PageKey): Promise<Block[]>` (position sırasıyla).
  - `getSettings(): Promise<SiteSettings>` (eksik anahtarlar için güvenli varsayılan).
  - `getPublishedProjects(): Promise<ProjectWithImages[]>`, `getProjectBySlug(slug): Promise<ProjectWithImages | null>` (yayında olmayan → null).
  - `getPublishedPosts(): Promise<PostSummary[]>` (`draft=false`, `publishedAt <= now`, yeniden eskiye), `getPostBySlug(slug)`.
  - `getSkills(): Promise<Skill[]>`.
  - `loadBlockCtx(blocks: Block[]): Promise<BlockCtx>` → yalnızca blokların ihtiyaç duyduğu veriyi çeker.
  - `projectCover(p: ProjectWithImages): string | null` → `coverImageId` eşleşen görsel; yoksa position'ı en küçük görsel; görsel yoksa `null`.
- Blok `config` biçimleri:
  - `hero` → `{ title: Localized; tagline: Localized; ctas: { label: Localized; page: PageKey }[] }`
  - `markdown` → `{ body: Localized }`
  - `project` → `{ projectId: string }` (proje yoksa ya da yayında değilse render edilmez)
  - `post-list` → `{ limit?: number }`
  - `skills`, `languages` → `{ title: Localized }`
  - `contact` → `{ title: Localized }`

- [ ] **Step 1: Failing testler (`projectCover`)**

```ts
const img = (id: string, position: number) => ({ id, url: `/${id}.png`, position } as any);
it('uses the chosen cover', () =>
  expect(projectCover({ coverImageId: 'b', images: [img('a', 0), img('b', 1)] } as any)).toBe('/b.png'));
it('falls back to first by position when cover is missing', () =>
  expect(projectCover({ coverImageId: 'gone', images: [img('b', 1), img('a', 0)] } as any)).toBe('/a.png'));
it('null when no images', () => expect(projectCover({ coverImageId: null, images: [] } as any)).toBeNull());
```
- [ ] **Step 2:** FAIL. **Step 3:** `project-cover.ts` dosyasını yaz. **Step 4:** PASS.
- [ ] **Step 5:** `queries.ts` dosyasını yaz.
- [ ] **Step 6:** İçerik bloklarını yaz. Hepsi server component ve `Glass` yüzeyi üzerinde. Her çevrilebilir alanın yanında `FallbackBadge` olur.
  - `ProjectCard`: kapak (`projectCover`, null ise ikonlu yer tutucu) + başlık + durum. Boyuta göre düzen: `small` (yalnızca kapak + başlık), `medium`/`large` (+ özet), `full` (yatay: kapak solda, metin sağda). `/projects/{slug}` linki.
  - `Skills` / `Languages`: bugünkü `TechLevels` / `LanguageLevels` görünümü, `getSkills` verisiyle.
  - `ContactCard`: `settings.email` için `mailto` + `contact.emailMe`.
  - `PostList`: kart listesi; boşsa `blog.empty`.
- [ ] **Step 7:** `next.config.ts` → `images.remotePatterns` içine `*.public.blob.vercel-storage.com`.
- [ ] **Step 8: Commit** — `feat(content): queries and content blocks`

### Task 7: Island bar

**Files:**
- Create: `src/components/IslandBar.tsx`
- Modify: `src/app/(site)/[lang]/layout.tsx`

**Interfaces:**
- Consumes: `SiteSettings.nav`, `Lang`, `dict`, `ThemeToggle`, `LangToggle`, `Glass`.
- Produces: `<IslandBar tabs: NavTab[] lang: Lang labels: {...} />` (client). Plan 2 buraya Düzenle düğmesini, Plan 6 kahve düğmesini ekler.

- [ ] **Step 1:** Yaz:
  - `fixed bottom-[max(1rem,env(safe-area-inset-bottom))]` ile ortalanmış kapsül.
  - Yalnızca `visible` sekmeler gösterilir. `href`: `home` → `/`, diğerleri → `/{page}`.
  - İkon adı `lucide-react` içinden `icons[name]` ile çözülür; bilinmeyen ad → `Circle`.
  - Masaüstünde ikon + ad, `md` altında yalnızca ikon (`aria-label` = ad).
  - Aktif sekme `usePathname()` ile bulunur (`/projects/x` → `projects`). Aktif sekmenin arkasındaki cam "damla" `transform` ve `width` geçişiyle kayar (ölçüm `ResizeObserver` ile).
  - Sağda dikey ayraç, ardından `LangToggle` ve `ThemeToggle`.
  - Sayfa altında barın yüksekliği + 2rem boşluk (layout'ta `pb-32`).
- [ ] **Step 2:** Layout'ta `getSettings()` ile `IslandBar` render et.
- [ ] **Step 3: Commit** — `feat(nav): liquid glass island bar`

### Task 8: Public sayfalar

**Files:**
- Create: `src/app/(site)/[lang]/{page.tsx, projects/page.tsx, projects/[slug]/page.tsx, blog/page.tsx, blog/[slug]/page.tsx, about/page.tsx, contact/page.tsx}`

**Interfaces:**
- Consumes: `getPageBlocks`, `loadBlockCtx`, `BlockGrid`, `getProjectBySlug`, `getPostBySlug`, `getPublishedProjects`, `getPublishedPosts`, `Markdown`, `projectCover`, `dict`.

- [ ] **Step 1:** Blok sayfaları (`home`, `projects`, `blog`, `about`, `contact`) aynı kalıpla yazılır: `blocks = await getPageBlocks(key)`, `ctx = await loadBlockCtx(blocks)`, `<main className="mx-auto max-w-6xl px-4 pt-10"><BlockGrid .../></main>`. Her sayfaya `generateMetadata` ile sözlükten başlık eklenir.
- [ ] **Step 2: `projects/[slug]`** — `generateStaticParams` her dil × yayındaki proje; `dynamicParams = true`; bulunamazsa `notFound()`.
  - İçerik: kapak hero + başlık/kategori, görsel galerisi (kapak dışındaki görseller, yatay kaydırma), Markdown gövde, yan panelde durum / `since` / teknolojiler / site ve repo linkleri. Her metnin yanında `FallbackBadge`.
- [ ] **Step 3: `blog/[slug]`** — aynı kalıp: kapak, başlık, tarih (`Intl.DateTimeFormat(lang)`), Markdown gövde. Taslak → `notFound()`.
- [ ] **Step 4:** `npm run build` → hatasız. Bu adım DB'nin seed edilmiş olmasını gerektirir; Task 9'dan sonra tekrar çalıştırılır.
- [ ] **Step 5: Commit** — `feat(pages): db-backed public pages`

### Task 9: Seed, giriş, yönetim iskeleti, doğrulama

**Files:**
- Create: `scripts/seed.ts`, `src/lib/revalidate.ts`, `src/app/(admin)/layout.tsx`, `src/app/(admin)/login/{page.tsx,actions.ts}`, `src/app/(admin)/admin/page.tsx`
- Delete: `public/{ecommerce,kaygi-asistani,vektorize}.png` (seed sonrası)

**Interfaces:**
- Produces:
  - `revalidateSite(): void` → `revalidatePath('/', 'layout')`. Tüm yazma işlemleri bunu çağırır. `// shortcut: her yazımda tüm site tazelenir; sayfa sayısı büyürse sayfa bazlı revalidate'e geç.`
  - `login(prev: { error?: string }, form: FormData): Promise<{ error?: string }>` (server action).
  - `logout(): Promise<void>` (server action).

- [ ] **Step 1: `scripts/seed.ts`** — `process.loadEnvFile('.env.local')`. Her tablo boşsa doldurur, doluysa atlar (idempotent):
  - Admin: `ADMIN_EMAIL` + `hashPassword(ADMIN_PASSWORD)`.
  - Ayarlar:
    - `ownerName`: "Ali Tuna Baylan"
    - `email`: "tunaonair@gmail.com"
    - `socials`: `[]`
    - `nav`: home(`House`, Home/Ana Sayfa), projects(`Briefcase`, Projects/Projeler), blog(`PenLine`, Blog/Blog), about(`User`, About/Hakkımda), contact(`Mail`, Contact/İletişim), guestbook(`BookOpen`, Guestbook/Ziyaretçi Defteri, `visible:false` — Plan 5 açar).
  - Projeler: `src/data/projects.ts` içindeki 3 kayıt (seed bu dosyayı silinmeden önce okur ya da veriyi seed içine kopyalar). TR metinler aynen alınır, EN alanları boş bırakılır (fallback devreye girer). Durum eşlemesi: `Devam Ediyor` → `in_progress`. `developingSince` → `startedAt` (`Kasım 2025` → `2025-11`, `Ağustos 2024` → `2024-08`). Görseller `put('projects/<slug>.png', file, { access: 'public' })` ile Blob'a yüklenir, ilk görsel kapak yapılır.
  - Skills: bugünkü `TechLevels` ve `LanguageLevels` dizileri. Seviye etiketleri TR + EN: Deneyimli/Experienced, Orta/Intermediate, Ana Dil/Native, `B2 - İleri-Orta`/`B2 - Upper-Intermediate`, `A1 - Başlangıç`/`A1 - Beginner`. Dil adları: Türkçe/Turkish, İngilizce/English, Fransızca/French.
  - Bloklar:
    - `home`: `hero` (title "Ali Tuna Baylan"; tagline TR = bugünkü Hero metni, EN = "Here to help you with years of software experience."; CTA'lar projects ve contact), ardından her proje için `project` (`small`).
    - `projects`: `markdown` (`# Projects` / `# Projeler`) + her proje için `project` (`small`).
    - `blog`: `markdown` başlık + `post-list`.
    - `about`: `markdown` (bugünkü iki paragraf TR + EN çevirisi) + `languages` + `skills`.
    - `contact`: `markdown` (bugünkü başlık + açıklama TR + EN) + `contact`.
  - Blog yazısı seed edilmez (yer tutucular siliniyor).
- [ ] **Step 2:** `npm run db:seed` → çıktıda her tablonun eklendiğini gösteren satırlar. İkinci çalıştırmada her şey "skipped".
- [ ] **Step 3: `login/actions.ts`** — `login`:
  1. `ipHash = hashIp(clientIp(await headers()))`.
  2. Son 15 dakikada bu `ipHash` için `loginAttempts` sayısı 5 veya fazlaysa `{ error: 'Çok fazla deneme. 15 dakika sonra tekrar dene.' }` döner.
  3. E-posta + şifre doğrulanır. E-posta yoksa da `verifyPassword` sahte bir hash'e karşı çalıştırılır (zamanlama eşit kalsın).
  4. Başarısızsa `loginAttempts` satırı eklenir ve her durumda aynı mesaj döner: `{ error: 'E-posta veya şifre hatalı.' }`.
  5. Başarılıysa bu `ipHash`'in denemeleri silinir, `createSession` çalışır, `redirect('/')`.
  `logout` → `destroySession()`, `redirect('/')`.
- [ ] **Step 4: `login/page.tsx`** — cam kart içinde e-posta + şifre formu (`useActionState`), etiketli alanlar, hata `role="alert"`. `(admin)/layout.tsx` kendi `<html lang="tr">` kök layout'u: aynı CSS, `glassTierScript`, ThemeProvider. `admin/page.tsx` → `await requireAdmin()`, "Yönetim paneli — Plan 2'de" yer tutucusu + çıkış düğmesi.
- [ ] **Step 5: Doğrulama (tarayıcıda, `npm run dev`)**
  - `/` → Hero + 3 proje kartı cam yüzeylerde; island bar altta.
  - EN tarayıcıda projelerde "Only available in Turkish" etiketi görünür; `LangToggle` ile TR'ye geçince etiket kaybolur ve TR metinler gelir.
  - Tema düğmesi system → light → dark döngüsü yapar, yenilemede seçim korunur, yanıp sönme olmaz.
  - DevTools'ta `<html data-glass>` Chrome'da `refract`. Rendering panelinde `prefers-reduced-transparency: reduce` emüle edilince yenilemede `solid`.
  - `/projects/vektorizer` → galeri ve linkler çalışır. Olmayan slug → 404.
  - `/blog` → boş durum metni.
  - `/login` → yanlış şifre 5 kez → 6. denemede kilit mesajı. Doğru giriş (kilit yokken) → `/` sayfasına yönlenir, `/admin` açılır. Çıkış sonrası `/admin` → `/login`.
  - 375px genişlikte yatay kaydırma yok; island bar yalnızca ikon gösterir.
- [ ] **Step 6:** `npm test && npm run build && npm run lint` → hepsi temiz.
- [ ] **Step 7:** Seed'den sonra `public/*.png` sil, `src/data/` sil. Build'i tekrarla.
- [ ] **Step 8: Commit** — `feat: seed, admin login, remove legacy static data`
