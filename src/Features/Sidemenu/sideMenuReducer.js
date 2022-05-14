import { createSlice } from "@reduxjs/toolkit";

const sideMenuReducer = createSlice({
  name: "sideMenu",
  initialState: {
    keyItem: "chats",
  },
  reducers: {
    selectedItem: (state, action) => {
      state.keyItem = action.payload;
    },
  },
});

export default sideMenuReducer;
