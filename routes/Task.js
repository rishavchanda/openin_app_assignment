import express from "express";
import {
  createTask,
  deleteTask,
  getAllUserTasks,
  updateTask,
} from "../controllers/Tasks.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getAllUserTasks);
router.patch("/:task_id", verifyToken, updateTask);
router.delete("/:task_id", verifyToken, deleteTask);

export default router;
