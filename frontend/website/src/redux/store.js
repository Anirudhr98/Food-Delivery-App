import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage is localStorage
import { combineReducers } from 'redux';
import userReducer from './userSlice';
import restaurantReducer from '../redux/restaurantSlice';
import cartReducer from '../redux/cartSlice';
import restaurantManagementReducer from '../redux/restaurantManagementSlice'; // Import the reducer, not the slice

// Define the persist config
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer,
  cart: cartReducer,
  restaurant_management: restaurantManagementReducer // Use the correct reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);

export default store;
