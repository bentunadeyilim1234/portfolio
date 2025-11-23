import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden pt-12 md:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        <h1 className="text-5xl pb-2 md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
          ALI TUNA <br /> BAYLAN
        </h1>
        <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Yazılım alanında yılların getirdiği tecrübe ile size yardım etmek için buradayım.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/20 dark:shadow-white/20"
          >
            Projeler
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-sm hover:bg-white dark:hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300"
          >
            İletişim
          </Link>
        </div>
      </div>
    </section>
  );
}
