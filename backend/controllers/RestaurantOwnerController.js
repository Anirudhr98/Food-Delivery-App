import bcrypt from 'bcryptjs';
import passport from 'passport';
import models from '../models/models.js';
const { RestaurantOwnerModel }  = models


export const registerOwner = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    // Check if the password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
      // Check if the email already exists
      const existingUser = await RestaurantOwnerModel.findOne({ owner_email:email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new RestaurantOwnerModel({
        owner_name:name,
        owner_email:email,
        owner_password: hashedPassword,
      });
      // Save the user to the database
      await newUser.save();
      res.status(201).json({ message: 'Restaurant Owner registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error registering restaurant owner', error: err.message });
    }
  };

export const loginOwner = (req, res, next) => {
    passport.authenticate('restaurant-owner-local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message });
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Logged in successfully', user });
      });
    })(req, res, next);
  };
  
  
export const logoutOwner = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  };