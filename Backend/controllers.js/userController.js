import User from "../models/User.js"; 

export const registerUser = async (req, res) => {
  const { role } = req.body;
  const { userId, sessionClaims } = req.auth;
console.log("req.body:", req.body); // Check if role is there
console.log("req.auth:", req.auth); // Check Clerk info


  try {
    let existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      return res.status(200).json({ message: "User already registered" });
    }

    const newUser = new User({
      clerkId: userId,
      name: sessionClaims?.name,
      email: sessionClaims?.email,
      role: role || 'student'
    });

    await newUser.save();
    return res.status(201).json({ message: "User saved", user: newUser });

  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};