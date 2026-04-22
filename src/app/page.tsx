import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { getAllInteriors } from "@/lib/content";
import styles from "./page.module.css";

export default async function InteriorsIndex() {
  const interiors = await getAllInteriors();
  const featured = interiors.slice(0, 2);

  return (
    <div className={styles.split} data-page="home">
      {featured.map((project, i) => {
        const listingDetail = project.location || project.year;

        return (
          <Link
            key={project.slug}
            href={`/interiors/${project.slug}`}
            className={classNames(
              styles.pane,
              featured.length === 1 && styles.paneSingle,
            )}
            aria-label={`${project.title} — ${listingDetail}`}
          >
            <div className={styles.imageWrap}>
              <Image
                src={project.gallery[0]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
                priority={i === 0}
              />
            </div>
            <div className={styles.caption}>
              <span className={`heading ${styles.captionTitle}`}>{project.title}</span>
              {listingDetail && (
                <span className={`body ${styles.captionLocation}`}>{listingDetail}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
