import LanguageLevels from "@/components/LanguageLevels";
import TechLevels from "@/components/TechLevels";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Hakkımda</h1>

        {/* Introduction */}
        <div className="mb-12 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Ben Ali. Lise öğrencisiyim. Boş zamanlarımda programlama ile ilgileniyorum. Next.JS ve React ile web siteleri geliştirme konusunda 3+ yıllık bir deneyime sahibim.
          </p>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Yazılım macerama 8 yaşımda Python öğrenmek ile başladım. O gün bu gündür yazılım benim için bir hobiden fazlası olmuştur.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="space-y-8">
          <LanguageLevels />
          <TechLevels />
        </div>
      </div>
    </main>
  );
}
