import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.js"
import { allcustomers, getuser, edituser, employuser, promotestaff, sackstaff, allstaffs, myworkers } from "../controllers/user.js";

const router = Router();

// get all customers
router.get('/all', allcustomers)

// get authenticated user
router.get('/', isLoggedIn, getuser)

// edit customer information
router.put('/edit', edituser)

// get all staffs
router.get('/staffs', allstaffs)

router.get('/agents', myworkers)

// employ a customer
router.put('/employ/:userid', employuser)

// promote a staff
router.put('/promote/:userid', promotestaff)

// sack a staff
router.put('/sack/:userid', sackstaff)

// search for a particular customer
// router.get('/searchcustomer', (req, res) => {})

// search for a particular staff
// router.get('/searchstaff', (req, res) => {})

export default router;