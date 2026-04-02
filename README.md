# 🎯 DGS 2026 Deneme Takip ve Analiz

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

DGS (Dikey Geçiş Sınavı) 2026 hazırlık sürecinde çözülen denemeleri takip etmek, konu analizlerini derinlemesine incelemek ve kalan süreyi yönetmek için geliştirilmiş yüksek performanslı, **serverless (sunucusuz)** bir web uygulamasıdır.

## 🚀 Özellikler

- **Gelişmiş Deneme Kaydı:** Sadece netleri değil, sayısal ve sözel olarak hangi konulardan doğru/yanlış yapıldığını tek tek kaydetme imkanı.
- **Dinamik Zayıf Konu Tespiti:** Girilen verilere göre yanlış oranını (`wrong_rate`) hesaplayıp, en acil çalışılması gereken konuları öne çıkartır.
- **Edge Üzerinde Sıfır Gecikme:** Cloudflare Pages ve D1 veritabanı sayesinde tüm API yanıtları ve SSR işlemleri ziyaretçiye en yakın sunucudan (Edge) döner.
- **Modern Arayüz (UI/UX):** Glassmorphism teknikleriyle tasarlanmış, tam duyarlı (responsive) karanlık tema (Dark Mode).
- **Zaman Yönetimi:** DGS 2026 (19 Temmuz) hedefine kilitlenmiş, canlı işlem yapan optimizasyonlu geri sayım sayacı.

## 🛠️ Teknoloji Yığını

- **Framework:** [Astro](https://astro.build/) (Server-Side Rendering modu aktif)
- **Frontend Kitaplığı:** [React](https://react.dev/) (Astro Islands mimarisi ile)
- **Stil Yönetimi:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Veritabanı:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Edge Node üzerinde SQLite)
- **Grafikler:** [Chart.js](https://www.chartjs.org/) + `react-chartjs-2`
- **Tür Güvenliği:** TypeScript
- **Kod Kalitesi:** ESLint + Prettier + Husky (özel CI scriptleri ile)

## 📦 Kurulum ve Geliştirme

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu İndirin ve Bağımlılıkları Kurun
```bash
git clone https://github.com/mobilteknolojileri/dgs-takip.git
cd dgs-takip
npm install
```

### 2. Yerel Veritabanını Başlatın
Local geliştirme (Wrangler simülasyonu) için gerekli SQLite tablolarını oluşturur:
```bash
npm run db:dev
```

### 3. Geliştirme Sunucusunu Çalıştırın
```bash
npm run dev
```
Uygulama `http://localhost:4321` adresinde çalışmaya başlayacaktır.

## 📜 Temel Komutlar (Scripts)

| Komut | Açıklama |
| :--- | :--- |
| `npm run dev` | Yerel geliştirme ortamını (Astro dev + Cloudflare workerd) başlatır. |
| `npm run check` | Projedeki türleri (TypeScript), lint (ESLint) ve format (Prettier) sorunlarını tek seferde denetler. |
| `npm run fix` | Lint ve format hatalarını otomatik olarak düzeltir. |
| `npm run db:dev` | `schema.sql` dosyasını yerel wrangler d1 simülatörüne uygular. |
| `npm run db:push:prod` | Şema değişikliklerini gerçek (Production) Cloudflare D1 veritabanına aktarır. |
| `npm run deploy` | Kalite kontrollerinden geçirip, projeyi Cloudflare Pages üzerine deploy eder. |

## 🏗️ Proje Mimarisi

- `db/schema.sql` → Veritabanı şeması tasarımı. (Sadece veriler saklanır, statik konu listeleri frontend üzerinde yaşar).
- `src/pages/api/` → Cloudflare ağında çalışan hafif Astro API endpointleri.
- `src/components/` → İzole edilmiş, tekrar kullanılabilir React adaları (Astro Islands).
- `docs/conventions/` → Projede kullanılan katı Commit standartları (`commit.md`).
