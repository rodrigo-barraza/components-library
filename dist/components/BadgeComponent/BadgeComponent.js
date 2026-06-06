"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { DateTime } from "luxon";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import StatusDotComponent from "../StatusDotComponent/StatusDotComponent.js";
import useTweenValue from "../../hooks/useTweenValue.js";
import styles from "./BadgeComponent.module.css";
const SECONDS_PER_DAY = 86_400;
/**
 * Computes the short relative/absolute label and optimal refresh interval
 * for the date time badge adaptive tick rate.
 */
function computeLabel(dateTimeInstance, showRelative) {
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
const TIERS = [
    { max: 25, label: "Excellent", variant: "success" },
    { max: 50, label: "Good", variant: "info" },
    { max: 100, label: "Fair", variant: "warning" },
    { max: Infinity, label: "Slow", variant: "error" },
];
function getTier(milliseconds) {
    return TIERS.find((currentTier) => milliseconds <= currentTier.max) || TIERS[TIERS.length - 1];
}
function MetricBadge({ value, label, icon, tooltip, formatFn, color, tween = false, tweenDuration = 600, round = true, mini = false, hideWhenZero = true, className = "", }) {
    const [displayValue, isTweening] = useTweenValue(value, {
        duration: tweenDuration,
        round,
        enabled: tween,
    });
    if (hideWhenZero && (!value || value <= 0))
        return null;
    const formattedDisplayValue = formatFn
        ? formatFn(displayValue)
        : round
            ? Math.round(displayValue).toLocaleString()
            : displayValue.toLocaleString();
    const tooltipText = tooltip || `${Math.round(value).toLocaleString()}${label ? ` ${label}` : ""}`;
    const colorClass = color && styles[color] ? styles[color] : "";
    const customColorStyle = color && !styles[color]
        ? { "--metric-color": color }
        : undefined;
    return (_jsx(TooltipComponent, { label: tooltipText, position: "top", children: _jsxs("span", { className: [
                styles['metric-badge'],
                colorClass,
                !colorClass && color ? styles['custom-metric'] : "",
                mini ? styles['mini-metric'] : "",
                isTweening ? styles['is-tweening-metric'] : "",
                className,
            ].filter(Boolean).join(" "), style: customColorStyle, children: [icon && _jsx("span", { className: styles['metric-icon'], children: icon }), _jsx("span", { children: formattedDisplayValue }), label && _jsx("span", { children: label })] }) }));
}
function DateTimeBadge({ date, showIcon = true, relative = true, highlightNew = false, className = "", }) {
    const dateTimeInstance = useMemo(() => {
        if (!date)
            return null;
        if (date instanceof Date)
            return DateTime.fromJSDate(date);
        if (typeof date === "number")
            return DateTime.fromMillis(date);
        return DateTime.fromISO(date);
    }, [date]);
    const fullFormattedDateTime = useMemo(() => {
        if (!dateTimeInstance || !dateTimeInstance.isValid)
            return "";
        return dateTimeInstance.toFormat("EEEE, MMMM d, yyyy 'at' h:mm:ss a");
    }, [dateTimeInstance]);
    const [tickValue, setTickValue] = useState(0);
    const { label: shortLabel, intervalMs, isJustNow } = useMemo(() => computeLabel(dateTimeInstance, relative), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateTimeInstance, relative, tickValue]);
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
        if (!dateTimeInstance || !dateTimeInstance.isValid || !intervalMs)
            return;
        let timerIdInstance;
        const scheduleTick = () => {
            const { intervalMs: nextIntervalMs } = computeLabel(dateTimeInstance, relative);
            if (!nextIntervalMs)
                return;
            timerIdInstance = setTimeout(() => {
                setTickValue((currentTick) => currentTick + 1);
                scheduleTick();
            }, nextIntervalMs);
        };
        scheduleTick();
        return () => clearTimeout(timerIdInstance);
    }, [dateTimeInstance, relative, intervalMs]);
    if (!dateTimeInstance || !dateTimeInstance.isValid)
        return null;
    const highlightClassName = highlightNew && isJustNow
        ? styles['just-now']
        : isFading
            ? styles['just-now-fade-out']
            : "";
    return (_jsx(TooltipComponent, { label: fullFormattedDateTime, position: "top", children: _jsxs("span", { className: `${styles['date-time-badge']} ${highlightClassName} ${className}`, children: [showIcon && _jsx(Calendar, { size: 10, className: styles['date-time-icon'] }), shortLabel] }) }));
}
export default function BadgeComponent(props) {
    if (props.type === undefined) {
        const { variant = "info", children, className = "", mini = false, tooltip, ...rest } = props;
        const badgeElement = (_jsx("span", { className: `${styles.badge} ${styles[variant] || ""} ${mini ? styles.mini : ""} ${className}`, ...rest, children: children }));
        if (tooltip) {
            return (_jsx(TooltipComponent, { label: tooltip, position: "top", children: badgeElement }));
        }
        return badgeElement;
    }
    switch (props.type) {
        case "address": {
            const { address, link = false, className = "", tooltip, ...rest } = props;
            if (!address)
                return null;
            const displayAddress = address.replace(/^https?:\/\//, "");
            const badgeElement = (_jsx("span", { className: `${styles.badge} ${styles.info} ${styles['mono-font']} ${styles['address-badge']} ${className}`, ...rest, children: displayAddress }));
            const tooltipContent = tooltip || `Internal address: ${displayAddress}`;
            const wrappedElement = (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
            if (link) {
                const hrefValue = address.startsWith("http") ? address : `http://${address}`;
                return (_jsx("a", { href: hrefValue, target: "_blank", rel: "noopener noreferrer", className: styles['badge-link'], children: wrappedElement }));
            }
            return wrappedElement;
        }
        case "status": {
            const { healthy, className = "", tooltip, ...rest } = props;
            const variantValue = healthy ? "success" : "error";
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles[variantValue]} ${styles['status-badge']} ${className}`, ...rest, children: [_jsx(StatusDotComponent, { variant: healthy ? "healthy" : "unhealthy", size: "sm", pulse: !!healthy }), _jsx("span", { className: styles['status-icon'], "aria-label": healthy ? "Healthy" : "Down", children: healthy ? "✓" : "✗" })] }));
            const tooltipContent = tooltip || (healthy ? "Healthy" : "Down");
            return (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
        }
        case "port": {
            const { port, variant = "accent", className = "", tooltip, ...rest } = props;
            if (!port)
                return null;
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles[variant] || ""} ${styles['mono-font']} ${styles['port-badge']} ${className}`, ...rest, children: [":", port] }));
            const tooltipContent = tooltip || `Listening on port ${port}`;
            return (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
        }
        case "repository": {
            const { repo, icons, className = "", tooltip, ...rest } = props;
            if (!repo)
                return null;
            const { Github } = icons || {};
            let repositorySlug = repo;
            let targetHref = repo;
            const sshMatchResult = repo.match(/^git@github\.com:(.+?)(?:\.git)?$/);
            if (sshMatchResult) {
                repositorySlug = sshMatchResult[1];
                targetHref = `https://github.com/${repositorySlug}`;
            }
            else {
                repositorySlug = repo.replace("https://github.com/", "");
            }
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles.info} ${styles['mono-font']} ${styles['repository-badge']} ${className}`, ...rest, children: [Github && _jsx(Github, { size: 9, strokeWidth: 2.2 }), repositorySlug] }));
            const tooltipContent = tooltip || `GitHub: ${repositorySlug}`;
            const wrappedElement = (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
            return (_jsx("a", { href: targetHref, target: "_blank", rel: "noopener noreferrer", className: styles['badge-link'], children: wrappedElement }));
        }
        case "device": {
            const { device, icons, className = "", tooltip, ...rest } = props;
            if (!device)
                return null;
            const { Server } = icons || {};
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles.info} ${styles['device-badge']} ${className}`, ...rest, children: [Server && _jsx(Server, { size: 9, strokeWidth: 2.2 }), device] }));
            const tooltipContent = tooltip || `Host device: ${device}`;
            return (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
        }
        case "count": {
            const { count, state = "default", disabled = false, rainbow = false, tooltip, className = "" } = props;
            if (count == null)
                return null;
            const isCountDisabled = disabled || count === 0;
            const stateClassName = rainbow
                ? styles.rainbow
                : isCountDisabled
                    ? styles['state-disabled']
                    : state === "new"
                        ? styles['state-new']
                        : styles['state-default'];
            const badgeElement = (_jsx("span", { className: `${styles['count-badge']} ${stateClassName} ${className}`, children: count }));
            if (tooltip) {
                return (_jsx(TooltipComponent, { label: tooltip, position: "top", children: badgeElement }));
            }
            return badgeElement;
        }
        case "responseTime": {
            const { ms, formatter, className = "", tooltip, ...rest } = props;
            if (ms == null)
                return null;
            const responseTier = getTier(ms);
            const displayContent = formatter ? formatter(ms) : `${ms}ms`;
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles[responseTier.variant]} ${styles['mono-font']} ${styles['response-time-badge']} ${className}`, ...rest, children: [_jsx("span", { className: styles['response-time-dot'], "data-tier": responseTier.variant }), displayContent] }));
            const tooltipContent = tooltip || `${responseTier.label} — ${ms}ms`;
            return (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
        }
        case "metric": {
            return _jsx(MetricBadge, { ...props });
        }
        case "domain": {
            const { domain, icons, className = "", tooltip, ...rest } = props;
            if (!domain)
                return null;
            const { Globe } = icons || {};
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles.accent} ${styles['mono-font']} ${styles['domain-badge']} ${className}`, ...rest, children: [Globe && _jsx(Globe, { size: 9, strokeWidth: 2.2 }), domain] }));
            const tooltipContent = tooltip || `https://${domain}`;
            const wrappedElement = (_jsx(TooltipComponent, { label: tooltipContent, position: "top", children: badgeElement }));
            return (_jsx("a", { href: `https://${domain}`, target: "_blank", rel: "noopener noreferrer", className: styles['badge-link'], children: wrappedElement }));
        }
        case "visibility": {
            const { visibility, icons, className = "", tooltip, ...rest } = props;
            if (!visibility)
                return null;
            const isExternalState = visibility === "external";
            const { Globe, Lock } = icons || {};
            const SelectedIcon = isExternalState ? Globe : Lock;
            const variantValue = isExternalState ? "accent" : "info";
            const badgeElement = (_jsxs("span", { className: `${styles.badge} ${styles[variantValue]} ${className}`, ...rest, children: [SelectedIcon && _jsx(SelectedIcon, { size: 9, strokeWidth: 2.2 }), isExternalState ? "External" : "Internal"] }));
            if (tooltip) {
                return (_jsx(TooltipComponent, { label: tooltip, position: "top", children: badgeElement }));
            }
            return badgeElement;
        }
        case "dateTime": {
            return _jsx(DateTimeBadge, { ...props });
        }
        default:
            return null;
    }
}
//# sourceMappingURL=BadgeComponent.js.map