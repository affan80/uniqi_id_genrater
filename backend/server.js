// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan"; 
import qrRoutes from "./routes/qrRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // Log requests in the console

// Routes
app.use("/api/qr", qrRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
