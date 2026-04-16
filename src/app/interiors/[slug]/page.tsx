import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Fact, FactList } from "@/components/Facts";
import { InteriorGallery } from "@/components/InteriorGallery";
import { dominantColorFromImageUrl } from "@/lib/dominantColor";
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

  const firstImage = project.gallery[0];
  const backdropColor = firstImage
    ? await dominantColorFromImageUrl(firstImage)
    : undefined;

  return (
    <article className={styles.page}>
      <InteriorGallery
        title={project.title}
        gallery={project.gallery}
        backdropColor={backdropColor}
      />

      <footer className={styles.meta}>
        <h1 className={styles.title}>{project.title}</h1>

        <FactList>
          <Fact label="Year" value={project.year} />
          {project.type ? <Fact label="Type" value={project.type} /> : null}
          {project.location ? (
            <Fact label="Location" value={project.location} />
          ) : null}
          {project.facts.map((fact, i) => (
            <Fact
              key={`${fact.label}-${fact.value}-${i}`}
              label={fact.label}
              value={fact.value}
            />
          ))}
        </FactList>

        <p className={styles.description}>{project.description}</p>
      </footer>
    </article>
  );
}
