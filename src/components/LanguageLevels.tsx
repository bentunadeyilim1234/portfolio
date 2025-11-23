const languages = [
  { name: "Türkçe", level: "Ana Dil", percentage: 100 },
  { name: "İngilizce", level: "B2 - İleri-Orta", percentage: 70 },
  { name: "Fransızca", level: "A1 - Başlangıç", percentage: 20 },
];

export default function LanguageLevels() {
  return (
    <div className="p-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-xl shadow-xl">
      <h3 className="text-xl font-bold mb-6">Dil Seviyelerim</h3>
      <div className="space-y-6">
        {languages.map((lang) => (
          <div key={lang.name}>
            <div className="flex justify-between items-end mb-2">
              <span className="font-medium">{lang.name}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{lang.level}</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${lang.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
