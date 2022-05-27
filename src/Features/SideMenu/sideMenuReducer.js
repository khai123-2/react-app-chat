import { createSlice } from "@reduxjs/toolkit";

const sideMenuReducer = createSlice({
  name: "sideMenu",
  initialState: {
    tab: "chats",
  },
  reducers: {
    selectedtab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export default sideMenuReducer;
