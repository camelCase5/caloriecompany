// this form lets me add a new food entry for the selected date
import { useState } from "react";
import { createEntry } from "../api/entries";
import type { Entry } from "../types";

type Props = {
  date: string;
  onCreated: (e: Entry) => void;
};

export default function EntryForm({ date, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  // disable button while posting
  const [loading, setLoading] = useState(false);
  // show any server/client error
  const [err, setErr] = useState<string | null>(null);

  // small helper so empty fields become 0 instead of NaN
  function num(v: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  // send the data to the api and then clear the form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim() || !form.calories) {
      // keeping validation simple on the client for now
      setErr("Name and calories are required.");
      return;
    }
    setLoading(true);
    try {
      const created = await createEntry({
        date,
        name: form.name.trim(),
        calories: num(form.calories),
        protein: num(form.protein),
        carbs: num(form.carbs),
        fat: num(form.fat),
      });
      onCreated(created);
      setForm({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    } catch (e: any) {
      // i learned to check axios error shape to surface server messages
      setErr(e?.response?.data?.error || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  }

  // shared input style used across the app
  const inputCls =
    "border border-sand/70 bg-white/90 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <form
      className="bg-white/90 border border-sand rounded-xl p-3 sm:p-4 shadow-soft space-y-3"
      onSubmit={handleSubmit}
    >
      <h2 className="font-semibold text-slate">Add Food</h2>
      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="grid grid-cols-5 gap-2">
        <input
          className={`${inputCls} col-span-2`}
          placeholder="Name (Servings)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Calories"
          type="number"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Protein (g)"
          type="number"
          value={form.protein}
          onChange={(e) => setForm({ ...form, protein: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Carbs (g)"
          type="number"
          value={form.carbs}
          onChange={(e) => setForm({ ...form, carbs: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Fat (g)"
          type="number"
          value={form.fat}
          onChange={(e) => setForm({ ...form, fat: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-600 active:bg-primary-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
