import { createSlice } from "@reduxjs/toolkit";

const notificationReducer = createSlice({
  name: "notification",
  initialState: {
    converReceive: [],
  },
  reducers: {
    getConverReceive: (state, action) => {
      state.converReceive = action.payload;
    },
  },
});

export default notificationReducer;
