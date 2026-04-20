"use client";

import { useEffect, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={classNames(styles.header, isMenuOpen && styles.menuOpen)}
      >
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

        <button
          type="button"
          className={classNames("heading", styles.menuToggle)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-site-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {isMenuOpen ? (
        <div className={styles.menuOverlay}>
          <nav
            id="mobile-site-menu"
            className={styles.mobileNav}
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "heading",
                  styles.mobileLink,
                  navItemIsActive(item.href, pathname) && styles.active,
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
