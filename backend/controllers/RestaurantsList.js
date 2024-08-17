// import cloudinary from '../cloudinaryConfig.js';
import models from '../models/models.js';
const  {RestaurantModel} = models;

export const getallrestaurants = async (req, res) => {
  try {
    const restaurants_list = await RestaurantModel.find();
    res.json({ message: 'Restaurants found', restaurants_list });
  } catch (error) {
    res.json({ message: 'Error fetching restaurants', error: error.message });
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