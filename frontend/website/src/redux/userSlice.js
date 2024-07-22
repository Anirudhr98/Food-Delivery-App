import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        userDetails: null
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userDetails = null;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
    }
})

export const {login, logout,setUserDetails} =userSlice.actions;
export default userSlice.reducer;