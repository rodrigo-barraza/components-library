// @ts-nocheck
"use client";

import { type ReactNode, useState } from "react";
import { MESSAGE_ROLES, type ChatMessage } from "../../constants/chat.ts";
import styles from "./ChatMessageComponent.module.css";

// ── URL detection ────────────────────────────────────────────
const URL_RE = /(https?:\/\/[^\s<>]+)/g;

function renderContent(content: string, role: string): ReactNode {
  if (!content) return null;
  if (role === MESSAGE_ROLES.AGENT || role === MESSAGE_ROLES.OPERATOR) {
    return renderMarkdownLite(content);
  }
  return renderWithLinks(content);
}

function renderMarkdownLite(text: string): ReactNode {
  const urlParts = text.split(URL_RE);
  return (
    <span>
      {urlParts.map((part, i) => {
        if (URL_RE.test(part)) {
          URL_RE.lastIndex = 0;
          const display = part.length > 45 ? part.substring(0, 42) + "..." : part;
          return (<a key={i} href={part} target="_blank" rel="noopener noreferrer" className={styles.link}>{display}</a>);
        }
        return <span key={i}>{applyInlineMarkdown(part)}</span>;
      })}
    </span>
  );
}

function applyInlineMarkdown(text: string): ReactNode[] {
  const codeRe = /`([^`]+)`/g;
  const parts = text.split(codeRe);
  return parts.map((seg, i) => {
    if (i % 2 === 1) {
      return (<code key={i} className={styles.inlineCode}>{seg}</code>);
    }
    return applyBoldItalic(seg, i);
  });
}

function applyBoldItalic(text: string, parentKey: number): ReactNode[] {
  const boldRe = /\*\*(.+?)\*\*/g;
  const boldParts = text.split(boldRe);
  return boldParts.map((seg, i) => {
    if (i % 2 === 1) {
      return (<strong key={`${parentKey}-b-${i}`} className={styles.bold}>{seg}</strong>);
    }
    const italicRe = /\*(.+?)\*/g;
    const italicParts = seg.split(italicRe);
    return italicParts.map((s, j) => {
      if (j % 2 === 1) {
        return (<em key={`${parentKey}-i-${i}-${j}`} className={styles.italic}>{s}</em>);
      }
      return s;
    });
  });
}

function renderWithLinks(text: string): ReactNode {
  const parts = text.split(URL_RE);
  return (
    <span>
      {parts.map((part, i) => {
        if (URL_RE.test(part)) {
          URL_RE.lastIndex = 0;
          const display = part.length > 45 ? part.substring(0, 42) + "..." : part;
          return (<a key={i} href={part} target="_blank" rel="noopener noreferrer" className={styles.link}>{display}</a>);
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function formatTime(isoString: string | undefined): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export interface ChatMessageComponentProps {
  /** The message object to render */
  message: ChatMessage;
  /** Whether this is the first message in the list */
  isFirst?: boolean;
  /** Role of the previous message for grouping */
  previousRole?: string | null;
}

/**
 * ChatMessageComponent — Individual message bubble.
 */
export default function ChatMessageComponent({
  message,
  isFirst = false,
  previousRole = null,
}: ChatMessageComponentProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const { role, content, createdAt, streaming, error } = message;
  const isGrouped = !isFirst && previousRole === role;

  if (role === MESSAGE_ROLES.SYSTEM) {
    return (
      <div className={`${styles.messageRow} ${styles.system} ${error ? styles.errorMessage : ""}`}>
        <div className={styles.systemBubble}>
          <p className={styles.messageText}>{content}</p>
        </div>
      </div>
    );
  }

  if (role === MESSAGE_ROLES.VISITOR) {
    return (
      <div
        className={`${styles.messageRow} ${styles.visitor} ${isGrouped ? styles.grouped : ""}`}
        onMouseEnter={() => setShowTimestamp(true)}
        onMouseLeave={() => setShowTimestamp(false)}
      >
        <div className={styles.visitorBubble}>
          <p className={styles.messageText}>{renderContent(content, role)}</p>
        </div>
        <span className={`${styles.timestamp} ${showTimestamp ? styles.timestampVisible : ""}`}>
          {formatTime(createdAt)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.messageRow} ${styles.agent} ${isGrouped ? styles.grouped : ""} ${error ? styles.errorMessage : ""}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      <div className={styles.agentBubble}>
        <p className={styles.messageText}>
          {renderContent(content, role)}
          {streaming && <span className={styles.cursor} />}
        </p>
      </div>
      <span className={`${styles.timestamp} ${showTimestamp ? styles.timestampVisible : ""}`}>
        {formatTime(createdAt)}
      </span>
    </div>
  );
}
