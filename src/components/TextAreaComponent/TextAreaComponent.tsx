"use client";

import { useRef, useEffect, useCallback } from "react";
import styles from "./TextAreaComponent.module.css";

/**
 * TextAreaComponent — Reusable auto-resizing textarea with consistent styling.
 */
export interface TextAreaComponentProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
}

export default function TextAreaComponent({
  value,
  onChange,
  placeholder,
  minRows = 3,
  maxRows = 12,
  autoResize = true,
  disabled = false,
  readOnly = false,
  className,
  id,
  ...rest
}: TextAreaComponentProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const element = textAreaRef.current;
    if (!element || !autoResize) return;

    element.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
    const minHeight = lineHeight * minRows + 20;
    const maxHeight = lineHeight * maxRows + 20;
    const scrollH = element.scrollHeight;

    element.style.height = `${Math.min(Math.max(scrollH, minHeight), maxHeight)}px`;
  }, [autoResize, minRows, maxRows]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    resize();
  }, [resize]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
  };

  const classes = [styles['textarea'], className || ""].filter(Boolean).join(" ");

  return (
    <textarea
      ref={textAreaRef}
      id={id}
      className={classes}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={minRows}
      {...rest}
    />
  );
}
