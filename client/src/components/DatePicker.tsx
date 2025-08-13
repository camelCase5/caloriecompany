// this component is a custom date picker we built using react-day-picker to make selecting dates easier
// it takes in the currently selected value as a string, and a function to change it
// also added an optional prop to prevent picking past dates so that the user flow is cleaner
// learned how to parse and format dates in yyyy-mm-dd format so it works consistently across browsers

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value: string;
  onChange: (next: string) => void;
  disablePast?: boolean;
};

// helper: parse yyyy-mm-dd in local time
function parseISODateOnly(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map((n) => Number(n));
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatISODateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DatePicker({ value, onChange, disablePast }: Props) {
  const selected = useMemo(() => parseISODateOnly(value), [value]);
  const [open, setOpen] = useState(false);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const disabled = disablePast ? [{ before: today }] : undefined;

  // keep the calendar month in sync with the last selected date
  const [month, setMonth] = useState<Date>(selected ?? today);
  useEffect(() => {
    if (selected) setMonth(selected);
  }, [selected]);

  const inputCls =
    "border border-sand/70 bg-white/90 rounded-xl px-3 py-2 shadow-soft focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`${inputCls} flex items-center gap-2`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-slate/90 text-sm">
          {selected ? selected.toLocaleDateString() : "select date"}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate/60">
          <path d="M7 10h10M7 14h10M7 6h10M5 4h14v16H5V4z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-sand rounded-xl shadow-soft p-2">
          <DayPicker
            mode="single"
            selected={selected}
            month={month}
            onMonthChange={setMonth}
            onSelect={(d) => {
              // close the calendar even if the user clicks the same date
              if (!d) {
                setOpen(false);
                return;
              }
              onChange(formatISODateOnly(d));
              setOpen(false);
            }}
            disabled={disabled}
            weekStartsOn={0}
            styles={{
              caption: { color: "#64748b", fontWeight: 600 },
              day_selected: { backgroundColor: "#f97316", color: "white" },
              day_today: { border: "1px solid #2563eb" },
            }}
          />
        </div>
      )}
    </div>
  );
}
