# Liquid Glass Portfolyo — Tasarım Dokümanı

Tarih: 2026-11-20
Durum: Onaylandı (2026-11-20)

## 1. Amaç ve neden

Ali Tuna Baylan'ın kişisel portfolyosu baştan yeniden yapılıyor. Amaç bir **portfolyo**: ziyaretçi kim olduğunu, ne yaptığını ve projelerini görmeli. Görsel dil Apple'ın **liquid glass** / glassmorphism temasını hedefleyen, deneysel, iOS hissi veren bir arayüz; gezinme altta yüzen bir **island bar** ile.

Bugün site tamamen statik: projeler ve blog `src/data/*.ts` içinde, hakkımda/iletişim metinleri sayfalara gömülü, backend yok. Yeni sitede her şey **site içinden, sahibinin kendi giriş bilgileriyle** yönetilecek.

Deneysel taraf portfolyonun önüne geçmemeli: önce kişi ve projeler okunur, efektler bunu süsler.

## 2. Hedefler

1. Liquid glass temalı, altta island bar'lı yeni arayüz (tüm sayfalar).
2. **Blok tabanlı sayfalar**: her sayfa sıralanabilir bloklardan oluşur; widget'lar da blok olduğundan herhangi bir sayfanın herhangi bir yerine (projelerin arasına dahil) konabilir.
3. **Düzenleme modu**: giriş yapan sahip, sitenin kendisi üzerinde iOS "titreşim modu" ile blokları sürükleyip sıralar, ekler, çıkarır; bir bloğa dokununca cam bir alt panelde (sheet) ayarlarını düzenler.
4. Küçük bir `/admin` bölümü: blog yazıları, projeler, ziyaretçi defteri moderasyonu, island bar sekmeleri, Spotify bağlantısı, genel ayarlar, şifre değiştirme.
5. Backend: **Neon** (Postgres, Vercel Marketplace üzerinden) + **Vercel Blob** (görsel/video).
6. **Blog** tamamen çalışır: multimedya destekli Markdown editörü.
7. **Ziyaretçi defteri**: anonim yorum/tavsiye, küfür filtresi, bot ve spam koruması.
8. **İki dil**: varsayılan İngilizce, Türkçe yerelli tarayıcılara otomatik Türkçe, island bar'dan dil seçimi.
9. **GitHub'dan proje içe aktarma**: public repo URL'sinden proje taslağı.
10. Her şey yalnızca **Vercel** üzerinde çalışır; başka hosting gerekmez.

## 3. Hedef olmayanlar (non-goals)

- Ziyaretçilerin widget düzenini kişiselleştirmesi (yalnızca sahip düzenler).
- CMS'ten yeni sayfa oluşturma. Sayfa seti sabit: Ana Sayfa, Projeler, Proje Detayı, Blog, Blog Yazısı, Hakkımda, İletişim, Ziyaretçi Defteri.
- Arka plan, renk, yazı tipi gibi tema ayarlarının CMS'ten değiştirilmesi.
- Birden fazla yönetici hesabı, roller.
- Blog yazılarına yorum, bülten/e-posta aboneliği, iletişim formu (iletişim sayfası e-posta + sosyal linklerden oluşur).
- Otomatik çeviri.

## 4. Anti-hedefler (çalışsa bile başarısızlık sayılacak durumlar)

