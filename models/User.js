import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone_number: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
