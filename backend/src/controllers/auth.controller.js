import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from '../models/user.model.js';

export const signup = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields must be provided" });
      }
  
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        hashedPassword,
      });
  
      await newUser.save();
      generateToken(newUser._id, res);
  
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
      });
    } catch (error) {
      console.error("Error in signup | auth controller", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};
  
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields must be provided" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.hashedPassword
      );
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      generateToken(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error("Error in login | auth controller", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfuly" });
    } catch (error) {
        console.error("Error in logout | auth controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth | auth controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};