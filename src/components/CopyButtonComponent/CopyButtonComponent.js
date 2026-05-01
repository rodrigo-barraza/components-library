"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import styles from "./CopyButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * CopyButtonComponent — Copy-to-clipboard button with a "copied" confirmation state.
 *
 * @param {string}  text          — The text to copy to clipboard
 * @param {number}  [size=14]     — Icon size
 * @param {boolean} [showLabel]   — Show "Copy" / "Copied" text label
 * @param {string}  [className]   — Additional class name
 * @param {string}  [tooltip]     — Tooltip text (used with title attr)
 */
export default function CopyButtonComponent({
  text,
  size = 14,
  showLabel = false,
  className = "",
  tooltip = "Copy",
}) {
  const { sound } = useComponents();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        if (sound) SoundService.playClickButton({ event: e });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard not available — silent fail */
      }
    },
    [text, sound],
  );

  return (
    <button
      type="button"
      className={`${styles.copyButton} ${copied ? styles.copied : ""} ${className}`}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        if (sound) SoundService.playHoverButton({ event: e });
      }}
      title={copied ? "Copied!" : tooltip}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {showLabel && (copied ? "Copied" : "Copy")}
    </button>
  );
}
