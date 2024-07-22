import express from 'express'
import passport from 'passport'
import { registerUser,loginUser,logoutUser } from '../controllers/UserController.js'
// import { registerOwner,loginOwner,logoutOwner } from '../controllers/RestaurantOwnerController.js'
import { getallrestaurants, getrestaurantbyid } from '../controllers/RestaurantsList.js'
// import{ seedingFunction } from '../controllers/seeding.js'

const UserRouter = express.Router()
const RestaurantOwnerRouter = express.Router()
const RestaurantsRouter = express.Router()
const SeedingRouter = express.Router()


UserRouter.post('/register',registerUser)
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', logoutUser);
UserRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
UserRouter.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    res.redirect('/'); // Redirect to your home page or dashboard
  }
);

// RestaurantOwnerRouter.post('/register',registerOwner)
// RestaurantOwnerRouter.post('/login', loginOwner);
// RestaurantOwnerRouter.get('/logout', logoutOwner);

RestaurantsRouter.get('/',getallrestaurants)
RestaurantsRouter.get('/:id',getrestaurantbyid)

export {UserRouter,RestaurantOwnerRouter,RestaurantsRouter,SeedingRouter}