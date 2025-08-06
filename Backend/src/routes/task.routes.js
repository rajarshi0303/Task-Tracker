import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);

router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
