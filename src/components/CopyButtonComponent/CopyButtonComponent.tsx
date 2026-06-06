import { useState, useCallback, MouseEvent } from "react";
import { Copy, Check } from "lucide-react";
// Inlined from utilities-library/time — node_modules copy is stale until deploy-kit sync
const FEEDBACK_STANDARD_MS = 2_000;
import styles from "./CopyButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

export interface CopyButtonComponentProps {
  text: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
  tooltip?: string;
}

/**
 * CopyButtonComponent — Copy-to-clipboard button with a "copied" confirmation state.
 */
export default function CopyButtonComponent({
  text,
  size = 14,
  showLabel = false,
  className = "",
  tooltip = "Copy",
}: CopyButtonComponentProps) {
  const { sound } = useComponents();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        if (sound) SoundService.playClickButton({ event });
        setCopied(true);
        setTimeout(() => setCopied(false), FEEDBACK_STANDARD_MS);
      } catch {
        /* clipboard not available — silent fail */
      }
    },
    [text, sound],
  );

  return (
    <button
      type="button"
      className={`${styles['copy-button']} ${copied ? styles.copied : ""} ${className}`}
      onClick={handleCopy}
      onMouseEnter={(event) => {
        if (sound) SoundService.playHoverButton({ event });
      }}
      title={copied ? "Copied!" : tooltip}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {showLabel && (copied ? "Copied" : "Copy")}
    </button>
  );
}
