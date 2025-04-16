import { createSlice } from "@reduxjs/toolkit";



const featureSlice = createSlice({
    name : "feature",
    initialState: {},
    reducers:{
        

    }
})


export const featureDetails = (state) => state.feature;
 export const {} = featureSlice.actions;
export default featureSlice.reducer;