const skills = [
  { name: "React / Next.js", level: "Deneyimli", percentage: 95 },
  { name: "TypeScript", level: "Deneyimli", percentage: 90 },
  { name: "Tailwind CSS", level: "Deneyimli", percentage: 90 },
  { name: "Node.js", level: "Orta", percentage: 75 },
  { name: "Python", level: "Orta", percentage: 70 },
  { name: "UI/UX Design", level: "Deneyimli", percentage: 85 },
];

export default function TechLevels() {
  return (
    <div className="p-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-xl shadow-xl">
      <h3 className="text-xl font-bold mb-6">Teknik Yeteneklerim</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-end mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{skill.level}</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
