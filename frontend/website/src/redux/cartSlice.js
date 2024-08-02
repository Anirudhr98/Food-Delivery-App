import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total_price: 0,
  address: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (action.payload._id) {
        const existingItem = state.items.find(item => item._id === action.payload._id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
      }
      if (action.payload.address) {
        state.address = action.payload.address;
      }
      state.total_price = state.items.reduce((total, item) => total + (item.item_price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total_price = 0;
      state.address = null;
    },
    decreaseCartQuantity: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item._id !== action.payload._id);
      } else {
        existingItem.quantity -= 1;
      }
      state.total_price = state.total_price - existingItem.item_price;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { addToCart, clearCart, decreaseCartQuantity, setAddress } = cartSlice.actions;

export default cartSlice.reducer;
