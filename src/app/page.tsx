import Image from "next/image";
import Link from "next/link";
import { getAllInteriors } from "@/lib/content";
import styles from "./page.module.css";

export default async function InteriorsIndex() {
  const interiors = await getAllInteriors();

  return (
    <div className={styles.list}>
      {interiors.map((project, i) => {
        const listingDetail = project.location || project.year;

        return (
          <div key={project.slug} className={styles.item}>
            <Link
              href={`/interiors/${project.slug}`}
              className={styles.itemLink}
              aria-label={`${project.title} — ${listingDetail}`}
            >
              <div className={styles.mediaBox}>
                <div className={styles.frame}>
                  <Image
                    src={project.gallery[0]}
                    alt={project.title}
                    fill
                    sizes="calc(100vw - 48px)"
                    className={styles.image}
                    priority={i === 0}
                  />
                </div>
              </div>

              <div className={styles.caption}>
                <span className="heading">{project.title}</span>
                <span className={`body ${styles.muted}`}>{listingDetail}</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
