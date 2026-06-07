"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { DATE_PRESETS, formatDate, parseDateValue as parseDate, formatDateDisplay, getActiveDatePreset } from "../../utils/datePresets.js";
import styles from "./DatePickerComponent.module.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(dateA: Date | null | undefined, dateB: Date | null | undefined): boolean {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isInRange(date: Date | null | undefined, from: Date | null | undefined, to: Date | null | undefined): boolean {
  if (!from || !to || !date) return false;
  return date >= from && date <= to;
}

function extractTime(dateTimeString: string | null | undefined): string {
  if (!dateTimeString || !dateTimeString.includes("T")) return "";
  const parsedDate = new Date(dateTimeString);
  if (isNaN(parsedDate.getTime())) return "";
  return `${String(parsedDate.getHours()).padStart(2, "0")}:${String(parsedDate.getMinutes()).padStart(2, "0")}`;
}

function composeDatetime(dateStr: string | null | undefined, time: string | null | undefined): string {
  if (!dateStr) return "";
  const dayPart = dateStr.slice(0, 10);
  if (!time) return dayPart;
  const [hh, mm] = time.split(":").map(Number);
  const composedDate = new Date(dayPart + "T00:00:00");
  composedDate.setHours(hh, mm, 0, 0);
  return composedDate.toISOString();
}

interface MonthGridProps {
  year: number;
  month: number;
  from: string | null | undefined;
  to: string | null | undefined;
  hoverDate: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
}

function MonthGrid({ year, month, from, to, hoverDate, onDayClick, onDayHover }: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  const rangeStart =
    fromDate && !toDate && hoverDate
      ? hoverDate < fromDate ? hoverDate : fromDate
      : fromDate;
  const rangeEnd =
    fromDate && !toDate && hoverDate
      ? hoverDate < fromDate ? fromDate : hoverDate
      : toDate;

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`pad-${i}`} className={styles['day-cell']} />);
  }
  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
    const date = new Date(year, month, dayNumber);
    const isToday = isSameDay(date, today);
    const isStart = isSameDay(date, rangeStart);
    const isEnd = isSameDay(date, rangeEnd);
    const inRange = isInRange(date, rangeStart, rangeEnd);
    const isFuture = date > today;

    const cls = [
      styles['day-button'],
      isToday && styles['day-today'],
      isStart && styles['day-start'],
      isEnd && styles['day-end'],
      inRange && !isStart && !isEnd && styles['day-in-range'],
      isFuture && styles['day-future'],
    ]
      .filter(Boolean)
      .join(" ");

    cells.push(
      <button
        key={dayNumber}
        type="button"
        className={cls}
        onClick={() => onDayClick(date)}
        onMouseEnter={() => onDayHover(date)}
        disabled={isFuture}
      >
        {dayNumber}
      </button>,
    );
  }

  return (
    <div className={styles['month-grid']}>
      <div className={styles['day-headers']}>
        {DAYS.map((dayLabel) => (
          <span key={dayLabel} className={styles['day-header']}>{dayLabel}</span>
        ))}
      </div>
      <div className={styles['day-cells']}>{cells}</div>
    </div>
  );
}

export interface DatePreset {
  label: string;
  getValue: () => { from: string; to: string };
}

export interface DatePickerComponentProps {
  from?: string;
  to?: string;
  onChange: (value: { from: string; to: string }) => void;
  placeholder?: string;
  storageKey?: string;
  disabled?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
  presets?: DatePreset[];
  showTime?: boolean;
}

