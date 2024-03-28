import { Router } from "express";
const router = Router();
import { changepassword, resetpassword } from "../controllers/password.js"

router.put('/', changepassword)

router.put('/reset', resetpassword)

export default router;