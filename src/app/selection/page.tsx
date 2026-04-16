import Image from "next/image";
import Link from "next/link";
import { getAllSelection } from "@/lib/content";
import styles from "./page.module.css";

export const metadata = {
  title: "Selection",
};

export default async function SelectionGrid() {
  const pieces = await getAllSelection();

  return (
    <div className={styles.grid}>
      {pieces.map((piece) => (
        <Link
          key={piece.slug}
          href={`/selection/${piece.slug}`}
          className={styles.cell}
          aria-label={piece.type ? `${piece.title} — ${piece.type}` : piece.title}
        >
          <div className={styles.frame}>
            <div className={`${styles.shot} ${styles[piece.aspect]}`}>
              <Image
                src={piece.image}
                alt={piece.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={styles.image}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