- Düşük donanımlı telefonda takılan, kasan site.
- Cam efektleri yüzünden okunamayan metin (kontrast WCAG AA'nın altına düşmemeli).
- Yönetim fonksiyonlarına giriş yapmadan erişilebilmesi, ya da yönetim API'lerinin yetkisiz çağrılabilmesi.
- Ziyaretçi defterinin spam/küfürle dolması.
- Sahibin bir değişiklik yapıp bunun sitede görünmemesi (cache tutarsızlığı).

## 5. Kısıtlar

- Mevcut proje üzerine: Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, React Compiler açık. `@vercel/analytics` korunur.
- Hosting yalnızca Vercel. Dış servisler yalnızca veri kaynağı: Spotify Web API, GitHub API, Open-Meteo, Buy Me a Coffee sayfası.
- Gerçek refraction (kırılma) efekti `backdrop-filter: url(#svg-filter)` ile yalnızca Chromium'da çalışır; diğer tarayıcılarda görsel olarak olabildiğince benzer bir fallback gerekir.
- Site dili İngilizce/Türkçe; arayüz kodu ve tanımlayıcılar İngilizce.

## 6. Yaklaşımlar

| Yaklaşım | Artı | Eksi |
|---|---|---|
| 1. Payload CMS gömülü (`/admin`) | Auth, i18n, blok alanı, Blob yükleme hazır; en hızlı sağlam admin | Paneli Payload'ın kurumsal görünümünde, cam temasına uymaz; ağır bağımlılık, Next sürüm yükseltmeleri Payload'a bağlı |
| 2. Kendi yazdığımız ayrı `/admin` paneli | Hafif, tamamen bize ait, cam stilinde | Widget dizilimi sitede değil bir listede düzenlenir, sonucu görmek için önizleme gerekir |
| **3. Kendi CMS'imiz + site içi düzenleme modu** (seçilen) | iOS konseptine en uygun; ne görüyorsan onu düzenlersin | Ön yüzde 2. yoldan belirgin şekilde fazla iş |

**Seçilen: 3.** Sahip "site içinden yönetim" ve iOS hissi istedi; düzenleme modu ikisini doğrudan karşılıyor. Payload tek kişilik bir site için ağır ve paneli temaya uymuyor.

## 7. Kararlaştırılan tasarım

### 7.1 Teknoloji

- **Veritabanı**: Neon Postgres, `@neondatabase/serverless` sürücüsü + **Drizzle ORM** (şema ve migration'lar repoda).
- **Dosyalar**: `@vercel/blob`. Yönetici yüklemeleri istemciden doğrudan Blob'a (`@vercel/blob/client` + yalnızca oturum açmış yöneticiye token veren `handleUpload` route'u).
- **Bot koruması**: Vercel **BotID** (`botid` paketi).
- **Sürükle-bırak**: dnd-kit.
- **Oturum**: Veritabanında tutulan oturumlar; çerez `HttpOnly`, `Secure`, `SameSite=Lax`, içinde rastgele token, DB'de token'ın hash'i. Şifreler Node `crypto.scrypt` ile hash'lenir.
- **Görseller**: `next/image`, Blob alan adı `remotePatterns` içinde.
- **Tema**: Varsayılan olarak sistem açık/koyu moduna uyar. Ziyaretçi island bar'daki tema düğmesiyle Sistem / Açık / Koyu arasında geçiş yapabilir; seçim tarayıcıda hatırlanır. Zaten kurulu olan `next-themes` kullanılır (ilk yüklemede yanıp sönme olmadan).

### 7.2 Dil (i18n)

- Desteklenen diller: `en` (varsayılan), `tr`.
- URL'de dil öneki yok. Dil `lang` çerezinde tutulur. Çerez yoksa `proxy.ts` (Next 16'daki middleware) `Accept-Language` başlığına bakar: Türkçe tercih eden tarayıcıya `tr`, diğerlerine `en` yazar.
- Island bar'daki dil düğmesi çerezi değiştirir ve sayfayı yeniler.
- Arayüz metinleri kodda iki sözlükte (`en`, `tr`) tutulur.
- İçerikteki her çevrilebilir alan `{ en?: string, tr?: string }` şeklinde tutulur (jsonb).
- **Fallback kuralı**: İstenen dilde içerik yoksa diğer dildeki gösterilir, yanında küçük bir "Only available in Turkish" / "Yalnızca İngilizce mevcut" etiketi olur. İçerik gizlenmez.
- CMS'te her çevrilebilir alanın EN/TR sekmesi vardır; en az bir dil doldurulmalıdır.

### 7.3 Sayfalar ve blok modeli

Sabit sayfa anahtarları: `home`, `projects`, `blog`, `about`, `contact`, `guestbook`. Her sayfa, sırası değiştirilebilen bir **blok listesidir**.

Blok tipleri iki gruptur:

**İçerik blokları** (mevcut bileşenlerin karşılıkları):
- `markdown` — çevrilebilir Markdown metin (başlık, giriş, hakkımda paragrafları vb.).
- `project` — tek bir projenin kartı. Widget'lar gibi ızgarada **kutu** olarak durur; boyutu `small` (1×1 kare, **varsayılan**), `medium` (2×1), `large` (2×2) veya `full` (tüm satır) olabilir. Yeni proje oluşturulunca `projects` sayfasının sonuna `small` olarak otomatik eklenir; proje silinince bloğu da silinir.
- `post-list` — blog yazıları listesi (en yeniden eskiye).
- `skills` — teknoloji seviyeleri (bugünkü `TechLevels`).
- `languages` — dil seviyeleri (bugünkü `LanguageLevels`).
- `contact` — e-posta ve iletişim kartı.
- `guestbook` — ziyaretçi defteri formu ve mesaj listesi.

**Widget'lar** (her birinin `small` / `medium` / `large` boyutu var; iOS'taki gibi ızgaraya yerleşir):

