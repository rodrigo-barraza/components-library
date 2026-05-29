"use client";

import {
  ReactNode,
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./SegmentedControlComponent.module.css";

export interface SegmentDefinition {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlComponentProps {
  value: string;
  onChange: (value: string) => void;
  segments: SegmentDefinition[];
  fullWidth?: boolean;
  compact?: boolean;
  showCheck?: boolean;
  className?: string;
  id?: string;
}

interface IndicatorGeometry {
  offsetLeft: number;
  width: number;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function SegmentedControlComponent({
  value,
  onChange,
  segments,
  fullWidth = false,
  compact = false,
  showCheck = false,
  className = "",
  id,
}: SegmentedControlComponentProps) {
  const { sound } = useComponents();

  const containerReference = useRef<HTMLDivElement>(null);
  const segmentReferences = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorGeometry, setIndicatorGeometry] =
    useState<IndicatorGeometry | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const measureIndicator = useCallback(() => {
    const container = containerReference.current;
    if (!container) return;

    const activeButton = segmentReferences.current.get(value);
    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorGeometry({
      offsetLeft: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    });
  }, [value]);

  useIsomorphicLayoutEffect(() => {
    measureIndicator();

    const frameIdentifier = requestAnimationFrame(() => {
      setIsInitialRender(false);
    });

    return () => cancelAnimationFrame(frameIdentifier);
  }, [measureIndicator]);

  useIsomorphicLayoutEffect(() => {
    const container = containerReference.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      measureIndicator();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [measureIndicator]);

  const handleSegmentClick = useCallback(
    (segmentValue: string, event: React.MouseEvent<HTMLButtonElement>) => {
      if (segmentValue === value) return;
      if (sound) SoundService.playClickButton({ event });
      onChange(segmentValue);
    },
    [value, onChange, sound],
  );

  const setSegmentReference = useCallback(
    (segmentValue: string, node: HTMLButtonElement | null) => {
      if (node) {
        segmentReferences.current.set(segmentValue, node);
      } else {
        segmentReferences.current.delete(segmentValue);
      }
    },
    [],
  );

  const rootClasses = [
    styles["segmented-control-container"],
    fullWidth && styles["is-full-width-layout"],
    compact && styles["is-compact-size"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClasses}
      role="radiogroup"
      id={id}
      ref={containerReference}
    >
      {indicatorGeometry && (
        <span
          className={styles["sliding-indicator"]}
          style={{
            translate: `${indicatorGeometry.offsetLeft}px 0`,
            width: `${indicatorGeometry.width}px`,
            transitionDuration: isInitialRender ? "0ms" : undefined,
          }}
          aria-hidden="true"
        />
      )}

      {segments.map((segment) => {
        const isSelected = segment.value === value;

        return (
          <button
            key={segment.value}
            ref={(node) => setSegmentReference(segment.value, node)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={segment.disabled}
            className={`${styles["segment-button"]}${isSelected ? ` ${styles["is-selected-state"]}` : ""}`}
            onClick={(event) => handleSegmentClick(segment.value, event)}
            onMouseEnter={(event) => {
              if (sound) SoundService.playHoverButton({ event });
            }}
          >
            {showCheck && (
              <span className={styles["segment-check-icon"]} aria-hidden="true">
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
            {segment.icon && (
              <span className={styles["segment-icon"]} aria-hidden="true">
                {segment.icon}
              </span>
            )}
            {segment.label && <span>{segment.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
