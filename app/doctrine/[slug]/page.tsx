import { notFound } from "next/navigation";
import { getDoctrineContent, VALID_SLUGS } from "@/lib/doctrineContent";

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function DoctrineDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getDoctrineContent(slug);
  if (!content) return notFound();
  return <>{content}</>;
}