export default function DatePickerComponent({
  from = "",
  to = "",
  onChange,
  placeholder = "All time",
  storageKey = "",
  disabled = false,
  defaultOpen = false,
  onClose,
  hideTrigger = false,
  presets = DATE_PRESETS,
  showTime = true,
}: DatePickerComponentProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = from ? parseDate(from) : new Date();
    const initialDate = parsed || new Date();
    return { year: initialDate.getFullYear(), month: initialDate.getMonth() };
  });
  const [selecting, setSelecting] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  const dropdownElRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  const [timeEdits, setTimeEdits] = useState({ fromTime: extractTime(from), toTime: extractTime(to), key: `${from}|${to}` });
  if (`${from}|${to}` !== timeEdits.key) {
    setTimeEdits({ fromTime: extractTime(from), toTime: extractTime(to), key: `${from}|${to}` });
  }
  const { fromTime, toTime } = timeEdits;
  const setFromTime = (value: string) => setTimeEdits((previous) => ({ ...previous, fromTime: value }));
  const setToTime = (value: string) => setTimeEdits((previous) => ({ ...previous, toTime: value }));

  const updateDropdownPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = rect.bottom + 6;
    let left = rect.left;

    if (dropdownElRef.current) {
      const dropRect = dropdownElRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      if (left + dropRect.width > viewportWidth - 8) left = Math.max(8, viewportWidth - dropRect.width - 8);
      if (top + dropRect.height > viewportHeight - 8) {
        const above = rect.top - dropRect.height - 6;
        if (above >= 8) top = above;
        else top = Math.max(8, viewportHeight - dropRect.height - 8);
      }
    }

    setDropdownPos({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
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
    if (!storageKey || initializedRef.current) return;
    initializedRef.current = true;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.from || parsed.to) onChange(parsed);
      }
    } catch { /* ignore */ }
  }, [storageKey, onChange]);

  useEffect(() => {
    if (!storageKey || !initializedRef.current) return;
    try {
      if (from || to) localStorage.setItem(storageKey, JSON.stringify({ from, to }));
      else localStorage.removeItem(storageKey);
    } catch { /* ignore */ }
  }, [storageKey, from, to]);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSelecting(null);
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); setSelecting(null); onClose?.(); }
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

  const monthLabel = (year: number, month: number) =>
    new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleDayClick = useCallback(
    (date: Date) => {
      const dateStr = formatDate(date);
      if (!selecting) {
        setSelecting(dateStr);
        setHoverDate(null);
      } else {
        const startDateString = selecting;
        const endDateString = dateStr;
        const [rangeFrom, rangeTo] = startDateString <= endDateString ? [startDateString, endDateString] : [endDateString, startDateString];
        const composedFrom = composeDatetime(rangeFrom, fromTime);
        const composedTo = composeDatetime(rangeTo, toTime);
        onChange({ from: composedFrom, to: composedTo });
        setSelecting(null);
        setHoverDate(null);
        if (!fromTime && !toTime) { setOpen(false); onClose?.(); }
      }
    },
    [selecting, onChange, onClose, fromTime, toTime],
  );

  const handlePreset = useCallback(
    (preset: DatePreset) => {
      const presetDateRange = preset.getValue();
      onChange(presetDateRange);
      setSelecting(null);
      setHoverDate(null);
      setOpen(false);
      onClose?.();
    },
    [onChange, onClose],
  );

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
    if (!from) return;
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

  return (
    <div className={`date-picker-component ${styles['container']}`} ref={containerRef}>
      {!hideTrigger && (
        <button
          ref={triggerRef as React.RefObject<HTMLButtonElement>}
          type="button"
          className={`${styles['trigger']} ${open ? styles['trigger-open'] : ""} ${disabled ? styles['trigger-disabled'] : ""}`}
          onClick={() => !disabled && setOpen((previous) => !previous)}
          disabled={disabled}
        >
          <span className={styles['trigger-content']}>
            <span className={styles['trigger-icon']}><Calendar size={13} /></span>
            <span className={styles['trigger-text']}>{displayText || placeholder}</span>
          </span>
          {hasValue ? (
            <span
              className={styles['trigger-clear']}
              onClick={(event) => { event.stopPropagation(); handleClear(); }}
              title="Clear dates"
            >
              <X size={12} />
            </span>
          ) : (
            <ChevronDown
              size={14}
              className={`${styles['chevron']} ${open ? styles['chevron-open'] : ""}`}
            />
          )}
        </button>
      )}
      {hideTrigger && <div ref={triggerRef as React.RefObject<HTMLDivElement>} />}

      {open && (
        <div
          ref={dropdownElRef}
          className={styles['dropdown']}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <div className={styles['presets']}>
            {presets.map((preset) => {
              const isActive = getActiveDatePreset(from, to) === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={`${styles['preset-button']} ${isActive ? styles['preset-btn-active'] : ""}`}
                  onClick={() => handlePreset(preset)}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className={styles['calendars']}>
            <div className={styles['month-nav']}>
              <button type="button" className={styles['month-nav-button']} onClick={prevMonth}>
                <ChevronLeft size={14} />
              </button>
              <span className={styles['month-label']}>{monthLabel(viewDate.year, viewDate.month)}</span>
              <span className={styles['month-label']}>{monthLabel(secondMonth.year, secondMonth.month)}</span>
              <button type="button" className={styles['month-nav-button']} onClick={nextMonth}>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className={styles['month-pair']}>
              <MonthGrid
                year={viewDate.year} month={viewDate.month}
                from={activeFrom} to={activeTo}
                hoverDate={hoverDate}
                onDayClick={handleDayClick} onDayHover={setHoverDate}
              />
              <MonthGrid
                year={secondMonth.year} month={secondMonth.month}
                from={activeFrom} to={activeTo}
                hoverDate={hoverDate}
                onDayClick={handleDayClick} onDayHover={setHoverDate}
              />
            </div>

            {selecting && (
              <div className={styles['select-hint']}>Click a second date to complete the range</div>
            )}

            {showTime && showTimeRow && !selecting && (
              <div className={styles['time-row']}>
                <div className={styles['time-field']}>
                  <Clock size={12} className={styles['time-icon']} />
                  <span className={styles['time-label']}>From</span>
                  <input type="time" className={styles['time-input']} value={fromTime} onChange={(event) => setFromTime(event.target.value)} />
                </div>
                <span className={styles['time-sep']}>–</span>
                <div className={styles['time-field']}>
                  <Clock size={12} className={styles['time-icon']} />
                  <span className={styles['time-label']}>To</span>
                  <input type="time" className={styles['time-input']} value={toTime} onChange={(event) => setToTime(event.target.value)} />
                </div>
                <button type="button" className={styles['time-apply-button']} onClick={handleApplyTime}>Apply</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
