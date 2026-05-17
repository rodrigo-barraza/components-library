/**
 * useDateRange — persist a { from, to } date range to/from localStorage.
 *
 * Replaces the identical date-range load/save useEffect pair that was
 * copy-pasted across multiple admin filter components.
 */
interface DateRangeValue {
    from?: string;
    to?: string;
}
export default function useDateRange(storageKey: string, onChange?: (range: DateRangeValue | null) => void): [DateRangeValue | null, (range: DateRangeValue | null) => void, React.MutableRefObject<boolean>];
export {};
//# sourceMappingURL=useDateRange.d.ts.map