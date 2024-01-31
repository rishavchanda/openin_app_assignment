import SubTask from "../models/Subtasks.js";
import { createError } from "../error.js";
import Task from "../models/Tasks.js";

// CREATE A NEW SUB TASK FOR A TASK
export const createSubTask = async (req, res, next) => {
  try {
    const { task_id } = req.body;
    const user = req.user;
    if (!user) {
      return next(createError(401, "User Not found!"));
    }

    // Validate input
    if (!task_id) {
      return next(createError(404, "Task ID is required."));
    }

    // Create a new sub task
    const newSubTask = new SubTask({
      task_id,
    });

    // Save the sub task to the database
    const savedSubTask = await newSubTask.save();

    await res.status(201).json({
      message: "Sub Task created successfully.",
      subTask: savedSubTask,
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

// GET ALL USER SUB_TASKS AND OPTION TO FILTER BY task_id
export const getAllUserSubTasks = async (req, res, next) => {
  try {
    const user = req.user;
    const { task_id } = req.query;

    if (!user) {
      return next(createError(401, "User Not found!"));
    }

    let filter = {};
    if (!task_id) {
      // Find all tasks associated with the user
      const tasks = await Task.find({ user_id: user.id });

      // Create a filter to get all subtasks associated with the user's tasks
      const taskIds = tasks.map((task) => task._id);
      filter =
        taskIds.length > 0
          ? { task_id: { $in: taskIds }, deleted_at: null }
          : { deleted_at: null };
    } else {
      filter = { task_id, deleted_at: null };
    }

    const subTasks = await SubTask.find(filter);

    return res.json({ subTasks });
  } catch (err) {
    return next(
      createError(err.statusCode || 500, err.message || "Internal Server Error")
    );
  }
};

// UPDATE SUB TASK
export const updateSubTask = async (req, res, next) => {
  try {
    const { subtask_id } = req.params;
    const { status } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Validate input
    if (!subtask_id) {
      return next(createError(400, "Subtask ID is required."));
    }

    // Find the subtask by ID
    const subtask = await SubTask.findById(subtask_id);

    // Check if the subtask exists
    if (!subtask) {
      return next(createError(404, "Subtask not found."));
    }

    if (subtask?.deleted_at != null) {
      return next(
        createError(400, `Subtask was deleted on: ${subtask?.deleted_at}`)
      );
    }

    //Check if the subtask belongs to user
    const task = await Task.findById(subtask.task_id);
    if (!task) {
      return next(createError(404, "Task not found for this subtask"));
    }
    if (task?.user_id != user_id) {
      return next(createError(401, "You can't update this subtask!"));
    }

    if (status !== undefined) {
      // Update the subtask status if provided
      subtask.status = status;
    }

    // Save the updated subtask
    await subtask.save();

    res.json({ message: "Subtask updated successfully.", subtask });
  } catch (err) {
    return next(
      createError(err.statusCode || 500, err.message || "Internal Server Error")
    );
  }
};

// SOFT DELETE SUB_TASK
export const deleteSubTask = async (req, res, next) => {
  try {
    const { subtask_id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return next(createError(404, "User not found!"));
    }

    // Validate input
    if (!subtask_id) {
      return next(createError(400, "Subtask ID is required."));
    }

    // Find the subtask by ID
    const subtask = await SubTask.findById(subtask_id);

    // Check if the subtask exists
    if (!subtask) {
      return next(createError(404, "Subtask not found."));
    }
    if (subtask?.deleted_at != null) {
      return next(
        createError(400, `Subtask already deleted on: ${subtask?.deleted_at}`)
      );
    }

    //Check if the subtask belongs to user
    const task = await Task.findById(subtask.task_id);
    if (!task) {
      return next(createError(404, "Task not found for this subtask"));
    }
    if (task?.user_id != user_id) {
      return next(createError(401, "You can't delete this subtask!"));
    }

    // Perform soft delete by updating deleted_at field
    subtask.deleted_at = new Date();

    // Save the updated subtask
    await subtask.save();

    res.json({ message: "Subtask deleted successfully.", subtask });
  } catch (err) {
    return next(
      createError(err.statusCode || 500, err.message || "Internal Server Error")
    );
  }
};
