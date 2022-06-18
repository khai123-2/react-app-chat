import { createSlice } from "@reduxjs/toolkit";

const inforChatReducer = createSlice({
  name: "inforChat",
  initialState: {
    colInforChat: {
      colChatView: 24,
      isDisplay: "none",
    },
  },
  reducers: {
    setSelectedInforChat: (state, action) => {
      state.colInforChat = action.payload;
    },
  },
});

export default inforChatReducer;
