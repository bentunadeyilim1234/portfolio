export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">İletişime Geçelim</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Aklınızda gerçekleştirmek istediğiniz bir proje mi var? Size yardımcı olmaktan memnun olurum.
          </p>
        </div>

        {/* Email Section */}
        <div className="mb-12 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 text-center">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Doğrudan E-Posta Gönderin
          </h2>
          <a
            href="mailto:tunaonair@gmail.com"
            className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
          >
            tunaonair@gmail.com
          </a>
        </div>

        {/* Contact Form */}
        {/*<div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5">
          <h2 className="text-xl font-bold mb-6">Mesaj Gönderin</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Adınız
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Adınız"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                E-Posta Adresiniz
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="eposta@adresiniz.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mesajınız
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Size nasıl yardımcı olabilirim?"
              />
            </div>

            <button
              type="button"
              className="w-full py-3.5 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
            >
              Mesaj Gönder
            </button>
          </form>
        </div>*/}
      </div>
    </main>
  );
}
