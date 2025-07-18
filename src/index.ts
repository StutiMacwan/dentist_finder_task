import express from "express";
import mockApiRouter from "./mockApi";
import apiRouter from "./routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (req.path.startsWith("/api/")) {
    if (apiKey !== "STUTI") {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  next();
});

// mock API route
app.use(mockApiRouter);

// internal API route
app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Server running at: ${process.env.MOCK_API_BASE_URL}`);
});