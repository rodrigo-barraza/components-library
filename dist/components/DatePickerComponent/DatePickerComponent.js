"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { DATE_PRESETS, formatDate, parseDateValue as parseDate, formatDateDisplay, getActiveDatePreset } from "../../utils/datePresets.js";
import styles from "./DatePickerComponent.module.css";
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function isSameDay(dateA, dateB) {
    if (!dateA || !dateB)
        return false;
    return (dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate());
}
function isInRange(date, from, to) {
    if (!from || !to || !date)
        return false;
    return date >= from && date <= to;
}
function extractTime(dateTimeString) {
    if (!dateTimeString || !dateTimeString.includes("T"))
        return "";
    const parsedDate = new Date(dateTimeString);
    if (isNaN(parsedDate.getTime()))
        return "";
    return `${String(parsedDate.getHours()).padStart(2, "0")}:${String(parsedDate.getMinutes()).padStart(2, "0")}`;
}
function composeDatetime(dateStr, time) {
    if (!dateStr)
        return "";
    const dayPart = dateStr.slice(0, 10);
    if (!time)
        return dayPart;
    const [hh, mm] = time.split(":").map(Number);
    const composedDate = new Date(dayPart + "T00:00:00");
    composedDate.setHours(hh, mm, 0, 0);
    return composedDate.toISOString();
}
function MonthGrid({ year, month, from, to, hoverDate, onDayClick, onDayHover }) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDate = parseDate(from);
    const toDate = parseDate(to);
    const rangeStart = fromDate && !toDate && hoverDate
        ? hoverDate < fromDate ? hoverDate : fromDate
        : fromDate;
    const rangeEnd = fromDate && !toDate && hoverDate
        ? hoverDate < fromDate ? fromDate : hoverDate
        : toDate;
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
        cells.push(_jsx("div", { className: styles.dayCell }, `pad-${i}`));
    }
    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
        const date = new Date(year, month, dayNumber);
        const isToday = isSameDay(date, today);
        const isStart = isSameDay(date, rangeStart);
        const isEnd = isSameDay(date, rangeEnd);
        const inRange = isInRange(date, rangeStart, rangeEnd);
        const isFuture = date > today;
        const cls = [
            styles.dayBtn,
            isToday && styles.dayToday,
            isStart && styles.dayStart,
            isEnd && styles.dayEnd,
            inRange && !isStart && !isEnd && styles.dayInRange,
            isFuture && styles.dayFuture,
        ]
            .filter(Boolean)
            .join(" ");
        cells.push(_jsx("button", { type: "button", className: cls, onClick: () => onDayClick(date), onMouseEnter: () => onDayHover(date), disabled: isFuture, children: dayNumber }, dayNumber));
    }
    return (_jsxs("div", { className: styles.monthGrid, children: [_jsx("div", { className: styles.dayHeaders, children: DAYS.map((dayLabel) => (_jsx("span", { className: styles.dayHeader, children: dayLabel }, dayLabel))) }), _jsx("div", { className: styles.dayCells, children: cells })] }));
}
export default function DatePickerComponent({ from = "", to = "", onChange, placeholder = "All time", storageKey = "", disabled = false, defaultOpen = false, onClose, hideTrigger = false, presets = DATE_PRESETS, showTime = true, }) {
    const [open, setOpen] = useState(defaultOpen);
    const [viewDate, setViewDate] = useState(() => {
        const parsed = from ? parseDate(from) : new Date();
        const initialDate = parsed || new Date();
        return { year: initialDate.getFullYear(), month: initialDate.getMonth() };
    });
    const [selecting, setSelecting] = useState(null);
    const [hoverDate, setHoverDate] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownElRef = useRef(null);
    const initializedRef = useRef(false);
    const [timeEdits, setTimeEdits] = useState({ fromTime: extractTime(from), toTime: extractTime(to), key: `${from}|${to}` });
    if (`${from}|${to}` !== timeEdits.key) {
        setTimeEdits({ fromTime: extractTime(from), toTime: extractTime(to), key: `${from}|${to}` });
    }
    const { fromTime, toTime } = timeEdits;
    const setFromTime = (value) => setTimeEdits((previous) => ({ ...previous, fromTime: value }));
    const setToTime = (value) => setTimeEdits((previous) => ({ ...previous, toTime: value }));
    const updateDropdownPos = useCallback(() => {
        if (!triggerRef.current)
            return;
        const rect = triggerRef.current.getBoundingClientRect();
        let top = rect.bottom + 6;
        let left = rect.left;
        if (dropdownElRef.current) {
            const dropRect = dropdownElRef.current.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            if (left + dropRect.width > vw - 8)
                left = Math.max(8, vw - dropRect.width - 8);
            if (top + dropRect.height > vh - 8) {
                const above = rect.top - dropRect.height - 6;
                if (above >= 8)
                    top = above;
                else
                    top = Math.max(8, vh - dropRect.height - 8);
            }
        }
        setDropdownPos({ top, left });
    }, []);
    useEffect(() => {
        if (!open)
            return;
        const rafId = requestAnimationFrame(() => {
            updateDropdownPos();
            requestAnimationFrame(() => updateDropdownPos());
        });
        const handleScroll = () => updateDropdownPos();
        const handleResize = () => updateDropdownPos();
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    }, [open, updateDropdownPos]);
    useEffect(() => {
        if (!storageKey || initializedRef.current)
            return;
        initializedRef.current = true;
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.from || parsed.to)
                    onChange(parsed);
            }
        }
        catch { /* ignore */ }
    }, [storageKey, onChange]);
    useEffect(() => {
        if (!storageKey || !initializedRef.current)
            return;
        try {
            if (from || to)
                localStorage.setItem(storageKey, JSON.stringify({ from, to }));
            else
                localStorage.removeItem(storageKey);
        }
        catch { /* ignore */ }
    }, [storageKey, from, to]);
    useEffect(() => {
        if (!open)
            return;
        function handleClick(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
                setSelecting(null);
                onClose?.();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);
    useEffect(() => {
        if (!open)
            return;
        function handleKey(event) {
            if (event.key === "Escape") {
                setOpen(false);
                setSelecting(null);
                onClose?.();
            }
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);
    const prevMonth = useCallback(() => {
        setViewDate((current) => {
            const monthIndex = current.month - 1;
            return monthIndex < 0 ? { year: current.year - 1, month: 11 } : { year: current.year, month: monthIndex };
        });
    }, []);
    const nextMonth = useCallback(() => {
        setViewDate((current) => {
            const monthIndex = current.month + 1;
            return monthIndex > 11 ? { year: current.year + 1, month: 0 } : { year: current.year, month: monthIndex };
        });
    }, []);
    const secondMonth = useMemo(() => {
        const monthIndex = viewDate.month + 1;
        return monthIndex > 11 ? { year: viewDate.year + 1, month: 0 } : { year: viewDate.year, month: monthIndex };
    }, [viewDate]);
    const monthLabel = (year, month) => new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const handleDayClick = useCallback((date) => {
        const dateStr = formatDate(date);
        if (!selecting) {
            setSelecting(dateStr);
            setHoverDate(null);
        }
        else {
            const startDateString = selecting;
            const endDateString = dateStr;
            const [rangeFrom, rangeTo] = startDateString <= endDateString ? [startDateString, endDateString] : [endDateString, startDateString];
            const composedFrom = composeDatetime(rangeFrom, fromTime);
            const composedTo = composeDatetime(rangeTo, toTime);
            onChange({ from: composedFrom, to: composedTo });
            setSelecting(null);
            setHoverDate(null);
            if (!fromTime && !toTime) {
                setOpen(false);
                onClose?.();
            }
        }
    }, [selecting, onChange, onClose, fromTime, toTime]);
    const handlePreset = useCallback((preset) => {
        const presetDateRange = preset.getValue();
        onChange(presetDateRange);
        setSelecting(null);
        setHoverDate(null);
        setOpen(false);
        onClose?.();
    }, [onChange, onClose]);
    const handleClear = useCallback(() => {
        onChange({ from: "", to: "" });
        setFromTime("");
        setToTime("");
        setSelecting(null);
        setHoverDate(null);
        setOpen(false);
        onClose?.();
    }, [onChange, onClose]);
    const handleApplyTime = useCallback(() => {
        if (!from)
            return;
        const composedFrom = composeDatetime(from, fromTime);
        const composedTo = to ? composeDatetime(to, toTime) : "";
        onChange({ from: composedFrom, to: composedTo });
        setOpen(false);
        onClose?.();
    }, [from, to, fromTime, toTime, onChange, onClose]);
    const displayText = formatDateDisplay(from, to);
    const hasValue = !!(from || to);
    const activeFrom = selecting || from;
    const activeTo = selecting ? "" : to;
    const showTimeRow = hasValue;
    return (_jsxs("div", { className: styles.container, ref: containerRef, children: [!hideTrigger && (_jsxs("button", { ref: triggerRef, type: "button", className: `${styles.trigger} ${open ? styles.triggerOpen : ""} ${disabled ? styles.triggerDisabled : ""}`, onClick: () => !disabled && setOpen((previous) => !previous), disabled: disabled, children: [_jsxs("span", { className: styles.triggerContent, children: [_jsx("span", { className: styles.triggerIcon, children: _jsx(Calendar, { size: 13 }) }), _jsx("span", { className: styles.triggerText, children: displayText || placeholder })] }), hasValue ? (_jsx("span", { className: styles.triggerClear, onClick: (event) => { event.stopPropagation(); handleClear(); }, title: "Clear dates", children: _jsx(X, { size: 12 }) })) : (_jsx(ChevronDown, { size: 14, className: `${styles.chevron} ${open ? styles.chevronOpen : ""}` }))] })), hideTrigger && _jsx("div", { ref: triggerRef }), open && (_jsxs("div", { ref: dropdownElRef, className: styles.dropdown, style: { top: dropdownPos.top, left: dropdownPos.left }, children: [_jsx("div", { className: styles.presets, children: presets.map((preset) => {
                            const isActive = getActiveDatePreset(from, to) === preset.label;
                            return (_jsx("button", { type: "button", className: `${styles.presetBtn} ${isActive ? styles.presetBtnActive : ""}`, onClick: () => handlePreset(preset), children: preset.label }, preset.label));
                        }) }), _jsxs("div", { className: styles.calendars, children: [_jsxs("div", { className: styles.monthNav, children: [_jsx("button", { type: "button", className: styles.monthNavBtn, onClick: prevMonth, children: _jsx(ChevronLeft, { size: 14 }) }), _jsx("span", { className: styles.monthLabel, children: monthLabel(viewDate.year, viewDate.month) }), _jsx("span", { className: styles.monthLabel, children: monthLabel(secondMonth.year, secondMonth.month) }), _jsx("button", { type: "button", className: styles.monthNavBtn, onClick: nextMonth, children: _jsx(ChevronRight, { size: 14 }) })] }), _jsxs("div", { className: styles.monthPair, children: [_jsx(MonthGrid, { year: viewDate.year, month: viewDate.month, from: activeFrom, to: activeTo, hoverDate: hoverDate, onDayClick: handleDayClick, onDayHover: setHoverDate }), _jsx(MonthGrid, { year: secondMonth.year, month: secondMonth.month, from: activeFrom, to: activeTo, hoverDate: hoverDate, onDayClick: handleDayClick, onDayHover: setHoverDate })] }), selecting && (_jsx("div", { className: styles.selectHint, children: "Click a second date to complete the range" })), showTime && showTimeRow && !selecting && (_jsxs("div", { className: styles.timeRow, children: [_jsxs("div", { className: styles.timeField, children: [_jsx(Clock, { size: 12, className: styles.timeIcon }), _jsx("span", { className: styles.timeLabel, children: "From" }), _jsx("input", { type: "time", className: styles.timeInput, value: fromTime, onChange: (event) => setFromTime(event.target.value) })] }), _jsx("span", { className: styles.timeSep, children: "\u2013" }), _jsxs("div", { className: styles.timeField, children: [_jsx(Clock, { size: 12, className: styles.timeIcon }), _jsx("span", { className: styles.timeLabel, children: "To" }), _jsx("input", { type: "time", className: styles.timeInput, value: toTime, onChange: (event) => setToTime(event.target.value) })] }), _jsx("button", { type: "button", className: styles.timeApplyBtn, onClick: handleApplyTime, children: "Apply" })] }))] })] }))] }));
}
//# sourceMappingURL=DatePickerComponent.js.map