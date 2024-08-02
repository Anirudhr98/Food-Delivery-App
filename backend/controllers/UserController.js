import bcrypt from 'bcryptjs';
import passport from 'passport';
import models from '../models/models.js';
import mongoose from 'mongoose';

const {UserModel}  = models


export const registerUser = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  // Check if the password and confirm_password match
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  try {
    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged in successfully', user });
    });
  })(req, res, next);
};


export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

export const getUserDetailsById = async (req, res) => {
  const { userId } = req.query; // Get the user_id from the query parameters
  try {
    const user_details = await UserModel.findById(userId, '-password');
    if (!user_details) {
      return res.json({ message: 'User not found' });
    }
    res.json({ message: "User Details Found", user_details });
  } catch (err) {
    res.status(500).json({ message: 'Error finding user', error: err.message });
  }
};


export const updateUserDetails = async (req, res) => {
  const { name, address, _id } = req.body;
  try {
    const response = await UserModel.updateOne({ _id: _id }, { $set: { name: name, address: address } });
    
    if (response.nModified === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    const updatedUserDetails = await UserModel.findById(_id);
    res.status(200).json({"updatedUserDetails":updatedUserDetails});
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
