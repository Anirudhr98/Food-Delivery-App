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
    }
  });

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
