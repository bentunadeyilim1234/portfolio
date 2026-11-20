import type { Skill } from "@/data/types";
import type { Lang } from "@/lib/i18n";
import { Levels, type LevelsConfig } from "./Levels";

export function Skills({ config, skills, lang }: { config: LevelsConfig; skills: Skill[]; lang: Lang }) {
  return (
    <Levels
      config={config}
      items={skills.filter((s) => s.kind === "tech")}
      lang={lang}
      listClass="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      barClass="bg-gradient-to-r from-blue-500 to-purple-500"
    />
  );
}
