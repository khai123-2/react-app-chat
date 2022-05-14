import { createSlice } from "@reduxjs/toolkit";

const modalReducer = createSlice({
  name: "modal",
  initialState: {
    isInviteUserVisible: false,
    isAddroomVisible: false,
  },
  reducers: {
    setIsInviteUserVisible: (state, action) => {
      state.isInviteUserVisible = action.payload;
    },
    setIsAddroomVisible: (state, action) => {
      state.isAddroomVisible = action.payload;
    },
  },
});

export default modalReducer;
