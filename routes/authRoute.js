import express from "express";
import { createUser, loginCntrlr } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginCntrlr);

export default router;
