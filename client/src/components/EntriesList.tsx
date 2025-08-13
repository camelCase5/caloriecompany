// this component shows a list of food or calorie entries from the backend
// it also allows editing entries inline so the user doesn't have to go to a separate page
// we keep track of which entry is currently being edited with an id, and store temporary changes locally
// when the user saves, we call the backend update function and notify the parent so it refreshes its state

import { useState } from "react";
import type { Entry } from "../types";
import { updateEntry } from "../api/entries";

export default function EntriesList({
  entries,
  loading,
  onDelete,
  onUpdated,
}: {
  entries: Entry[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onUpdated: (e: Entry) => void;
}) {
  // which row is currently being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  // i keep a partial copy of the edits so i only send changed fields
  const [edit, setEdit] = useState<Partial<Entry>>({});
  // saving helps me disable the save button to avoid double submits
  const [saving, setSaving] = useState(false);

  // persist the changes, then reset local editing state
  async function save(id: string) {
    try {
      setSaving(true);
      const updated = await updateEntry(id, edit);
      onUpdated(updated);
      setEditingId(null);
      setEdit({});
    } finally {
      setSaving(false);
    }
  }

  // simple empty state & loading state
  if (loading) {
    return (
      <div className="bg-white/90 border border-sand rounded-xl p-4 shadow-soft animate-pulse">
        <div className="h-4 bg-sand/50 rounded w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 bg-sand/40 rounded" />
          ))}
        </div>
      </div>
    );
  }
  if (entries.length === 0) return <p className="text-slate/70">No foods logged yet.</p>;

  const inputCls =
    "border border-sand/70 bg-white/90 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div className="bg-white/90 border border-sand rounded-xl p-3 sm:p-4 shadow-soft">
      <h2 className="text-base sm:text-lg font-semibold text-slate mb-2">Entries</h2>
      <ul className="space-y-2">
        {entries.map((e) => {
          const isEdit = editingId === e._id;
          return (
            <li
              key={e._id ?? e.name}
              className="flex items-center justify-between border-b border-sand/60 pb-2 gap-3"
            >
              {isEdit ? (
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <input
                    className={`${inputCls} col-span-2`}
                    defaultValue={e.name}
                    onChange={(ev) => setEdit((p) => ({ ...p, name: ev.target.value }))}
                  />
                  <input
                    className={inputCls}
                    type="number"
                    defaultValue={e.calories}
                    onChange={(ev) => setEdit((p) => ({ ...p, calories: Number(ev.target.value) }))}
                    placeholder="Calories"
                  />
                  <input
                    className={inputCls}
                    type="number"
                    defaultValue={e.protein ?? 0}
                    onChange={(ev) => setEdit((p) => ({ ...p, protein: Number(ev.target.value) }))}
                    placeholder="Protein"
                  />
                  <input
                    className={inputCls}
                    type="number"
                    defaultValue={e.carbs ?? 0}
                    onChange={(ev) => setEdit((p) => ({ ...p, carbs: Number(ev.target.value) }))}
                    placeholder="Carbs"
                  />
                  <input
                    className={inputCls}
                    type="number"
                    defaultValue={e.fat ?? 0}
                    onChange={(ev) => setEdit((p) => ({ ...p, fat: Number(ev.target.value) }))}
                    placeholder="Fat"
                  />
                </div>
              ) : (
                <div className="flex-1 text-slate">
                  <span className="mr-3 font-medium">{e.name}</span>
                  <span className="text-sm text-slate/80">
                    {e.calories} cal • {(e.protein ?? 0)}g P • {(e.carbs ?? 0)}g C • {(e.fat ?? 0)}g F
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                {isEdit ? (
                  <>
                    <button
                      className="text-xs rounded-xl px-3 py-1 bg-primary text-white hover:bg-primary-600 disabled:opacity-50"
                      onClick={() => e._id && save(e._id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="text-xs border border-slate/30 text-slate rounded-xl px-3 py-1 hover:bg-slate/5"
                      onClick={() => {
                        setEditingId(null);
                        setEdit({});
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-xs border border-accent/40 text-accent rounded-xl px-3 py-1 hover:bg-accent/5"
                      onClick={() => {
                        setEditingId(e._id || null);
                        setEdit({});
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs border border-slate/30 text-slate rounded-xl px-3 py-1 hover:bg-slate/5"
                      onClick={() => e._id && onDelete(e._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
