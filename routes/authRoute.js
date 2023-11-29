import express from "express";
import createUser from "../controllers/userController.js";

const router = express.Router();

const registerRouter = router.post("/register", createUser);

export default registerRouter;
