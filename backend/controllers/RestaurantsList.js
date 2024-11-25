// import cloudinary from '../cloudinaryConfig.js';
import models from '../models/models.js';
const  {RestaurantModel} = models;

// export const getallrestaurants = async (req, res) => {
//   try {
//     const restaurants_list = await RestaurantModel.find();
//     res.json({ message: 'Restaurants found', restaurants_list });
//   } catch (error) {
//     res.json({ message: 'Error fetching restaurants', error: error.message });
//   }
// };

export const getallrestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({
        message: 'Invalid page or limit query parameters.',
      });
    }

    // Skip documents and limit results for pagination
    const restaurants_list = await RestaurantModel.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total count for calculating the total number of pages
    const totalRestaurants = await RestaurantModel.countDocuments();
    const totalPages = Math.ceil(totalRestaurants / limitNumber);

    res.json({
      message: 'Restaurants found',
      restaurants_list,
      currentPage: pageNumber,
      totalPages,
      totalRestaurants,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching restaurants',
      error: error.message,
    });
  }
};


export const getrestaurantbyid = async (req,res)  => {
  try{
    const restaurant_detail = await RestaurantModel.findById(req.params.id);
    res.json({ message:"Restaurant found", restaurant_detail});
  }catch(error){
    res.json({ message: 'Error fetching restaurant', error: error.message });
  }
}

export const create_new_restaurant = async (req, res) => {
  try {
    const newRestaurantData = req.body;
    const userRegisteredAs = newRestaurantData.user_registered_as;

    if (userRegisteredAs === 'restaurant_owner') {
      // Validate the required fields
      if (
        newRestaurantData.restaurant_name &&
        newRestaurantData.restaurant_address &&
        newRestaurantData.cuisines_available &&
        newRestaurantData.restaurant_image_url &&
        Array.isArray(newRestaurantData.restaurant_items) &&
        newRestaurantData.restaurant_items.length > 0 &&
        newRestaurantData.restaurant_items.every(item => item.item_name && item.item_price && item.cuisine_type)
      ) {
        // Ensure restaurant_items are of the correct type
        const restaurantItems = newRestaurantData.restaurant_items.map(item => new mongoose.model('RestaurantItem', restaurantitemsSchema)(item));
        // Prepare the restaurant data
        const newRestaurant = new mongoose.model('Restaurant', restaurantSchema)({
          ...newRestaurantData,
          restaurant_items: restaurantItems
        });
        await newRestaurant.save();
        return res.json({ message: 'Restaurant created successfully!' });
      } else {
        return res.status(400).json({ message: 'All required fields must be filled and restaurant items must be valid.' });
      }
    } else {
      return res.status(403).json({ message: 'You are not authorized to create a restaurant.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error creating restaurant', error: error.message });
  }
};


export const update_restaurant_by_id = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const updatedDetails = req.body;

    // Validate the restaurant ID
    if (!mongoose.Types.ObjectId.isValid(restaurant_id)) {
      return res.status(400).json({ message: "Invalid restaurant ID." });
    }

    // Update the restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurant_id,
      { $set: updatedDetails },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    return res.status(200).json({ message: "Restaurant updated successfully!", data: updatedRestaurant });
  } catch (error) {
    return res.status(500).json({ message: "Error updating restaurant", error: error.message });
  }
};