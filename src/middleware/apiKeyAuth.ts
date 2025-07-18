import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.API_KEY || "STUTI";

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};