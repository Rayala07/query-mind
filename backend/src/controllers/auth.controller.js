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
        <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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

  if (user.verified) {
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  user.verified = true;

  await user.save();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verified — QueryMind</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0c0a1e;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
      position: relative;
    }
    /* Background dot grid */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(139,92,246,0.18) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      z-index: 0;
    }
    /* Glow blobs */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-1 {
      top: 10%;
      left: 20%;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%);
    }
    .blob-2 {
      bottom: 15%;
      right: 15%;
      width: 240px;
      height: 240px;
      background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
    }
    /* Entrance animation */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      background: rgba(13,13,26,0.75);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px;
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      padding: clamp(1.75rem, 5vw, 2.5rem);
      box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
      animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
      text-align: center;
    }
    /* Logo */
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
      text-decoration: none;
    }
    .logo-mark {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg,#8b5cf6,#6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      color: #fff;
      user-select: none;
      flex-shrink: 0;
    }
    .logo-text {
      font-weight: 600;
      font-size: 15px;
      color: #e2e8f0;
    }
    /* Icon badge */
    .icon-badge {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .icon-badge svg {
      width: 32px;
      height: 32px;
      stroke: #8b5cf6;
      fill: none;
      stroke-width: 1.75;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #f1f5f9;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.65;
      margin-bottom: 28px;
    }
    .divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px 20px;
      border-radius: 10px;
      background: linear-gradient(135deg,#8b5cf6,#6366f1);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.005em;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 20px rgba(139,92,246,0.35);
    }
    .btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }
    .btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  </style>
</head>
<body>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>

  <div class="card">
    <!-- Logo -->
    <a class="logo" href="${process.env.FRONTEND_URL}">
      <div class="logo-mark">Q</div>
      <span class="logo-text">QueryMind</span>
    </a>

    <!-- Icon -->
    <div class="icon-badge">
      <!-- Remix: RiCheckboxCircleLine -->
      <svg viewBox="0 0 24 24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.413-1.414-5.657 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
      </svg>
    </div>

    <h1>Email Verified Successfully</h1>
    <p class="subtitle">
      Your account is now active. Sign in below and start using QueryMind.
    </p>

    <hr class="divider" />

    <a class="btn" href="${process.env.FRONTEND_URL}/login">
      <svg viewBox="0 0 24 24">
        <path d="M16 12H4m0 0l4-4m-4 4l4 4m5-9h3a2 2 0 012 2v10a2 2 0 01-2 2h-3"/>
      </svg>
      Go to Login
    </a>
  </div>
</body>
</html>`;

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

export const resendVerificationEmailController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      success: false,
      err: "Bad Request",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "Not Found",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      message: "User is already verified",
      success: false,
      err: "Bad Request",
    });
  }

  const now = new Date();
  if (user.lastVerificationEmailSentAt) {
    const diffInSeconds = (now - user.lastVerificationEmailSentAt) / 1000;
    if (diffInSeconds < 30) {
      return res.status(429).json({
        message: "Please wait 30 seconds before requesting another email",
        success: false,
        err: "Too Many Requests",
      });
    }
  }

  user.lastVerificationEmailSentAt = now;
  await user.save();

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Resend: Verify your QueryMind Account !",
    html: `
        <h1>Hi, ${user.username}</h1>
        <p>Welcome to QueryMind</p>
        <p>Please verify your email address by clicking on the link below.</p>
        <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <br>If you did not request this email, you can ignore it.</br>
        <br>Thank you for using QueryMind.</br>
    `,
  });

  return res.status(200).json({
    message: "Verification email resent successfully",
    success: true,
  });
};

