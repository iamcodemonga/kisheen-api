import { Router } from "express";
const router = Router();
import { instructions, fetchdiscount, setinstructions, setdiscount } from "../controllers/settings.js";

router.get('/', instructions)

router.get('/discount', fetchdiscount)

router.put('/', setinstructions)

router.put('/discount', setdiscount)

export default router;