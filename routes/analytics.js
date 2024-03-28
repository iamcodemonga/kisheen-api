import { Router } from "express";
const router = Router();
import { barchart, piechart } from "../controllers/analytics.js";

router.get('/barchart', barchart)

router.get('/piechart', piechart)

export default router;