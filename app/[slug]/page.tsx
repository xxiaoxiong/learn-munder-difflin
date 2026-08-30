import { notFound } from "next/navigation";
import LearningSite from "../LearningSite";
import { navigation, pages } from "../site-data";

export function generateStaticParams() {
  return navigation.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  return {
    title: `${page.title.zh} | Munder Difflin 架构学习`,
    description: page.summary.zh,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages[slug]) notFound();
  return <LearningSite slug={slug} />;
}
