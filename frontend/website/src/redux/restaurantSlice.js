import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedRestaurant: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setSelectedRestaurant: (state, action) => {
            state.selectedRestaurant = action.payload;  // Ensure you only mutate the draft state
        },
        clearSelectedRestaurant: (state) =>{
            state.selectedRestaurant = null;
        }
    },
});

export const { setSelectedRestaurant,clearSelectedRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;
