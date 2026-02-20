import asyncHandler from "express-async-handler";
import { User } from "../models/user";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: "success",
  });
});
