// File: restaurantManagementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for updating restaurant details
export const updateRestaurantDetails = createAsyncThunk(
  "restaurantManagement/updateRestaurantDetails",
  async (updatedDetails, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/restaurant/${updatedDetails.restaurant_id}`, updatedDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const restaurantManagementSlice = createSlice({
  name: "restaurantManagement",
  initialState: {
    owner_id: null,
    restaurant_details: null,
    loading: false,
    error: null,
  },
  reducers: {
    setRestaurantDetails: (state, action) => {
      state.restaurant_details = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurant_details = action.payload;
      })
      .addCase(updateRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setRestaurantDetails } = restaurantManagementSlice.actions;
export default restaurantManagementSlice.reducer;
