import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <span className="heading">© Paul Urtasun {year}</span>
    </footer>
  );
}
