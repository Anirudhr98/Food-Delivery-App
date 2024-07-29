import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total_price : 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
        const existingItem = state.items.find(item => item._id === action.payload._id);
        if (existingItem){
        existingItem.quantity +=1
      }else{
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total_price = state.items.reduce((total, item) => total + (item.item_price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = []
      state.total_price = 0
    },
    decreaseCartQuantity: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      existingItem.quantity -=1
      state.total_price = state.total_price - existingItem.item_price
    }
    },
  });

export const { addToCart,clearCart,decreaseCartQuantity } = cartSlice.actions;

export default cartSlice.reducer;
