import cron from "node-cron";
import Task from "../models/Tasks.js";

// Cron job will run every day at midnight
export default cron.schedule("0 0 * * *", async () => {
  try {
    const tasks = await Task.find({ deleted_at: null });

    // Update the priority based on the due_date
    tasks.forEach(async (task) => {
      const today = new Date();
      const dueDate = new Date(task.due_date);

      if (dueDate < today) {
        // Set priority based on due_date
        if (dueDate.toDateString() === today.toDateString()) {
          task.priority = 0;
        } else if (
          dueDate.getDate() === today.getDate() + 1 ||
          dueDate.getDate() === today.getDate() + 2
        ) {
          task.priority = 1;
        } else if (
          dueDate.getDate() === today.getDate() + 3 ||
          dueDate.getDate() === today.getDate() + 4
        ) {
          task.priority = 2;
        } else {
          task.priority = 3;
        }

        // Save the updated task
        await task.save();
      }
    });

    console.log("Priority update cron job completed.");
  } catch (error) {
    console.error("Error in priority update cron job:", error);
  }
});
