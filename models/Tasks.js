import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
