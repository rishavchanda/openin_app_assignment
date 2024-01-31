import express from "express";
import { createUser, getUserDetails } from "../controllers/User.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/:id", getUserDetails);

export default router;
