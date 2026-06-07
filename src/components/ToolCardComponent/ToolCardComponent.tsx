"use client";

import styles from "./ToolCardComponent.module.css";

/**
 * ToolCardComponent — Reusable card for displaying a tool schema.
 *
 * Renders an emoji + tool name header, domain badge, truncated description,
 * and an optional footer slot for badges (agents, labels, param counts).
 */

export interface ToolCardComponentProps {
  name: string;
  description: string;
  emoji?: string | null;
  domain?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function ToolCardComponent({
  name,
  description,
  emoji,
  domain,
  onClick,
  children,
  className,
}: ToolCardComponentProps) {
  const classes = [
    "tool-card-component",styles['tool-card'], className].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div className={styles['header']}>
        {emoji && (
          emoji.startsWith("http") ? (
            <img src={emoji} alt={name} className={styles['emoji-image']} />
          ) : (
            <span className={styles['emoji']}>{emoji}</span>
          )
        )}
        <div className={styles['title-block']}>
          <span className={styles['name']}>{name}</span>
          {domain && <span className={styles['domain']}>{domain}</span>}
        </div>
      </div>
      <div className={styles['description']}>{description}</div>
      {children && <div className={styles['footer']}>{children}</div>}
    </div>
  );
}