| Widget | İçerik | Kaynak |
|---|---|---|
| Spotify | Şu an çalan şarkı, kapak, ilerleme; takip kapalıysa/çalmıyorsa "Not listening right now" | Spotify Web API |
| Hakkımda özeti | `about` sayfasındaki ilk `markdown` bloğunun ziyaretçinin dilindeki ilk ~2 cümlesi, otomatik | DB |
| Saat ve hava | Sahibin şehrinde yerel saat + hava durumu | Open-Meteo (anahtarsız) |
| Öne çıkan proje | Seçilen proje, kapak görseliyle | DB |
| Son blog yazısı | En son yayımlanan yazı | DB |
| GitHub katkı grafiği | Son 1 yılın katkı ızgarası | GitHub GraphQL (token gerekir) |
| Durum | Elle girilen kısa çevrilebilir not ("Şu an … üzerinde çalışıyorum") | DB |
| Yetenekler | Teknoloji seviyelerinin kompakt hali | DB |
| Fotoğraf galerisi | Seçilen fotoğraflar arasında döner | Blob |
| Geri sayım | Bir tarihe kalan süre + çevrilebilir etiket | DB |
| Sosyal bağlantılar | GitHub, LinkedIn, Instagram, X, e-posta vb. | DB (ayarlar) |
| Son ziyaretçi mesajı | Defterdeki en son görünür mesaj | DB |
| Buy Me a Coffee | Destek çağrısı; tıklayınca BMC paneli açılır | BMC |
| Serbest not | Kısa çevrilebilir Markdown | DB |

Sayfa yerleşimi: her sayfa **tek bir duyarlı ızgaradır** (iOS ana ekranı gibi; masaüstünde 4, mobilde 2 sütun — builder ince ayar yapabilir). Widget'lar ve `project` blokları boyutlarına göre hücre kaplar ve karışık dizilir; diğer içerik blokları (`markdown`, `post-list`, `skills`, `languages`, `contact`, `guestbook`) tüm satırı kaplar. Görsel sıra her zaman kayıtlı sırayla aynıdır (`grid-auto-flow: dense` kullanılmaz; kullanılırsa sürükleme konumu ve klavye sırası görünenle uyuşmaz). Boşlukları sahip sıralamayla kapatır. Düzenleme modunda sıralama bu tek ızgara üzerinde yapılır.

Detay sayfaları (`/projects/[slug]`, `/blog/[slug]`) blok listesi değildir; kayıtların kendisinden render edilir.

### 7.4 Düzenleme modu

- Sahip giriş yaptıysa island bar'da bir **Düzenle** düğmesi çıkar.
- Düzenleme modunda bloklar iOS'taki gibi hafifçe sallanır. Her bloğun köşesinde **sil (−)** ve **ayarlar** düğmesi olur. Bloklar sürüklenerek sıralanır.
- **+ Blok ekle** bir galeri sheet'i açar: blok tipi ve widget boyutu seçilir.
- Bir bloğa dokunmak cam bir alt panel (sheet) açar: o bloğun ayarları (ör. Markdown metni EN/TR, öne çıkan proje seçimi, geri sayım tarihi, widget boyutu).
- Değişiklikler yerel olarak tutulur. **Bitti** ile tek seferde kaydedilir, **İptal** ile atılır. Kayıt sunucuda yetki kontrollü bir server action ile ve sayfanın blok listesinin tamamı tek işlemde (transaction) yazılarak yapılır.
- Kayıttan sonra ilgili cache tag'leri geçersiz kılınır; değişiklik hemen herkese görünür.

### 7.5 Island bar

- Ekranın altında ortalanmış, yüzen, liquid glass bir kapsül.
- İçerik: sahibin düzenlediği sekmeler + dil düğmesi + tema düğmesi + kahve (BMC) düğmesi + (giriş yapılmışsa) Düzenle düğmesi.
- Sekmeler `/admin` → "Gezinme" ekranından düzenlenir: hangi sayfa, ikon (lucide setinden), EN/TR ad, sıra, görünür/gizli. Sekmeler yalnızca sabit sayfa setini gösterebilir.
- Masaüstünde ikon + ad, mobilde yalnızca ikon. Aktif sekmenin arkasında akışkan hareket eden bir cam "damla" olur.
- Bar kendi yüksekliği kadar sayfa altına boşluk bırakır; içerik barın arkasında kalmaz.

### 7.6 Buy Me a Coffee

