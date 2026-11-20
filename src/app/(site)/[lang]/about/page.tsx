import type { Metadata } from "next";
import { BlockPage } from "@/blocks/BlockPage";
import { dict } from "@/lib/dictionaries";
import { routeParams, type LangProps } from "@/lib/route-params";

export async function generateMetadata({ params }: LangProps): Promise<Metadata> {
  const { lang } = await routeParams(params);
  return { title: dict(lang).pages.about };
}

export default async function AboutPage({ params }: LangProps) {
  const { lang } = await routeParams(params);
  return <BlockPage page="about" lang={lang} />;
}
