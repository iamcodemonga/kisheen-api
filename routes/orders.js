import { Router } from "express";
const router = Router();
import { addcustomerorders, searchorder, searchcustomerorder, allcustomerorders, allorders, changestatus, printorders } from "../controllers/orders.js";

// get all orders
router.get('/all', allorders)

// get all customer orders
router.get('/', allcustomerorders)

// add customer orders
router.post('/', addcustomerorders)

// update order status
router.put('/status/:receipt', changestatus)

// seach for orders
router.put('/print', printorders)

// seach for orders
router.get('/search', searchorder)

// search a particular customer orders
router.get('/search/:userid', searchcustomerorder)

export default router;