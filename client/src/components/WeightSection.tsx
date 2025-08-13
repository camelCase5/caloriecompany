// this component is our mvp for weekly weight tracking.
// we decided to keep it local-only first (no backend) so we could learn the charting + state flow
// without getting blocked by server work. the state shape is simple so we can persist later.

import { useEffect, useMemo, useState } from "react";
// we tried a few chart libs and landed on recharts because responsive container made sizing easier for us
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// we store one point per date; keeping the type tiny helped us reason about updates
type WeightPoint = { date: string; weight: number };

// helper to build a local yyyy-mm-dd string
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// parent passes in the selected date from app; we use it when adding a point
export default function WeightSection({ date }: { date: string }) {
  // we keep inputs as strings to avoid controlled input jitter
  const [startWeight, setStartWeight] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<string>("");
  const [points, setPoints] = useState<WeightPoint[]>([]);

  // temporary input for the weight value we want to add/update for the selected date
  const [wValue, setWValue] = useState<string>("");

  // numeric versions only when they are valid; undefined keeps optional ui like reference lines simple
  const goal = Number(goalWeight) || undefined;
  const start = Number(startWeight) || undefined;

  const STORAGE_KEY = "cc_weight_state_v1";

  // on first mount we hydrate from localstorage; we learned to wrap in try
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        startWeight?: string;
        goalWeight?: string;
        points?: WeightPoint[];
      };
      if (parsed.startWeight !== undefined) setStartWeight(parsed.startWeight);
      if (parsed.goalWeight !== undefined) setGoalWeight(parsed.goalWeight);
      if (Array.isArray(parsed.points)) setPoints(parsed.points);
    } catch {}
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ startWeight, goalWeight, points });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [startWeight, goalWeight, points]);

  // we only plot the dates the user actually entered; sorting by the yyyy-mm-dd string
  const chartData = useMemo(() => {
    return [...points].sort((a, b) => a.date.localeCompare(b.date));
  }, [points]);

  // we build a list of possible y values so reference lines (goal/start) are considered in the axis range too
  const allYValues = useMemo(() => {
    const values = points.map((p) => p.weight);
    if (goal) values.push(goal);
    if (start) values.push(start);
    return values;
  }, [points, goal, start]);

  // we learned charts feel better with tidy axes, so we snap to 5-lb increments
  const { yMin, yMax, yTicks } = useMemo(() => {
    if (allYValues.length === 0) {
      return { yMin: 0, yMax: 10, yTicks: [0, 5, 10] };
    }
    const roundDownTo5 = (n: number) => Math.floor(n / 5) * 5;
    const roundUpTo5 = (n: number) => Math.ceil(n / 5) * 5;

    let min = Math.min(...allYValues);
    let max = Math.max(...allYValues);
    min = roundDownTo5(min);
    max = roundUpTo5(max);
    if (min === max) {
      min -= 5;
      max += 5;
    }
    const ticks: number[] = [];
    for (let t = min; t <= max; t += 5) ticks.push(t);
    return { yMin: min, yMax: max, yTicks: ticks };
  }, [allYValues]);

  // adding a point is an upsert by date so we can fix mistakes by re-adding the same week
  function addPoint(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(wValue);
    if (!Number.isFinite(v) || v <= 0) return;

    // we blocked past dates
    if (date < todayISO()) {
      window.alert("you can't choose a past date.");
      return;
    }

    setPoints((prev) => {
      const idx = prev.findIndex((p) => p.date === date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { date: date, weight: v };
        return copy;
      }
      return [...prev, { date: date, weight: v }];
    });
    setWValue("");
  }

  // reset clears everything after a confirm; we used this a lot while iterating on the chart look
  function resetAll() {
    const confirmed = window.confirm(
      "Reset weight tracking? This will clear targets and all points."
    );
    if (!confirmed) return;
    setStartWeight("");
    setGoalWeight("");
    setPoints([]);
    setWValue("");
  }

  // tailwind utility strings kept here so jsx stays readable
  const card =
    "bg-white/90 border border-sand rounded-xl p-3 sm:p-4 shadow-soft overflow-hidden";
  const input =
    "border border-sand/70 bg-white/90 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30";

  // layout: header with restart, targets inputs, add/update form, chart, then a tiny legend
  return (
    <section className={card}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate">Weekly Weight Progress</h2>
        <button
          className="text-xs border border-slate/30 text-slate rounded-xl px-3 py-1 hover:bg-slate/5"
          onClick={resetAll}
          type="button"
        >
          Restart
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate/80 w-28">Start weight</label>
          <input
            className={input}
            type="number"
            placeholder="Enter weight in lbs"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate/80 w-28">Goal weight</label>
          <input
            className={input}
            type="number"
            placeholder="Enter weight in lbs"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
          />
        </div>
      </div>

      <form onSubmit={addPoint} className="grid grid-cols-2 gap-2 mb-4">
        <input
          className={`${input} col-span-1`}
          type="number"
          placeholder="Current weight"
          value={wValue}
          onChange={(e) => setWValue(e.target.value)}
        />
        <button
          className="col-span-1 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-600 active:bg-primary-700 transition"
          type="submit"
        >
          Add / Update Week
        </button>
      </form>

      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />
            {/* we lock the y axis to 5-lb steps so the chart reads cleaner */}
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              domain={[yMin, yMax]}
              ticks={yTicks}
            />
            <Tooltip />
            {goal && (
              <ReferenceLine y={goal} stroke="#2563eb" label={{ value: "Goal", fill: "#2563eb" }} />
            )}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            {start && (
              <ReferenceLine
                y={start}
                stroke="#64748b"
                strokeDasharray="3 3"
                label={{ value: "Start", fill: "#64748b" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* tiny legend so users know what the lines mean */}
      <div className="mt-2 text-xs text-slate/70">
        <span
          className="inline-block w-3 h-1 align-middle mr-1"
          style={{ background: "#f97316" }}
        />{" "}
        Your weight
        {goal ? (
          <>
            {"  "}•{" "}
            <span
              className="inline-block w-3 h-1 align-middle mr-1"
              style={{ background: "#2563eb" }}
            />{" "}
            Goal line
          </>
        ) : null}
      </div>
    </section>
  );
}
