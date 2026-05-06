"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./CarouselComponent.module.css";

/**
 * CarouselComponent — M3-inspired carousel with scroll-snap, nav arrows,
 * dot indicators, and keyboard/touch accessibility.
 *
 * Material Design 3 defines three carousel layouts:
 *   • multiBrowse (default) — equally-sized items, scrollable row
 *   • hero                 — one large item + small peek items
 *   • center               — active item centered, siblings peek
 *   • fullWidth             — each item takes 100% width (hero banner)
 *
 * Compound sub-components:
 *   CarouselComponent.Item       — individual carousel item container
 *   CarouselComponent.ItemMedia  — full-bleed image/video slot
 *   CarouselComponent.ItemLabel  — overlaid label with gradient scrim
 *
 * @param {"multiBrowse"|"hero"|"center"|"fullWidth"} [layout="multiBrowse"]
 * @param {boolean}  [showArrows=true]     — show prev/next nav arrows
 * @param {boolean}  [showIndicators=true] — show dot indicators
 * @param {boolean}  [peekEdge=false]      — subtle edge-fade gradient
 * @param {number}   [autoPlay=0]          — auto-advance interval in ms (0=disabled)
 * @param {boolean}  [loop=false]          — loop back to start at end
 * @param {number}   [gap=8]              — gap between items in px
 * @param {string}   [className]
 * @param {string}   [ariaLabel]           — accessible label for the carousel region
 * @param {React.ReactNode} children       — CarouselComponent.Item elements
 */
export default function CarouselComponent({
  layout = "multiBrowse",
  showArrows = true,
  showIndicators = true,
  peekEdge = false,
  autoPlay = 0,
  loop = false,
  gap = 8,
  className,
  ariaLabel = "Carousel",
  children,
}) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const autoPlayRef = useRef(null);

  const itemCount = Array.isArray(children) ? children.length : children ? 1 : 0;

  // ── Scroll state observer ─────────────────────────────────────
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 2);

    // Determine active item by finding the item closest to center
    const items = Array.from(track.children);
    if (!items.length) return;

    const trackCenter = scrollLeft + clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(trackCenter - itemCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    track.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  // ── Navigation ────────────────────────────────────────────────
  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;

      const items = Array.from(track.children);
      let targetIndex = index;

      if (loop) {
        if (targetIndex < 0) targetIndex = items.length - 1;
        if (targetIndex >= items.length) targetIndex = 0;
      } else {
        targetIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
      }

      const target = items[targetIndex];
      if (!target) return;

      track.scrollTo({
        left: target.offsetLeft - (layout === "center" ? (track.clientWidth - target.offsetWidth) / 2 : 0),
        behavior: "smooth",
      });
    },
    [layout, loop],
  );

  const scrollPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);
  const scrollNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);

  // ── Auto-play ─────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || autoPlay <= 0) return;

    autoPlayRef.current = setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, autoPlay);

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, activeIndex, scrollToIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!autoPlay || autoPlay <= 0) return;
    autoPlayRef.current = setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, autoPlay);
  }, [autoPlay, activeIndex, scrollToIndex]);

  // ── Keyboard navigation ───────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(itemCount - 1);
      }
    },
    [scrollPrev, scrollNext, scrollToIndex, itemCount],
  );

  // ── Root classes ──────────────────────────────────────────────
  const rootClasses = [
    styles.carousel,
    styles[layout],
    peekEdge && styles.hasPeek,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClasses}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {/* Scroll track */}
      <div
        ref={trackRef}
        className={styles.track}
        role="list"
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>

      {/* Navigation arrows */}
      {showArrows && itemCount > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={scrollPrev}
            disabled={!loop && !canScrollPrev}
            aria-label="Previous slide"
            tabIndex={-1}
          >
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <button
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={scrollNext}
            disabled={!loop && !canScrollNext}
            aria-label="Next slide"
            tabIndex={-1}
          >
            <svg className={styles.navIcon} viewBox="0 0 24 24">
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showIndicators && itemCount > 1 && (
        <div className={styles.indicators} role="tablist" aria-label="Carousel navigation">
          {Array.from({ length: itemCount }, (_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              tabIndex={i === activeIndex ? 0 : -1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Item ────────────────────────────────────────────────────────── */
/**
 * CarouselComponent.Item — individual carousel item container.
 *
 * M3 spec: rounded-corner container (28px shape-large) with
 * optional content masking and state layer for interaction.
 *
 * @param {number|string}  [width]      — fixed width (px or CSS value)
 * @param {number|string}  [height]     — fixed height
 * @param {string}         [aspectRatio] — CSS aspect-ratio (e.g. "16/9")
 * @param {"large"|"small"} [size]      — hero layout item sizing
 * @param {Function}       [onClick]
 * @param {string}         [className]
 * @param {React.ReactNode} children
 */
function CarouselItem({
  width,
  height,
  aspectRatio,
  size,
  onClick,
  className,
  children,
  ...rest
}) {
  const itemStyle = {};
  if (width) itemStyle.width = typeof width === "number" ? `${width}px` : width;
  if (height) itemStyle.height = typeof height === "number" ? `${height}px` : height;
  if (aspectRatio) itemStyle.aspectRatio = aspectRatio;

  const classes = [
    styles.item,
    size === "large" && styles.itemLarge,
    size === "small" && styles.itemSmall,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={Object.keys(itemStyle).length ? itemStyle : undefined}
      role="listitem"
      tabIndex={0}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Item Media ─────────────────────────────────────────────────── */
/**
 * CarouselComponent.ItemMedia — full-bleed image/video slot.
 *
 * @param {string}  src   — image source URL
 * @param {string}  [alt] — alt text
 * @param {string}  [className]
 */
function CarouselItemMedia({ src, alt = "", className, children }) {
  if (children) {
    return <div className={`${styles.itemMedia} ${className || ""}`}>{children}</div>;
  }

  return (
    <img
      className={`${styles.itemMedia}${className ? ` ${className}` : ""}`}
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
    />
  );
}

/* ── Item Label ─────────────────────────────────────────────────── */
/**
 * CarouselComponent.ItemLabel — overlaid label with gradient scrim.
 *
 * M3 spec: optional label text with supporting text, positioned
 * at the bottom of the carousel item over a gradient scrim.
 *
 * @param {string}  title      — primary label text
 * @param {string}  [subtitle] — supporting text
 * @param {string}  [className]
 */
function CarouselItemLabel({ title, subtitle, className, children }) {
  return (
    <div className={`${styles.itemLabel}${className ? ` ${className}` : ""}`}>
      {title && <span className={styles.itemLabelTitle}>{title}</span>}
      {subtitle && <span className={styles.itemLabelSubtitle}>{subtitle}</span>}
      {children}
    </div>
  );
}

/* ── Attach sub-components ──────────────────────────────────────── */

CarouselComponent.Item = CarouselItem;
CarouselComponent.ItemMedia = CarouselItemMedia;
CarouselComponent.ItemLabel = CarouselItemLabel;
