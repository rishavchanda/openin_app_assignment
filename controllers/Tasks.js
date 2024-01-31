import Task from "../models/Tasks.js";
import { createError } from "../error.js";

// CREATE NEW TASK FOR A USER
export const createTask = async (req, res, next) => {
  try {
    const { title, description, due_date } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Validate input
    if (!title || !description || !due_date) {
      return next(
        createError(400, "Title, description, and due date are required.")
      );
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      due_date,
      user_id,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    return res
      .status(201)
      .json({ message: "Task created successfully.", task: savedTask });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

// GET ALL USER TASKS WITH FILTERS AND PAGINATION
export const getAllUserTasks = async (req, res, next) => {
  try {
    const user_id = req.user?.id;

    const { priority, status, due_date, page, limit } = req.query;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Build filter object
    const filter = { user_id, deleted_at: null };
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (due_date) filter.due_date = { $lte: new Date(due_date) }; // Assumed due_date is in format 'YYYY-MM-DD'

    // Implement pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    // Fetch tasks based on filter and pagination
    const tasks = await Task.paginate(filter, options);

    return res.json(tasks);
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

// UPDATE TASK due_date AND status
export const updateTask = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const { due_date, status } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Validate input
    if (!task_id) {
      return next(createError(400, "Task ID is required."));
    }

    // Find the task by ID
    const task = await Task.findById(task_id);

    // Check if the task exists
    if (!task) {
      return next(createError(404, "Task not found."));
    }

    if (task?.deleted_at != null) {
      return next(createError(400, `Task was deleted on: ${task?.deleted_at}`));
    }

    //Check if task delongs to the user
    if (task.user_id != user_id) {
      return next(createError(401, "You cant update this task!"));
    }

    // Update due_date and status if provided
    if (due_date) {
      task.due_date = due_date;
    }
    if (status) {
      task.status = status;
    }

    // Save the updated task
    await task.save();

    res.json({ message: "Task updated successfully.", task });
  } catch (err) {
    return next(
      createError(err.statusCode || 500, err.message || "Internal Server Error")
    );
  }
};

// DELETE A TASK
export const deleteTask = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Validate input
    if (!task_id) {
      return next(createError(400, "Task ID is required."));
    }

    // Find the task by ID
    const task = await Task.findById(task_id);

    // Check if the task exists
    if (!task) {
      return next(createError(404, "Task not found."));
    }

    if (task?.deleted_at != null) {
      return next(
        createError(400, `Task already deleted on: ${task?.deleted_at}`)
      );
    }

    // Check if task belongs to user
    if (task?.user_id != user_id) {
      return next(createError(401, "You can't delete this task!"));
    }

    // Perform soft delete by updating deleted_at field
    task.deleted_at = new Date();

    // Save the updated task
    await task.save();

    return res.json({ message: "Task deleted successfully.", task });
  } catch (err) {
    return next(
      createError(err.statusCode || 500, err.message || "Internal Server Error")
    );
  }
};