- Hazır BMC widget script'i kaldırılır (kendi düğmesini ve penceresini çiziyor, stillendirilemiyor).
- Island bar'daki kahve düğmesi, bardan yukarı doğru açılan cam bir panel açar. Panelin içinde BMC'nin kendi destek sayfası iframe olarak yüklenir (`buymeacoffee.com/widget/page/<kullanıcı adı>`). Panelin çerçevesi ve açılma animasyonu siteye ait; iframe'in içi BMC'nin görünümünde kalır.
- BMC kullanıcı adı ayarlardan değiştirilir.

### 7.7 Liquid glass ve performans

Üç kademe vardır. Kademe, sayfa yüklenince istemcide bir kez belirlenir ve `<html data-glass="...">` olarak yazılır:

1. **`refract`** — Chromium + yeterli donanım (ör. `navigator.hardwareConcurrency` ≥ 6 ve varsa `deviceMemory` ≥ 4) + hareket/şeffaflık azaltma tercihleri kapalı. SVG displacement filtresi ile gerçek kırılma: kenarlarda bükülme, specular parlama. Yalnızca island bar, açık sheet/paneller ve ekranda görünen widget'lara uygulanır.
2. **`blur`** — Diğer tarayıcılar ve orta seviye cihazlar. `backdrop-filter: blur() saturate()` + iç parlama gradyanları + ince parlak kenar + yumuşak gölge. Kırılmanın görünümünü olabildiğince taklit eder.
3. **`solid`** — Düşük donanım, `prefers-reduced-transparency`, ya da `backdrop-filter` desteklemeyen tarayıcı. Yarı opak düz yüzey + aynı kenar ve parlama, bulanıklık yok.

`prefers-reduced-motion` açıksa sallanma ve akışkan animasyonlar kapanır, yerlerine basit geçişler gelir.

Camın arkasında kırılacak bir şey olmalı. Bu yüzden sitenin sabit, tasarlanmış, renkli ve **statik** (animasyonsuz) bir arka planı olur. Arka plan CMS'ten değişmez.

Metin kontrastı her kademede WCAG AA'yı sağlamalıdır.

### 7.8 Blog

