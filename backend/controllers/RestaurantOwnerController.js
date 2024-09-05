import pkg from 'bcryptjs';
const { hash } = pkg;
import mongoose from 'mongoose';
import models from '../models/models.js';
const { UserModel, RestaurantModel } = models;

export const create_new_restaurant = async (req, res) => {
    const { name, email, password, confirm_password, restaurant_id, restaurant_name, restaurant_address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirm_password || !restaurant_id || !restaurant_name || !restaurant_address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password match
    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create a new user (restaurant owner)
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            registered_as: 'restaurant_owner',
        });

        // Save the user in the database within the session
        await newUser.save({ session });

        // Check if the restaurant ID already exists
        const existingRestaurant = await RestaurantModel.findOne({ restaurant_id });
        if (existingRestaurant) {
            throw new Error('Restaurant ID already exists');
        }

        // Create a new restaurant and link it to the owner
        const newRestaurant = new RestaurantModel({
            restaurant_id,
            restaurant_name,
            restaurant_address,
            owner: newUser._id, // Associate the restaurant with the owner
        });

        // Save the restaurant in the database within the session
        await newRestaurant.save({ session });

        // Add the restaurant ID to the user's restaurants_owned field
        await UserModel.findByIdAndUpdate(
            newUser._id, 
            { $push: { restaurants_owned: newRestaurant._id } },
            { new: true, session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Restaurant Owner and Restaurant registered successfully' });
    } catch (err) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        console.error("Error:", err.message);
        res.status(500).json({ message: 'Error registering restaurant owner and restaurant', error: err.message });
    }
};


export const get_restaurant_by_id = async (req, res) => {
    const { restaurantIds } = req.query;
  
    try {
      // Fetch restaurants using the list of IDs
      const restaurants = await RestaurantModel.find({ _id: { $in: restaurantIds } });
  
      // Check if any restaurants are found
      if (restaurants.length === 0) {
        return res.status(404).json({ message: 'No restaurants found' });
      }
  
      res.status(200).json(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
      res.status(500).json({ message: 'Error retrieving restaurants', error: error.message });
    }
  };
  