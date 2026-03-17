import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

export const registerContoller = async (req, res) => {
  const { username, email, password } = req.body;

  const isUserExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(400).json({
      message: "User with this email/username already exists",
      success: false,
      err: "User already exists",
    });
  }

  // Password will be hashed and saved by the .pre hook in models.
  const user = await User.create({ username, email, password });

  await sendEmail({
    to: email,
    subject: "Welcome to QueryMind !",
    html: `
        <h1>Hi, ${username}</h1>
        <p>Welcome to QueryMind</p>
        <p>Thank you for registering with QueryMind. 
        <br>You can now login to our platform.</br>
        </p>
    `,
  });

  return res.status(201).json({
    message: "User created successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};