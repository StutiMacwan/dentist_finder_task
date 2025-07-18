import { Router, Request, Response } from "express";
import axios from "axios";
import { normalizeSlots } from "./normalize";
import { apiKeyAuth } from "./middleware/apiKeyAuth";

const router = Router();

router.get("/api/available-slots", apiKeyAuth, async (req: Request, res: Response) => {
    const { page = "1", per_page = "10", provider, date } = req.query;

    // Convert string inputs to numbers
    const pageNum = parseInt(page as string, 10);
    const perPageNum = parseInt(per_page as string, 10);

    // Validation
    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ error: "Invalid 'page' value. Must be a positive integer." });
    }

    if (isNaN(perPageNum) || perPageNum < 1) {
        return res.status(400).json({ error: "Invalid 'per_page' value. Must be a positive integer." });
    }

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
        return res.status(400).json({ error: "Invalid 'date' format. Use YYYY-MM-DD." });
    }
    try {
        const MOCK_API_BASE_URL = process.env.MOCK_API_BASE_URL;
        if (!MOCK_API_BASE_URL) {
            console.error("Missing MOCK_API_BASE_URL");
            return res.status(500).json({ error: "Server configuration error" });
        }
        const response = await axios.get(`${MOCK_API_BASE_URL}/mock-external-api/slots`, {
            headers: {
                "x-api-key": process.env.API_KEY
            }
        });

        const rawSlots = response.data;
        let slots = normalizeSlots(rawSlots);
        const { provider, date, page = "1" } = req.query;
        if (provider) {
            slots = slots.filter(
                (slot) => slot.provider.toLowerCase() === (provider as string).toLowerCase()
            );
        }
        if (date) {
            slots = slots.filter((slot) => slot.date === date);
        }

        const pageNum = parseInt(page as string, 10) || 1;
        const pageSize = 10;
        const startIndex = (pageNum - 1) * pageSize;
        const pagedSlots = slots.slice(startIndex, startIndex + pageSize);

        res.json({
            total: slots.length,
            page: pageNum,
            per_page: pageSize,
            data: pagedSlots,
        });
        console.log("Fetched slots data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error fetching slots:", error);
        if (axios.isAxiosError(error)) {
            res.status(502).json({ error: "Error contacting external slots API" });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

export default router;