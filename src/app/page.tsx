import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-blue-500/30">
      <Hero />

      {/* Footer */}
      <footer id="contact" className="py-12 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ALITUNABAYLAN. Tüm hakları saklıdır.</p>
      </footer>
    </main>
  );
}
