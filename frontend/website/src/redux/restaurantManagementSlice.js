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
    }
  }
});

export const { setRestaurantDetails } = restaurantManagementSlice.actions;
export default restaurantManagementSlice.reducer;
