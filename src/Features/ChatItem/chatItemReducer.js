import { createSlice } from "@reduxjs/toolkit";

const chatItemReducer = createSlice({
  name: "chatItem",
  initialState: {
    conversation: {},
    room: "",
    members: [],
  },
  reducers: {
    selectedConversation: (state, action) => {
      state.conversation = action.payload;
    },
    selectedRoom: (state, action) => {
      state.room = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export default chatItemReducer;
