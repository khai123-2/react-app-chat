import { createSlice } from "@reduxjs/toolkit";

const sideMenuReducer = createSlice({
  name: "chatList",
  initialState: {
    listFriendId: [],
    friendId: "",
    conversationSelected: {},
    selectedRoomId: "",
  },
  reducers: {
    fetchListFriendId: (state, action) => {
      state.listFriendId = action.payload;
    },
    selectedFriendId: (state, action) => {
      state.friendId = action.payload;
    },
    selectedConver: (state, action) => {
      state.conversationSelected = action.payload;
    },
    setSelectedRoomId: (state, action) => {
      state.selectedRoomId = action.payload;
    },
  },
});

export default sideMenuReducer;
