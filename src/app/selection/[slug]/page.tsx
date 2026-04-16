import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fact, FactList } from "@/components/Facts";
import { dominantColorFromImageUrl } from "@/lib/dominantColor";
import { getAllSelection, getSelection, getProfile } from "@/lib/content";
import styles from "./page.module.css";

type Params = { slug: string };

export async function generateStaticParams() {
  const pieces = await getAllSelection();
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getSelection(slug);
  if (!piece) return {};
  return {
    title: piece.title,
    description: piece.description,
  };
}

export default async function SelectionDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [piece, profile] = await Promise.all([
    getSelection(slug),
    getProfile(),
  ]);
  if (!piece) notFound();

  const detailBackdrop = await dominantColorFromImageUrl(piece.image);
  const enquireSubject = encodeURIComponent(`Enquiry — ${piece.title}`);

  return (
    <article className={styles.page}>
      <div className={styles.imageCol}>
        <div className={`${styles.frame} ${styles[piece.aspect]}`}>
          <Image
            src={piece.image}
            alt={piece.title}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className={styles.image}
            priority
          />
        </div>
      </div>

      <aside
        className={styles.detailCol}
        style={
          {
            "--selection-detail-backdrop": detailBackdrop,
          } as CSSProperties
        }
      >
        <div className={styles.detailScroll}>
          <div className={styles.detailScrollInner}>
            <h1 className={styles.title}>{piece.title}</h1>

            <p className={styles.description}>{piece.description}</p>

            {piece.type || piece.facts.length > 0 ? (
              <FactList>
                {piece.type ? <Fact label="Type" value={piece.type} /> : null}
                {piece.facts.map((fact, i) => (
                  <Fact
                    key={`${fact.label}-${fact.value}-${i}`}
                    label={fact.label}
                    value={fact.value}
                  />
                ))}
              </FactList>
            ) : null}

            <a
              className={styles.enquire}
              href={`mailto:${profile.email}?subject=${enquireSubject}`}
            >
              Enquire
            </a>
          </div>
        </div>
      </aside>
    </article>
  );
}
