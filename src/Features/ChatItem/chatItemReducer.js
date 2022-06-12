import { createSlice } from "@reduxjs/toolkit";

const chatItemReducer = createSlice({
  name: "chatItem",
  initialState: {
    conversation: {},
    room: "",
  },
  reducers: {
    selectedConversation: (state, action) => {
      state.conversation = action.payload;
    },
    selectedRoom: (state, action) => {
      state.room = action.payload;
    },
  },
});

export default chatItemReducer;
