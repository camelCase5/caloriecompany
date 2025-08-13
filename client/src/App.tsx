// trying to keep app as the simple coordinator for state and server calls
import { useEffect, useMemo, useState } from "react";
import TotalsCard from "./components/TotalsCard";
import DatePicker from "./components/DatePicker";
import EntryForm from "./components/EntryForm";
import EntriesList from "./components/EntriesList";
import { fetchEntriesByDate, deleteEntry } from "./api/entries";
import type { Entry } from "./types";
import WeightSection from "./components/WeightSection";

// learned that toISOString() is utc and can shift the day, so i build a local yyyy-mm-dd
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  // date picker drives which entries we fetch from the server
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  // entries we show for the selected date
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // whenever the date changes, ask the api for entries for that day
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchEntriesByDate(selectedDate)
      .then((data) => {
        if (alive) setEntries(data);
      })
      .catch((err) => {
        console.error("GET /entries failed", err);
        if (alive) setEntries([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedDate]);

  // compute totals for the small summary card; memoized so list edits don't overwork
  const totals = useMemo(() => {
    return entries.reduce(
      (a, e) => ({
        calories: a.calories + (e.calories || 0),
        protein: a.protein + (e.protein || 0),
        carbs: a.carbs + (e.carbs || 0),
        fat: a.fat + (e.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [entries]);

  // delete from server first, then reflect locally on success
  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (e) {
      console.error("DELETE /entries failed", e);
    }
  }

  return (
    <div className="min-h-screen bg-cream text-slate flex flex-col">
      <header className="mx-auto max-w-6xl w-full px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/CC_Image.svg" alt="Calorie Company logo" className="h-8 w-8" />
          <h1 className="text-3xl font-extrabold text-accent">Calorie Company</h1>
        </div>
        <p className="text-sm text-slate/80">Track Smart, Live Better.</p>
      </header>

      <main className="mx-auto max-w-6xl w-full px-6 grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full grid-rows-[auto,auto,1fr,auto]">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate/90">Date:</label>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
          <div className="hidden lg:block" />

          <TotalsCard totals={totals} />
          <div>
            <EntryForm
              date={selectedDate}
              onCreated={(entry: Entry) => setEntries((prev) => [entry, ...prev])}
            />
          </div>
          <div className="min-h-0 overflow-auto">
            <EntriesList
              entries={entries}
              loading={loading}
              onDelete={handleDelete}
              onUpdated={(u: Entry) =>
                setEntries((prev) => prev.map((e) => (e._id === u._id ? u : e)))
              }
            />
          </div>

          <WeightSection date={selectedDate} />
          <div className="hidden lg:block" />
        </div>
      </main>
    </div>
  );
}
