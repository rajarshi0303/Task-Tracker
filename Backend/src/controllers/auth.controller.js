import User from "../models/user.model.js";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
    });

    const savedUser = await user.save();

    const payload = { id: savedUser._id };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Save refresh token to DB
    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 mins
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "User registered successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Update refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save();

    console.log("loggedin");

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 mins
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenHandler = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const payload = { id: user._id };
    const newAccess = createAccessToken(payload);
    const newRefresh = createRefreshToken(payload);

    user.refreshToken = newRefresh;
    await user.save();

    res
      .cookie("accessToken", newAccess, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefresh, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Tokens refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
