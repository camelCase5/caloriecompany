// tiny axios wrapper so i don't repeat base urls and types everywhere
import axios from "axios";
import type { Entry } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// get entries for a specific date
export async function fetchEntriesByDate(date: string) {
  const { data } = await api.get<Entry[]>("/entries", { params: { date } });
  return data;
}

// create a new entry
export async function createEntry(payload: Entry) {
  const { data } = await api.post<Entry>("/entries", payload);
  return data;
}

// delete by id
export async function deleteEntry(id: string) {
  const { data } = await api.delete<{ ok: true }>(`/entries/${id}`);
  return data;
}

// update only the changed fields
export async function updateEntry(id: string, payload: Partial<Entry>) {
  const { data } = await api.put<Entry>(`/entries/${id}`, payload);
  return data;
}

