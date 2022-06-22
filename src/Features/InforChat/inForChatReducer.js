import { createSlice } from "@reduxjs/toolkit";

const inforChatReducer = createSlice({
  name: "inforChat",
  initialState: {
    colInforChat: {
      colChatView: 24,
      isDisplay: "none",
    },
    roomId: "",
  },
  reducers: {
    setSelectedInforChat: (state, action) => {
      state.colInforChat = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
  },
});

export default inforChatReducer;
