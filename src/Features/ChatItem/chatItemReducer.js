import { createSlice } from "@reduxjs/toolkit";

const chatItemReducer = createSlice({
  name: "chatItem",
  initialState: {
    conversation: {},
  },
  reducers: {
    selectedConversation: (state, action) => {
      state.conversation = action.payload;
    },
  },
});

export default chatItemReducer;
