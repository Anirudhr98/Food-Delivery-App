import { createSlice } from "@reduxjs/toolkit";

const restaurantManagementSlice = createSlice({
  name: "restaurantManagement",
  initialState: {
    owner_id: null,
    restaurant_details: null,
  },
  reducers: {
    setRestaurantDetails: (state, action) => {
      state.restaurant_details = action.payload;
    },
    addNewMenuItem:(state,action) =>{
      state.restaurant_details[0].restaurant_items.push(action.payload)
    },
    updateRestaurantDetails: (state, action) => {
      state.restaurant_details = action.payload;
    },
  }
});

export const { setRestaurantDetails,addNewMenuItem,updateRestaurantDetails } = restaurantManagementSlice.actions;
export default restaurantManagementSlice.reducer;
