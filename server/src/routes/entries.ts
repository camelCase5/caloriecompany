// entries routes: basic crud plus a date filter used by the client
import { Router } from "express";
import { z } from "zod";
import { Entry } from "../models/Entry";

const router = Router();

// validate request body
const entrySchema = z.object({
  date: z.string().min(10),
  name: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0).optional().default(0),
  carbs:   z.number().min(0).optional().default(0),
  fat:     z.number().min(0).optional().default(0),
});

// get /api/entries?date=yyyy-mm-dd
router.get("/", async (req, res, next) => {
  try {
    const date = req.query.date as string | undefined;
    if (date) {
      const items = await Entry.find({ date }).sort({ createdAt: -1 }).lean();
      return res.json(items);
    }
    const latest = await Entry.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json(latest);
  } catch (e) { next(e); }
});

// post /api/entries  (used by the entry form)
router.post("/", async (req, res, next) => {
  try {
    const parsed = entrySchema.parse(req.body);
    const created = await Entry.create(parsed);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// delete /api/entries/id
router.delete("/:id", async (req, res, next) => {
  try {
    const out = await Entry.findByIdAndDelete(req.params.id).lean();
    if (!out) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
    try {
      const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (e) { next(e); }
  });

export default router;
