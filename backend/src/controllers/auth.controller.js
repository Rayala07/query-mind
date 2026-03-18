import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

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

  /** @desc Password will be hashed and saved by the .pre hook in models. */
  const user = await User.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to QueryMind !",
    html: `
        <h1>Hi, ${username}</h1>
        <p>Welcome to QueryMind</p>
        <p>Thank you for registering with QueryMind. Please verify your email address by clicking on the link below.</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <br>If you did not create an account, you can ignore this email.</br>
        <br>Thank you for using QueryMind.</br>
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

export const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
      err: "User not found",
    });
  }

  user.verified = true;

  await user.save();

  const html = `
    <h1>Email Verified Successfully</h1>
    <p>You can now login to your account</p>
    <a href="http://localhost:3000/api/auth/login">Login</a>
  `;

  res.send(html);
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials",
      success: false,
      err: "Invalid Credentials",
    });
  }

  const matchPassword = await user.isPasswordCorrect(password);

  if (!matchPassword) {
    return res.status(400).json({
      message: "Invalid Credentials",
      success: false,
      err: "Invalid Credentials",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Email not verified",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const getMeController = async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
