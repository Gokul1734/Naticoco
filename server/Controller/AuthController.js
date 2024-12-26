const usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PASS = process.env.PASS;
const nodemailer = require("nodemailer");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter all fields" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidate = await bcrypt.compare(password, user.password);
    if (isValidate) {
      const { password, ...userWithoutPassword } = user.toObject();

      const accessToken = jwt.sign(
        { email: email, userId: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        accessToken,
        user: {
          userId: user._id,
          name: user.name,
          mobileno: user.mobileno,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: "Enter valid Password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const fetchOne = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) {
//       return res.status(400).json({ message: "Enter all fields" });
//     }

//     const user = await usermodel.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       res.status(200).json(user);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const fetch = async (req, res) => {
  try {
    const users = await usermodel.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, mobileno } = req.body;

    if (!name || !email || !password || !mobileno) {
      return res.status(400).json({ message: "Enter all the fields" });
    }

    const user = await usermodel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpwd = await bcrypt.hash(password, 10);

    await usermodel.create({ name, password: hashpwd, email, mobileno });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const gtpOtps = async (req, res) => {
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otpToken = otp;
    user.otpExpire = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dharaneedharanchinnusamy@gmail.com",
        pass: PASS,
      },
    });

    const mailOptions = {
      from: "dharaneedharanchinnusamy@gmail.com",
      to: email,
      subject: "Email Verification OTP",
      html: `
              <div style="color: black; font-size: 20px;">
                <p>Hello,</p>
                <p><strong>Your OTP for email verification is:</strong></p>
                <h1 style="color: black;">${otp}</h1>
                <p>Please use this OTP to verify your email.</p>
                <p>Best regards,<br/>Your App Team</p>
              </div>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification OTP email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send verification OTP email" });
      }
      console.log("Verification OTP email sent:", info.response, otp);
      res.status(200).json({ message: "Verification OTP sent to email" });
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`Received OTP: ${otp}`);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.otpToken === otp) {
      user.otpToken = null;
      user.otpExpire = null;
      user.verified = true;

      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateOTP();

    user.resetPwdToken = token;
    user.resetPwdExpire = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dharaneedharanchinnusamy@gmail.com",
        pass: PASS,
      },
    });

    const mailOptions = {
      from: "dharaneedharanchinnusamy@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `Hello ${user.name},\n\nYou requested to reset your password. Please use the following token to reset your password:\n\n${token}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nYour App Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending password reset email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send password reset email" });
      }

      console.log("Password reset email sent:", info.response, token);
      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const respassword = async (req, res) => {
  const { token, pwd } = req.body;
  if (!token || !pwd) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const user = await usermodel.findOne({
      resetPwdToken: token,
      resetPwdExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    if (pwd.length < 6) {
      return res.status(400).json({
        message:
          "Password is too short. It must be at least 6 characters long.",
      });
    }
    const hashedPassword = await bcrypt.hash(pwd, 10);

    user.password = hashedPassword;
    user.resetPwdToken = null;
    user.resetPwdExpire = null;
    await user.save();

    console.log("Password reset successfully");
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

// Store OTPs temporarily (in production, use a database)
const otpStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kgokulpriyan@gmail.com", // Your Gmail address
    pass: "iivv hibp uldp jmnx", // Your Gmail app password
  },
});

// Generate OTP
const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with email
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0,
    });

    // Send email
    const mailOptions = {
      from: "kgokulpriyan@gmail.com",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (storedData.otp === otp) {
      otpStore.delete(email); // Clear OTP after successful verification
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      storedData.attempts += 1;
      if (storedData.attempts >= 3) {
        otpStore.delete(email);
        res.json({
          success: false,
          message: "Too many attempts. Please request new OTP",
        });
      } else {
        res.json({ success: false, message: "Invalid OTP" });
      }
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const storedData = otpStore.get(email);

    if (storedData && Date.now() - storedData.timestamp < 60000) {
      return res.json({
        success: false,
        message: "Please wait before requesting new OTP",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0,
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your New Verification Code",
      text: `Your new verification code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
};

module.exports = {
  login,
  register,
  gtpOtps,
  resetPassword,
  Verifyotp,
  respassword,
  generateOTP,
  verifyOTP,
  resendOTP,
  fetch,
  // fetchOne,
};
