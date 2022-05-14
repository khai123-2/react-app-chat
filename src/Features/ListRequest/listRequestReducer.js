import { createSlice } from "@reduxjs/toolkit";

const listRequestReducer = createSlice({
  name: "listRequest",
  initialState: {
    listRequestFriendId: [],
  },
  reducers: {
    getListFriendRequestId: (state, action) => {
      state.listRequestFriendId = action.payload;
    },
  },
});

export default listRequestReducer;
