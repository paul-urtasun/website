"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import styles from "./Header.module.css";

const NAV = [
  { href: "/", label: "Interiors" },
  { href: "/selection", label: "Selection" },
  { href: "/information", label: "Information" },
] as const;

const CLOSE_DURATION = 480;

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
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMenuOpen && !isClosing) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen, isClosing]);

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsClosing(false);
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, CLOSE_DURATION);
  }, []);

  const navLinks = (onClick?: () => void) =>
    NAV.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={classNames(
          "heading",
          styles.link,
          navItemIsActive(item.href, pathname) && styles.active,
        )}
        onClick={onClick}
      >
        {item.label}
      </Link>
    ));

  return (
    <>
      <header
        className={classNames(
          styles.header,
          isMenuOpen && styles.menuOpen,
        )}
      >
        <Link href="/" className={classNames("heading", styles.logo)}>
          <span className={styles.wordmark}>Paul Urtasun</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Site">
          {navLinks()}
        </nav>

        <button
          type="button"
          className={classNames("heading", styles.menuToggle)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {(isMenuOpen || isClosing) && (
        <div className={classNames(styles.mobileOverlay, isClosing && styles.mobileOverlayClosing)}>
          <nav id="mobile-nav" className={styles.mobileNav} aria-label="Site">
            {navLinks(closeMenu)}
          </nav>
        </div>
      )}
    </>
  );
}
