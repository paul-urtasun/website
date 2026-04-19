"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import logo from "./images/logo.svg";
import styles from "./Header.module.css";

const NAV = [
  { href: "/", label: "Interiors" },
  { href: "/selection", label: "Selection" },
  { href: "/information", label: "Information" },
] as const;

function navItemIsActive(
  href: (typeof NAV)[number]["href"],
  pathname: string | null,
) {
  if (!pathname) return false;
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/interiors");
  }
  if (href === "/selection") {
    return pathname === "/selection" || pathname.startsWith("/selection/");
  }
  if (href === "/information") {
    return pathname === "/information";
  }
  return false;
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={classNames("heading", styles.logo)}>
        <Image
          src={logo}
          alt=""
          width={16}
          height={21}
          className={styles.logoMark}
          priority
        />
        <span className={styles.wordmark}>Paul Urtasun</span>
      </Link>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={classNames(
            "heading",
            styles.link,
            styles.desktopLink,
            navItemIsActive(item.href, pathname) && styles.active,
          )}
        >
          {item.label}
        </Link>
      ))}
    </header>
  );
}
