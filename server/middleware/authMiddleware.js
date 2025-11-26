// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//     const { userId } = req.auth;
    
//     if (!userId) {
//         res.json({ success: false, message: "not authenticated" });
//     } else {
//         const user = await User.findById(userId);
//         req.user = user;
//         next();
//     }
// };

import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    let user = await User.findById(auth.userId);

    // Auto-register if user not found
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(auth.userId);

      user = await User.create({
        _id: auth.userId,
        username: clerkUser.username || clerkUser.firstName || "Anonymous",
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.profileImageUrl || "https://via.placeholder.com/150"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    res.json({ success: false, message: "Authentication failed" });
  }
};
