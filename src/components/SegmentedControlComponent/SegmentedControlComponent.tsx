"use client";

import { ReactNode, useCallback } from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./SegmentedControlComponent.module.css";

/**
 * SegmentedControlComponent — M3 Segmented Button
 *
 * A group of 2–5 mutually-exclusive toggle segments rendered inside a
 * pill-shaped container. Selecting a segment deselects the others,
 * similar to a radio group.
 *
 * M3 Spec Reference:
 *   https://m3.material.io/components/segmented-buttons/specs
 *
 *  value       : string           — currently selected segment value
 *  onChange    : (value) => void  — called when a segment is clicked
 *  segments    : Segment[]        — segment definitions (value, label, icon?, disabled?)
 *  fullWidth?  : boolean          — stretch to fill container width
 *  compact?    : boolean          — smaller 30px height variant
 *  showCheck?  : boolean          — show checkmark icon on selected segment
 *  className?  : string           — extra class on root
 */

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

  const handleSegmentClick = useCallback(
    (segmentValue: string, event: React.MouseEvent<HTMLButtonElement>) => {
      if (segmentValue === value) return;
      if (sound) SoundService.playClickButton({ event });
      onChange(segmentValue);
    },
    [value, onChange, sound],
  );

  const rootClasses = [
    styles["segmented-control"],
    fullWidth && styles["is-full-width-layout"],
    compact && styles["is-compact-size"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses} role="radiogroup" id={id}>
      {segments.map((segment) => {
        const isSelected = segment.value === value;

        return (
          <button
            key={segment.value}
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
