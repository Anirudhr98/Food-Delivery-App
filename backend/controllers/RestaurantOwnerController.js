import pkg from "bcryptjs";
const { hash } = pkg;
import mongoose from "mongoose";
import models from "../models/models.js";
const { UserModel, RestaurantModel, RestaurantItemModel } = models;

export const create_new_restaurant = async (req, res) => {
  const {
    name,
    email,
    password,
    confirm_password,
    restaurant_id,
    restaurant_name,
    restaurant_address,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !confirm_password ||
    !restaurant_id ||
    !restaurant_name ||
    !restaurant_address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate password match
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  33;
  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user (restaurant owner)
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      registered_as: "restaurant_owner",
    });

    // Save the user in the database within the session
    await newUser.save({ session });

    // Check if the restaurant ID already exists
    const existingRestaurant = await RestaurantModel.findOne({ restaurant_id });
    if (existingRestaurant) {
      throw new Error("Restaurant ID already exists");
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
    res.status(201).json({
      message: "Restaurant Owner and Restaurant registered successfully",
    });
  } catch (err) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error:", err.message);
    res.status(500).json({
      message: "Error registering restaurant owner and restaurant",
      error: err.message,
    });
  }
};

export const get_restaurant_by_id = async (req, res) => {
  const { restaurantIds } = req.query;

  try {
    // Fetch restaurants using the list of IDs
    const restaurants = await RestaurantModel.find({
      _id: { $in: restaurantIds },
    });

    // Check if any restaurants are found
    if (restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving restaurants", error: error.message });
  }
};

export const update_restaurant_details = async (req, res) => {
  const restaurant_id = req.params.id;
  const {
    restaurant_name,
    restaurant_image_url,
    restaurant_address,
    discount_offered,
    delivery_time,
  } = req.body;

  try {
    const restaurant = await RestaurantModel.findById(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.restaurant_name = restaurant_name || restaurant.restaurant_name;
    restaurant.restaurant_image_url =
      restaurant_image_url || restaurant.restaurant_image_url;
    restaurant.restaurant_address =
      restaurant_address || restaurant.restaurant_address;
    restaurant.discount_offered =
      discount_offered || restaurant.discount_offered;
    restaurant.delivery_time = delivery_time || restaurant.delivery_time;

    const updatedRestaurant = await restaurant.save();

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const add_new_item = async (req, res) => {
  const restaurant_id = req.params.id;
  const {
    item_name,
    item_image_url,
    item_description,
    item_price,
    cuisine_type,
    is_veg,
  } = req.body;

  try {
    console.log("Received request to add item:", req.body); // Log request body for debugging

    // Find the restaurant by ID
    const restaurant = await RestaurantModel.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create a new menu item
    const newItem = new RestaurantItemModel({
      item_name,
      item_image_url,
      item_description,
      item_price,
      cuisine_type,
      is_veg,
      restaurant: restaurant_id,
    });

    // Save the new item to the database
    await newItem.save();

    // Add the new item to the restaurant's list of items
    restaurant.restaurant_items.push(newItem);
    const updatedRestaurant = await restaurant.save();

    // Log successful operation
    console.log("New item added successfully:", newItem);

    // Respond with the newly created item
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    // Log the error for debugging
    console.error("Error adding new item:", error);

    // Send error response with more details
    res.status(500).json({
      message: "Unable to add new item",
      error: error.message,
      stack: error.stack, // Log stack trace for deeper insights
    });
  }
};

//Update Menu Item
export const update_menu_item = async (req, res) => {
  const {restaurant_id,item_id } = req.params;
  const {
    item_name,
    item_image_url,
    item_description,
    item_price,
    cuisine_type,
    is_veg,
  } = req.body;
  console.log(restaurant_id, item_id, req.body);
  try {
    // Update the specific menu item inside restaurant_items array
    const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
      {
        _id: restaurant_id,
        "restaurant_items._id": item_id, // Match the restaurant and the specific menu item
      },
      {
        $set: {
          "restaurant_items.$.item_name": item_name,
          "restaurant_items.$.item_image_url": item_image_url,
          "restaurant_items.$.item_description": item_description,
          "restaurant_items.$.item_price": item_price,
          "restaurant_items.$.cuisine_type": cuisine_type,
          "restaurant_items.$.is_veg": is_veg,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ message: "Menu item not found or restaurant does not exist" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const delete_menu_item = async (req, res) => {
  const { restaurant_id, item_id } = req.params;

  try {
    // Remove the specific menu item from the restaurant_items array
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurant_id,
      {
        $pull: {
          restaurant_items: { _id: item_id }, // Match and remove the menu item
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ message: "Menu item not found or restaurant does not exist" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
      updatedRestaurant,
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
