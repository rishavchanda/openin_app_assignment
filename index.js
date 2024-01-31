import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/User.js";
import taskRoute from "./routes/Task.js";
import subTaskRoute from "./routes/SubTask.js";

const app = express();
dotenv.config();

/** Middlewares */
app.use(express.json());
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(morgan("tiny"));

const port = process.env.PORT || 8800;

const connect = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

app.use(express.json());

app.use("/api/user/", userRoute);
app.use("/api/task/", taskRoute);
app.use("/api/sub-task/", subTaskRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use(express.json());

app.listen(port, () => {
  console.log("Connected");
  connect();
});
