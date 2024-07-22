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
