import type { Skill } from "@/data/types";
import type { Lang } from "@/lib/i18n";
import { Levels, type LevelsConfig } from "./Levels";

export function Languages({ config, skills, lang }: { config: LevelsConfig; skills: Skill[]; lang: Lang }) {
  return (
    <Levels
      config={config}
      items={skills.filter((s) => s.kind === "language")}
      lang={lang}
      listClass="space-y-6"
      barClass="bg-fg"
    />
  );
}
