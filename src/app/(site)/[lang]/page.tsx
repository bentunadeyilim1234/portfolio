import { BlockPage } from "@/blocks/BlockPage";
import { routeParams, type LangProps } from "@/lib/route-params";

// No generateMetadata: the layout's default title is the site name.
export default async function HomePage({ params }: LangProps) {
  const { lang } = await routeParams(params);
  return <BlockPage page="home" lang={lang} />;
}
