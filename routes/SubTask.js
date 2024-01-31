import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createSubTask,
  deleteSubTask,
  getAllUserSubTasks,
  updateSubTask,
} from "../controllers/SubTask.js";

const router = express.Router();

router.post("/", verifyToken, createSubTask);
router.get("/", verifyToken, getAllUserSubTasks);
router.patch("/:subtask_id", verifyToken, updateSubTask);
router.delete("/:subtask_id", verifyToken, deleteSubTask);

export default router;
