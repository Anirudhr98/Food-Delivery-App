import express from 'express'
import { registerUser,loginUser,logoutUser } from '../controllers/UserController.js'
import { registerOwner,loginOwner,logoutOwner } from '../controllers/RestaurantOwnerController.js'
import { getallrestaurants } from '../controllers/RestaurantsList.js'

const UserRouter = express.Router()
const RestaurantOwnerRouter = express.Router()
const RestaurantsRouter = express.Router()


UserRouter.post('/register',registerUser)
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', logoutUser);

RestaurantOwnerRouter.post('/register',registerOwner)
RestaurantOwnerRouter.post('/login', loginOwner);
RestaurantOwnerRouter.get('/logout', logoutOwner);

RestaurantsRouter.get('/getallrestaurants',getallrestaurants)

export {UserRouter,RestaurantOwnerRouter,RestaurantsRouter}