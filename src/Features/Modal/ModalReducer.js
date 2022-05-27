import { createSlice } from "@reduxjs/toolkit";

const modalReducer = createSlice({
  name: "modal",
  initialState: {
    isInviteUserVisible: false,
    isAddroomVisible: false,
    isEditProfileVisible: false,
    changeImg: "",
  },
  reducers: {
    setIsInviteUserVisible: (state, action) => {
      state.isInviteUserVisible = action.payload;
    },
    setIsAddroomVisible: (state, action) => {
      state.isAddroomVisible = action.payload;
    },
    setIsEditProfileVisible: (state, action) => {
      state.isEditProfileVisible = action.payload;
    },
    setChangeImg: (state, action) => {
      state.changeImg = action.payload;
    },
  },
});

export default modalReducer;
