import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name :"",
    email : "",
    role : "",
    password : ""
}


const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {

    }
})

export const authDetails = (state) => state.auth;
export const {} = authSlice.actions;
export default authSlice.reducer;