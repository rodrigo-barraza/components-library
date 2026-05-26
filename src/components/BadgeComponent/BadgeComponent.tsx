"use client";

import React, { ElementType, ComponentPropsWithoutRef, ReactNode, useMemo, useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { DateTime } from "luxon";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import StatusDotComponent from "../StatusDotComponent/StatusDotComponent.js";
import useTweenValue from "../../hooks/useTweenValue.js";
import styles from "./BadgeComponent.module.css";

const SECONDS_PER_DAY = 86_400;

interface ComputeLabelResult {
  label: string;
  intervalMs: number;
  isJustNow: boolean;
}

/**
 * Computes the short relative/absolute label and optimal refresh interval
 * for the date time badge adaptive tick rate.
 */
function computeLabel(dateTimeInstance: DateTime | null, showRelative: boolean): ComputeLabelResult {
  if (!dateTimeInstance || !dateTimeInstance.isValid) {
    return { label: "", intervalMs: 0, isJustNow: false };
  }

  const now = DateTime.now();
  const diff = now.diff(dateTimeInstance, ["days", "hours", "minutes", "seconds"]);
  const totalSeconds = diff.as("seconds");

  if (showRelative && totalSeconds > -10 && totalSeconds < SECONDS_PER_DAY) {
    if (totalSeconds < 5) {
      return { label: "just now", intervalMs: 1_000, isJustNow: true };
    }
    if (totalSeconds < 60) {
      return {
        label: `${Math.floor(totalSeconds)}s ago`,
        intervalMs: 1_000,
        isJustNow: false,
      };
    }
    const minutes = Math.floor(totalSeconds / 60);
    if (minutes < 60) {
      return { label: `${minutes}m ago`, intervalMs: 60_000, isJustNow: false };
    }
    const hours = Math.floor(minutes / 60);
    return { label: `${hours}h ago`, intervalMs: 3_600_000, isJustNow: false };
  }

  if (showRelative && totalSeconds >= 0) {
    const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
    if (days === 1) {
      return { label: "yesterday", intervalMs: 3_600_000, isJustNow: false };
    }
    if (days < 7) {
      return { label: `${days}d ago`, intervalMs: 3_600_000, isJustNow: false };
    }
  }

  if (dateTimeInstance.year === now.year) {
    return { label: dateTimeInstance.toFormat("MMM d, h:mm a"), intervalMs: 0, isJustNow: false };
  }
  return { label: dateTimeInstance.toFormat("MMM d, yyyy"), intervalMs: 0, isJustNow: false };
}

interface Tier {
  max: number;
  label: string;
  variant: "success" | "info" | "warning" | "error" | string;
}

const TIERS: Tier[] = [
  { max: 25, label: "Excellent", variant: "success" },
  { max: 50, label: "Good", variant: "info" },
  { max: 100, label: "Fair", variant: "warning" },
  { max: Infinity, label: "Slow", variant: "error" },
];

function getTier(milliseconds: number): Tier {
  return TIERS.find((currentTier) => milliseconds <= currentTier.max) || TIERS[TIERS.length - 1];
}

export type BadgeProps =
  | {
      type?: undefined;
      variant?: string;
      children?: React.ReactNode;
      className?: string;
      mini?: boolean;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "address";
      address: string;
      link?: boolean;
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "status";
      healthy?: boolean;
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "port";
      port: string | number;
      variant?: string;
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "repository";
      repo: string;
      icons?: {
        Github?: ElementType;
      };
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "device";
      device: string;
      icons?: {
        Server?: ElementType;
      };
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "count";
      count: number | string | null;
      state?: string;
      disabled?: boolean;
      rainbow?: boolean;
      tooltip?: string;
      className?: string;
    }
  | {
      type: "responseTime";
      ms?: number | null;
      formatter?: (ms: number) => string | ReactNode;
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "metric";
      value: number;
      label?: string;
      icon?: ReactNode;
      tooltip?: string;
      formatFn?: (value: number) => string | number;
      color?: string;
      tween?: boolean;
      tweenDuration?: number;
      round?: boolean;
      mini?: boolean;
      hideWhenZero?: boolean;
      className?: string;
    }
  | {
      type: "domain";
      domain: string;
      icons?: {
        Globe?: ElementType;
      };
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "visibility";
      visibility: "external" | "internal" | string;
      icons?: {
        Globe?: ElementType;
        Lock?: ElementType;
      };
      className?: string;
      tooltip?: React.ReactNode;
      [key: string]: any;
    }
  | {
      type: "dateTime";
      date?: string | Date | number | null;
      showIcon?: boolean;
      relative?: boolean;
      highlightNew?: boolean;
      className?: string;
    };

export default function BadgeComponent(props: BadgeProps) {
  if (props.type === undefined) {
    const { variant = "info", children, className = "", mini = false, tooltip, ...rest } = props;
    const badgeElement = (
      <span
        className={`${styles.badge} ${styles[variant] || ""} ${mini ? styles.mini : ""} ${className}`}
        {...rest}
      >
        {children}
      </span>
    );

    if (tooltip) {
      return (
        <TooltipComponent label={tooltip} position="top">
          {badgeElement}
        </TooltipComponent>
      );
    }

    return badgeElement;
  }

  switch (props.type) {
    case "address": {
      const { address, link = false, className = "", tooltip, ...rest } = props;
      if (!address) return null;

      const displayAddress = address.replace(/^https?:\/\//, "");

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles.info} ${styles.monoFont} ${styles.addressBadge} ${className}`}
          {...rest}
        >
          {displayAddress}
        </span>
      );

      const tooltipContent = tooltip || `Internal address: ${displayAddress}`;

      const wrappedElement = (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );

      if (link) {
        const hrefValue = address.startsWith("http") ? address : `http://${address}`;
        return (
          <a
            href={hrefValue}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badgeLink}
          >
            {wrappedElement}
          </a>
        );
      }

      return wrappedElement;
    }

    case "status": {
      const { healthy, className = "", tooltip, ...rest } = props;
      const variantValue = healthy ? "success" : "error";

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles[variantValue]} ${styles.statusBadge} ${className}`}
          {...rest}
        >
          <StatusDotComponent
            variant={healthy ? "healthy" : "unhealthy"}
            size="sm"
            pulse={!!healthy}
          />
          <span className={styles.statusIcon} aria-label={healthy ? "Healthy" : "Down"}>
            {healthy ? "✓" : "✗"}
          </span>
        </span>
      );

      const tooltipContent = tooltip || (healthy ? "Healthy" : "Down");

      return (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );
    }

    case "port": {
      const { port, variant = "accent", className = "", tooltip, ...rest } = props;
      if (!port) return null;

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles[variant] || ""} ${styles.monoFont} ${styles.portBadge} ${className}`}
          {...rest}
        >
          :{port}
        </span>
      );

      const tooltipContent = tooltip || `Listening on port ${port}`;

      return (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );
    }

    case "repository": {
      const { repo, icons, className = "", tooltip, ...rest } = props;
      if (!repo) return null;

      const { Github } = icons || {};

      let repositorySlug = repo;
      let targetHref = repo;

      const sshMatchResult = repo.match(/^git@github\.com:(.+?)(?:\.git)?$/);
      if (sshMatchResult) {
        repositorySlug = sshMatchResult[1];
        targetHref = `https://github.com/${repositorySlug}`;
      } else {
        repositorySlug = repo.replace("https://github.com/", "");
      }

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles.info} ${styles.monoFont} ${styles.repositoryBadge} ${className}`}
          {...rest}
        >
          {Github && <Github size={9} strokeWidth={2.2} />}
          {repositorySlug}
        </span>
      );

      const tooltipContent = tooltip || `GitHub: ${repositorySlug}`;

      const wrappedElement = (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );

      return (
        <a
          href={targetHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.badgeLink}
        >
          {wrappedElement}
        </a>
      );
    }

    case "device": {
      const { device, icons, className = "", tooltip, ...rest } = props;
      if (!device) return null;

      const { Server } = icons || {};

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles.info} ${styles.deviceBadge} ${className}`}
          {...rest}
        >
          {Server && <Server size={9} strokeWidth={2.2} />}
          {device}
        </span>
      );

      const tooltipContent = tooltip || `Host device: ${device}`;

      return (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );
    }

    case "count": {
      const { count, state = "default", disabled = false, rainbow = false, tooltip, className = "" } = props;
      if (count == null) return null;

      const isCountDisabled = disabled || count === 0;

      const stateClassName = rainbow
        ? styles.rainbow
        : isCountDisabled
          ? styles.stateDisabled
          : state === "new"
            ? styles.stateNew
            : styles.stateDefault;

      const badgeElement = (
        <span
          className={`${styles.countBadge} ${stateClassName} ${className}`}
        >
          {count}
        </span>
      );

      if (tooltip) {
        return (
          <TooltipComponent label={tooltip} position="top">
            {badgeElement}
          </TooltipComponent>
        );
      }

      return badgeElement;
    }

    case "responseTime": {
      const { ms, formatter, className = "", tooltip, ...rest } = props;
      if (ms == null) return null;

      const responseTier = getTier(ms);
      const displayContent = formatter ? formatter(ms) : `${ms}ms`;

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles[responseTier.variant]} ${styles.monoFont} ${styles.responseTimeBadge} ${className}`}
          {...rest}
        >
          <span className={styles.responseTimeDot} data-tier={responseTier.variant} />
          {displayContent}
        </span>
      );

      const tooltipContent = tooltip || `${responseTier.label} — ${ms}ms`;

      return (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );
    }

    case "metric": {
      const {
        value,
        label,
        icon,
        tooltip,
        formatFn,
        color,
        tween = false,
        tweenDuration = 600,
        round = true,
        mini = false,
        hideWhenZero = true,
        className = "",
      } = props;

      const [displayValue, isTweening] = useTweenValue(value, {
        duration: tweenDuration,
        round,
        enabled: tween,
      });

      if (hideWhenZero && (!value || value <= 0)) return null;

      const formattedDisplayValue = formatFn
        ? formatFn(displayValue)
        : round
          ? Math.round(displayValue).toLocaleString()
          : displayValue.toLocaleString();

      const tooltipText = tooltip || `${Math.round(value).toLocaleString()}${label ? ` ${label}` : ""}`;

      const colorClass = color && styles[color] ? styles[color] : "";
      const customColorStyle = color && !styles[color]
        ? ({ "--metric-color": color } as React.CSSProperties)
        : undefined;

      return (
        <TooltipComponent label={tooltipText} position="top">
          <span
            className={[
              styles.metricBadge,
              colorClass,
              !colorClass && color ? styles.customMetric : "",
              mini ? styles.miniMetric : "",
              isTweening ? styles.isTweeningMetric : "",
              className,
            ].filter(Boolean).join(" ")}
            style={customColorStyle}
          >
            {icon && <span className={styles.metricIcon}>{icon}</span>}
            <span>{formattedDisplayValue}</span>
            {label && <span>{label}</span>}
          </span>
        </TooltipComponent>
      );
    }

    case "domain": {
      const { domain, icons, className = "", tooltip, ...rest } = props;
      if (!domain) return null;

      const { Globe } = icons || {};

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles.accent} ${styles.monoFont} ${styles.domainBadge} ${className}`}
          {...rest}
        >
          {Globe && <Globe size={9} strokeWidth={2.2} />}
          {domain}
        </span>
      );

      const tooltipContent = tooltip || `https://${domain}`;

      const wrappedElement = (
        <TooltipComponent label={tooltipContent} position="top">
          {badgeElement}
        </TooltipComponent>
      );

      return (
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.badgeLink}
        >
          {wrappedElement}
        </a>
      );
    }

    case "visibility": {
      const { visibility, icons, className = "", tooltip, ...rest } = props;
      if (!visibility) return null;

      const isExternalState = visibility === "external";
      const { Globe, Lock } = icons || {};
      const SelectedIcon = isExternalState ? Globe : Lock;
      const variantValue = isExternalState ? "accent" : "info";

      const badgeElement = (
        <span
          className={`${styles.badge} ${styles[variantValue]} ${className}`}
          {...rest}
        >
          {SelectedIcon && <SelectedIcon size={9} strokeWidth={2.2} />}
          {isExternalState ? "External" : "Internal"}
        </span>
      );

      if (tooltip) {
        return (
          <TooltipComponent label={tooltip} position="top">
            {badgeElement}
          </TooltipComponent>
        );
      }

      return badgeElement;
    }

    case "dateTime": {
      const { date, showIcon = true, relative = true, highlightNew = false, className = "" } = props;

      const dateTimeInstance = useMemo(() => {
        if (!date) return null;
        if (date instanceof Date) return DateTime.fromJSDate(date);
        if (typeof date === "number") return DateTime.fromMillis(date);
        return DateTime.fromISO(date);
      }, [date]);

      const fullFormattedDateTime = useMemo(() => {
        if (!dateTimeInstance || !dateTimeInstance.isValid) return "";
        return dateTimeInstance.toFormat("EEEE, MMMM d, yyyy 'at' h:mm:ss a");
      }, [dateTimeInstance]);

      const [tickValue, setTickValue] = useState(0);

      const { label: shortLabel, intervalMs, isJustNow } = useMemo(
        () => computeLabel(dateTimeInstance, relative),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dateTimeInstance, relative, tickValue],
      );

      const previousJustNowRef = useRef(isJustNow);
      const [isFading, setIsFading] = useState(false);

      useEffect(() => {
        if (previousJustNowRef.current && !isJustNow && highlightNew) {
          setIsFading(true);
          const timerInstance = setTimeout(() => setIsFading(false), 1000);
          return () => clearTimeout(timerInstance);
        }
        previousJustNowRef.current = isJustNow;
      }, [isJustNow, highlightNew]);

      useEffect(() => {
        previousJustNowRef.current = isJustNow;
      }, [isJustNow]);

      useEffect(() => {
        if (!dateTimeInstance || !dateTimeInstance.isValid || !intervalMs) return;

        let timerIdInstance: ReturnType<typeof setTimeout> | undefined;

        const scheduleTick = () => {
          const { intervalMs: nextIntervalMs } = computeLabel(dateTimeInstance, relative);
          if (!nextIntervalMs) return;
          timerIdInstance = setTimeout(() => {
            setTickValue((currentTick) => currentTick + 1);
            scheduleTick();
          }, nextIntervalMs);
        };

        scheduleTick();

        return () => clearTimeout(timerIdInstance);
      }, [dateTimeInstance, relative, intervalMs]);

      if (!dateTimeInstance || !dateTimeInstance.isValid) return null;

      const highlightClassName = highlightNew && isJustNow
        ? styles.justNow
        : isFading
          ? styles.justNowFadeOut
          : "";

      return (
        <TooltipComponent label={fullFormattedDateTime} position="top">
          <span
            className={`${styles.dateTimeBadge} ${highlightClassName} ${className}`}
          >
            {showIcon && <Calendar size={10} className={styles.dateTimeIcon} />}
            {shortLabel}
          </span>
        </TooltipComponent>
      );
    }

    default:
      return null;
  }
}
