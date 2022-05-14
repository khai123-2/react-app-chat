import { configureStore } from "@reduxjs/toolkit";
import sideMenu from "../Features/Sidemenu/sideMenuReducer";
import chatList from "../Features/ChatList/chatListReducer";
import modal from "../Features/Modal/ModalReducer";
import listRequest from "../Features/ListRequest/listRequestReducer";
import notification from "../Features/Notification/notificationReducer";
const store = configureStore({
  reducer: {
    sideMenu: sideMenu.reducer,
    chatList: chatList.reducer,
    modal: modal.reducer,
    listRequest: listRequest.reducer,
    notification: notification.reducer,
  },
});

export default store;
