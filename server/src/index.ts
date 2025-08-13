// express api server: i kept this minimal and tried to separate files clearly
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import entriesRouter from "./routes/entries";
import { errorHandler } from "./middleware/error";

const app = express();
app.use(cors());
app.use(express.json());

// simple health check for troubleshooting
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/entries", entriesRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// start server after db connects so requests don't fail on boot
(async () => {
  try {
    console.log("Starting API...");
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (err: any) {
    console.error("Startup ERROR:", err.message || err);
    process.exit(1);
  }
})();
