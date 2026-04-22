"use client";

import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <span className="body">© Paul Urtasun {year}</span>
    </footer>
  );
}