- `/admin/blog`: yazı listesi, oluştur, düzenle, sil, taslak/yayında.
- Alanlar: slug, başlık (EN/TR), özet (EN/TR), kapak görseli, gövde (EN/TR Markdown), yayın tarihi, taslak durumu, etiketler.
- **Markdown editörü**: araç çubuğu + canlı önizleme. Görsel ve video dosyaları sürükle-bırak veya yapıştır ile Blob'a yüklenir ve imlecin olduğu yere eklenir. Tek satırda duran YouTube/Vimeo linki önizlemede ve sitede gömülü oynatıcıya dönüşür. Yüklenen videolar `<video controls>` olarak gösterilir.
- Render: GFM (tablo, görev listesi, kod blokları), sözdizimi renklendirme. Çıktı **sanitize edilir** (yalnızca izin verilen etiket/attribute'lar, iframe yalnızca YouTube/Vimeo alan adları).
- Mevcut 3 İngilizce yer tutucu yazı silinir.

### 7.9 Projeler

- Alanlar: slug, başlık (EN/TR), kategori (EN/TR), kısa açıklama (EN/TR), detay gövdesi (EN/TR Markdown), durum (Tamamlandı / Devam Ediyor / Arşivlendi, çevrilir), başlangıç tarihi, teknolojiler, site linki, repo linki, yayında/taslak.
- **Görseller**: projenin birden fazla görseli olur. Görsel eklenebilir, silinebilir, sıralanabilir ve biri **varsayılan (kapak)** yapılabilir. Detay sayfasında galeri olarak gösterilir.
- **GitHub'dan içe aktar**: Public repo URL'si yapıştırılır. Sunucu GitHub REST API'den repo adı, açıklama, topics, diller ve homepage'i; README'yi çeker. README'deki görseller (Markdown `![]()` ve HTML `<img>`) bulunur, göreli yollar `raw.githubusercontent.com` adresine çözülür, rozetler (shields.io vb.) atlanır, görseller Blob'a kopyalanır, ilki kapak yapılır. README metni detay gövdesine (EN) taslak olarak konur. Sonuç kaydedilmemiş, doldurulmuş bir proje formu olarak sahibe gösterilir.
- Mevcut 3 proje ve görselleri seed sırasında DB'ye ve Blob'a taşınır.

### 7.10 Hakkımda ve iletişim

- Hakkımda sayfası bloklardan oluşur: bugünkü iki paragraf `markdown` bloğuna, dil ve teknoloji seviyeleri `languages` ve `skills` bloklarına taşınır.
- Seviyeler `/admin` → "Yetenekler" ekranından düzenlenir: ad, seviye etiketi (EN/TR), yüzde, sıra.
- İletişim sayfası: `markdown` giriş metni + `contact` bloğu (e-posta) + istenirse sosyal bağlantılar widget'ı. E-posta ve sosyal linkler ayarlardan gelir.

### 7.11 Ziyaretçi defteri

- Form alanları: isim (isteğe bağlı; boşsa "Anonim/Anonymous"), tür (Yorum / Tavsiye), mesaj (en fazla 500 karakter).
- Geçerli mesaj **hemen yayınlanır**. Sahip `/admin/guestbook` ekranından gizleyebilir ve silebilir.
- Korumalar (hepsi sunucuda):
  - **BotID** kontrolü; bot ise reddedilir.
  - Gizli **honeypot** alanı dolu ise sessizce reddedilir.
  - Form açılışından gönderime kadar en az ~3 sn geçmeli.
  - **Hız sınırı**: IP'nin tuzlanmış hash'i başına ör. 10 dakikada 3 mesaj (Neon'da tutulur; ham IP saklanmaz).
  - Aynı mesajın tekrarı reddedilir.
  - Link sınırı: mesajda URL'ye izin verilmez.
  - **Küfür filtresi**: Türkçe + İngilizce kelime listesi. Kontrol öncesi metin normalize edilir (küçük harf, Türkçe karakter eşleme, leetspeak `@→a, 1→i, 0→o, 3→e, $→s`, tekrar eden harflerin sıkıştırılması, araya konan noktalama/boşluk). Eşleşen mesaj reddedilir ve kullanıcıya nazik bir hata gösterilir.

### 7.12 Spotify

- Sahip `/admin/spotify` ekranından Spotify hesabını OAuth (Authorization Code) ile bir kez bağlar. Kapsamlar: `user-read-currently-playing`, `user-read-recently-played`. Refresh token DB'de saklanır.
- **Takip anahtarı** (açık/kapalı) aynı ekranda ve düzenleme modunda Spotify widget'ının ayarlarında bulunur.
- Takip kapalıysa sunucu Spotify'a hiç istek atmaz; widget "Not listening right now / Şu an bir şey dinlemiyor" gösterir.
- Public endpoint (`/api/now-playing`) yanıtı ~15 sn önbelleklenir. Widget ~30 sn'de bir yeniler, ilerleme çubuğunu istemcide ilerletir. Sekme görünmüyorken yenileme durur.

### 7.13 Kimlik doğrulama ve yetki

- Tek yönetici hesabı. İlk hesap seed script'i ile `ADMIN_EMAIL` / `ADMIN_PASSWORD` ortam değişkenlerinden oluşturulur. Şifre sonra `/admin` içinden değiştirilebilir.
- Giriş sayfası `/login`. Aynı IP hash'inden çok sayıda hatalı denemede (ör. 15 dakikada 5) giriş geçici olarak kilitlenir.
- **Her** yazma işlemi (server action ve route handler) sunucuda oturum kontrolü yapar. Yalnızca arayüzü gizlemek yeterli sayılmaz.
- Çıkış oturumu DB'den siler.

### 7.14 Önbellek

- Public okumalar Next'in veri cache'i ile tag'lenerek önbelleklenir (`pages`, `projects`, `posts`, `settings`, `guestbook`).
- Her yazma işlemi ilgili tag'i geçersiz kılar; değişiklikler hemen görünür.

### 7.15 Ortam değişkenleri ve Vercel kurulumu

- `DATABASE_URL` (Neon, Vercel Marketplace entegrasyonu otomatik ekler)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob store bağlanınca otomatik)
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`
- `GITHUB_TOKEN` (katkı grafiği için zorunlu, içe aktarmada hız sınırını artırır)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (yalnızca seed için)
- `IP_HASH_SALT`
- BotID, Vercel projesinde etkinleştirilir; ek anahtar gerekmez.

## 8. Builder'a bırakılanlar

- Dosya/klasör yapısı, bileşen bölünmesi, Drizzle şemasının ayrıntıları.
- Markdown editörü için kütüphane seçimi (sanitize şartıyla).
- Küfür listesinin içeriği (EN için hazır bir kütüphane kullanılabilir; TR listesi derlenir).
- Arka plan görselinin ve ikonların kesin tasarımı, animasyon eğrileri.
- Glass kademe eşiklerinin ince ayarı (anti-hedefe uyduğu sürece).
- Test kapsamı: en azından küfür normalizasyonu, README görsel çıkarımı, dil fallback'i, oturum/yetki kontrolü ve ziyaretçi defteri hız sınırı için birim testleri.
