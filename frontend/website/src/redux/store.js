import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import restaurantReducer from './restaurantSlice'


const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant : restaurantReducer,
  },
});

export default store;
