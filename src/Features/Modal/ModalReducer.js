import { createSlice } from "@reduxjs/toolkit";

const modalReducer = createSlice({
  name: "modal",
  initialState: {
    isInviteUserVisible: false,
    isAddroomVisible: false,
    isEditProfileVisible: false,
    changeImg: "",
    isInviteMemberVisible: false,
    changeMembers: false,
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
    setIsInviteMemberVisible: (state, action) => {
      state.isInviteMemberVisible = action.payload;
    },
    setChangeMembers: (state, action) => {
      state.changeMembers = action.payload;
    },
  },
});

export default modalReducer;
