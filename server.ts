import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import letterRoutes from "./Routes/letterRoutes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://30mgenomics.vercel.app"],
  methods: ["GET", "POST", "DELETE", "PUT"],
}));


mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});
app.use("/api/letters", letterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
