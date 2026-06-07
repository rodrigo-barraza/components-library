"use client";

import { X } from "lucide-react";
import styles from "./CloseButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * CloseButtonComponent — An X-icon dismiss button for modals, drawers, and panels.
 */
interface CloseButtonProps {
  onClick: (e?: React.MouseEvent) => void;
  size?: number;
  variant?: string;
  className?: string;
}

export default function CloseButtonComponent({
  onClick,
  size = 18,
  variant = "default",
  className,
}: CloseButtonProps) {
  const { sound } = useComponents();

  const classes = ["close-button-component", styles['close-button'], variant === "dark" ? styles['dark'] : "", className || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={(event) => {
        if (sound) SoundService.playClickButton({ event });
        onClick?.(event);
      }}
      onMouseEnter={(event) => {
        if (sound) SoundService.playHoverButton({ event });
      }}
      title="Close"
    >
      <X size={size} />
    </button>
  );
}
