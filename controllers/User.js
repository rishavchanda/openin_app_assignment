import User from "../models/User.js";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

// CREATE NEW USER
export const createUser = async (req, res, next) => {
  try {
    const { phone_number, priority } = req.body;

    // Validate input
    if (
      phone_number === null ||
      phone_number === undefined ||
      priority === null ||
      priority === undefined
    ) {
      return next(createError(400, "Phone number and priority are required."));
    }

    // Create a new user with phone_number
    const newUser = new User({
      phone_number,
      priority,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    res
      .status(201)
      .json({ message: "User created successfully.", user: newUser, token });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

// GET THE USER DETAILS
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate user ID
    if (!userId) {
      return next(createError(400, "User ID is required."));
    }

    // Find user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found."));
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
