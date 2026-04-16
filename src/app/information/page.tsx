import Image from "next/image";
import { getProfile } from "@/lib/content";
import styles from "./page.module.css";

export const metadata = {
  title: "Information",
};

export default async function InformationPage() {
  const profile = await getProfile();

  return (
    <div className={styles.page}>
      <section className={styles.text}>
        <p className={styles.bio}>{profile.bio}</p>

        <div className={styles.contact}>
          <a href={`mailto:${profile.email}`} className={styles.contactLink}>
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            className={styles.contactLink}
          >
            {profile.phone}
          </a>
          <address className={styles.address}>{profile.address}</address>
        </div>
      </section>

      <section className={styles.portrait}>
        <div className={styles.portraitStack}>
          <div className={styles.frame}>
            <Image
              src={profile.portrait}
              alt="Paul Urtasun"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>
          <p className={styles.portraitCaption}>{profile.portraitCaption}</p>
        </div>
      </section>
    </div>
  );
}
