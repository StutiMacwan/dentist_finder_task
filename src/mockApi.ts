import { Router, Request, Response } from "express";
import { apiKeyAuth } from "./middleware/apiKeyAuth";

const router = Router();

router.get("/mock-external-api/slots", apiKeyAuth, (req: Request, res: Response) => {
    const data = [
        {
            date: "2025-07-20",
            times: ["09:00", "10:30", "13:15"],
            doctor: { name: "Dr. Smith", id: "d1001" },
            type: "NewPatient",
        },
        {
            available_on: "2025/07/21",
            slots: [
                { start: "10:00", end: "10:30" },
                { start: "11:00", end: "11:30" }
            ],
            provider: "Dr. Lee",
            category: "General",
        },
    ];

    res.json(data);
});

export default router;