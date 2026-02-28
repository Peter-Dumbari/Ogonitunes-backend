import { User } from "../src/models/user.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Unauthorized: Oga please provide a valid token",
      status: "error",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return res.status(401).json({ error: "Invalid token - user not found" });

    if (user.isAdmin !== true)
      return res.status(403).json({ error: "Forbidden: Admins only" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};

export default auth;
