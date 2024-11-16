import express from 'express';
import 'dotenv/config';
import passport from 'passport';
import { registerUser, loginUser, logoutUser, getUserDetailsById, updateUserDetails } from '../controllers/UserController.js';
import { getallrestaurants, getrestaurantbyid } from '../controllers/RestaurantsList.js';
import { create_new_restaurant, get_restaurant_by_id } from '../controllers/RestaurantOwnerController.js';
import { createorder, getOrders } from '../controllers/OrderController.js';

const UserRouter = express.Router();
const RestaurantOwnerRouter = express.Router();
const RestaurantsRouter = express.Router();
const OrdersRouter = express.Router();

// User routes
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', logoutUser);
UserRouter.get('/getUserDetailsById', getUserDetailsById);
UserRouter.put('/updateUserDetails', updateUserDetails);

// Google Authentication routes
UserRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

UserRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    // The user is automatically stored in the session via Passport
    const userId = req.user._id;  // You can access the user from req.user (session)
    res.redirect(`${process.env.FRONTEND_BASE_URL}?token=${userId}`);
  }
);

// Restaurant Owner routes
RestaurantOwnerRouter.post('/create_new_restaurant', create_new_restaurant);
RestaurantOwnerRouter.get('/get_restaurant_by_id', get_restaurant_by_id);

// Restaurant routes
RestaurantsRouter.get('/', getallrestaurants);
RestaurantsRouter.get('/:id', getrestaurantbyid);

// Order routes
OrdersRouter.post('/create_order', createorder);
OrdersRouter.post('/get_orders', getOrders);

export { UserRouter, RestaurantOwnerRouter, RestaurantsRouter, OrdersRouter };
