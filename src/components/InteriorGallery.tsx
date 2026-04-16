"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./InteriorGallery.module.css";

type Props = {
  title: string;
  gallery: string[];
  /** Average color of the first image; used for gallery / letterbox backdrop. */
  backdropColor?: string;
};

const SCROLL_EPS = 2;

function updateGalleryCursor(el: HTMLDivElement, xInGallery: number) {
  const w = el.clientWidth;
  const maxScroll = el.scrollWidth - el.clientWidth;
  if (maxScroll <= SCROLL_EPS) {
    el.style.cursor = "";
    return;
  }
  const onLeft = xInGallery <= w / 2;
  const prevOk = el.scrollLeft > SCROLL_EPS;
  const nextOk = el.scrollLeft < maxScroll - SCROLL_EPS;
  if (onLeft) {
    el.style.cursor = prevOk ? "pointer" : "default";
  } else {
    el.style.cursor = nextOk ? "pointer" : "default";
  }
}

function ChevronLeft() {
  return (
    <svg
      className={styles.navIcon}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 6l-6 6 6 6"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className={styles.navIcon}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6l6 6-6 6"
      />
    </svg>
  );
}

export function InteriorGallery({ title, gallery, backdropColor }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryPointerXRef = useRef<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    setCanPrev(x > SCROLL_EPS);
    setCanNext(x < maxScroll - SCROLL_EPS);

    const lx = galleryPointerXRef.current;
    if (lx !== null) {
      updateGalleryCursor(el, lx);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    const ro = new ResizeObserver(syncScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      ro.disconnect();
    };
  }, [gallery.length, syncScrollState]);

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const step = el.clientWidth;
    el.scrollTo({
      left: Math.min(el.scrollLeft + step, maxScroll),
      behavior: "smooth",
    });
  }, []);

  const goPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth;
    el.scrollTo({
      left: Math.max(el.scrollLeft - step, 0),
      behavior: "smooth",
    });
  }, []);

  const onGalleryClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const step = el.clientWidth;
      if (x > rect.width / 2) {
        if (el.scrollLeft >= maxScroll - SCROLL_EPS) return;
        el.scrollTo({
          left: Math.min(el.scrollLeft + step, maxScroll),
          behavior: "smooth",
        });
      } else {
        if (el.scrollLeft <= SCROLL_EPS) return;
        el.scrollTo({
          left: Math.max(el.scrollLeft - step, 0),
          behavior: "smooth",
        });
      }
    },
    [],
  );

  const onGalleryMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      galleryPointerXRef.current = x;
      updateGalleryCursor(el, x);
    },
    [],
  );

  const onGalleryMouseLeave = useCallback(() => {
    galleryPointerXRef.current = null;
    const el = scrollRef.current;
    if (el) el.style.cursor = "";
  }, []);

  return (
    <div
      className={styles.wrap}
      style={
        backdropColor
          ? ({ "--gallery-backdrop": backdropColor } as CSSProperties)
          : undefined
      }
    >
      <div
        ref={scrollRef}
        className={styles.gallery}
        role="region"
        aria-label="Project images"
        onClick={onGalleryClick}
        onMouseMove={onGalleryMouseMove}
        onMouseLeave={onGalleryMouseLeave}
      >
        {gallery.map((src, i) => (
          <div key={src} className={styles.shot}>
            <Image
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              sizes="100vw"
              className={styles.shotImage}
              priority={i === 0}
              draggable={false}
              onLoadingComplete={syncScrollState}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.navPrev}
        aria-label="Previous image"
        disabled={!canPrev}
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className={styles.navNext}
        aria-label="Next image"
        disabled={!canNext}
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
