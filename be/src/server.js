import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import { config } from "./config/env.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
