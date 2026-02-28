import asyncHandler from "express-async-handler";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signInToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  if (user) {
    const token = signInToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      status: "success",
    });
  } else {
    res.status(400).json({ message: "Invalid user data", status: "error" });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User does not exist" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res
      .status(404)
      .json({ message: "Invalid credentials", status: "error" });

  const token = signInToken(user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
    isAdmin: user.isAdmin,
    status: "success",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    res.status(400);
    throw new Error("Email and new password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});
