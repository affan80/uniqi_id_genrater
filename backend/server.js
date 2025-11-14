// server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import qrRoutes from "./routes/qrRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./db.js";

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/", qrRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server is running successfully" });
});

// Server Start
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
