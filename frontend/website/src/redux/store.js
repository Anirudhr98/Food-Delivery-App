import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import restaurantReducer from './restaurantSlice'
import cartReducer from '../redux/cartSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant : restaurantReducer,
    cart : cartReducer
  },
});

export default store;
