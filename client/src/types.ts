// shared type between client and server for a food entry
export type Entry = {
  _id?: string;
  date: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};
