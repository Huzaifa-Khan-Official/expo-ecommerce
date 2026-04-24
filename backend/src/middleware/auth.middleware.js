import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      console.log("clerkId", clerkId);
      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      let user = await User.findOne({ clerkId });
      
      // Auto-create user if they don't exist (for mobile/first-time users)
      if (!user) {
        console.log("👤 Creating new user for clerkId:", clerkId);
        const clerkUser = req.auth;
        user = await User.create({
          clerkId,
          email: req.auth().sessionClaims?.email || "user@example.com",
          name: `${req.auth().sessionClaims?.firstName || ""} ${req.auth().sessionClaims?.lastName || ""}`.trim() || "User",
          imageUrl: req.auth().sessionClaims?.image || "",
          addresses: [],
          wishlist: [],
        });
        console.log("✅ New user created:", user.email);
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - user not found" });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - admin access only" });
  }

  next();
};
