import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InteriorGallery } from "@/components/InteriorGallery";
import { getAllInteriors, getInterior } from "@/lib/content";
import styles from "./page.module.css";

type Params = { slug: string };

export async function generateStaticParams() {
  const interiors = await getAllInteriors();
  return interiors.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getInterior(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function InteriorDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getInterior(slug);
  if (!project) notFound();

  return (
    <article className={styles.page} data-page="interior">
      <InteriorGallery
        title={project.title}
        gallery={project.gallery}
        backdropColor={project.backdropColor}
      />

      <footer className={styles.meta}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
      </footer>
    </article>
  );
}
