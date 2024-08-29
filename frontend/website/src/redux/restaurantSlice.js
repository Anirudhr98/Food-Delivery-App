import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedRestaurant: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setSelectedRestaurant: (state, action) => {
            state.selectedRestaurant = action.payload; 
        },
        clearSelectedRestaurant: (state) =>{
            state.selectedRestaurant = null;
        }
    },
});

export const { setSelectedRestaurant,clearSelectedRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;
