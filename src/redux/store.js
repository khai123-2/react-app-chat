import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import sideMenu from "../Features/SideMenu/sideMenuReducer";
import chatItem from "../Features/ChatItem/chatItemReducer";
import modal from "../Features/Modal/ModalReducer";
import listRequest from "../Features/ListRequest/listRequestReducer";
import notification from "../Features/Notification/notificationReducer";
import inforChatReducer from "../Features/InforChat/inForChatReducer";
const store = configureStore({
  reducer: {
    sideMenu: sideMenu.reducer,
    chatItem: chatItem.reducer,
    modal: modal.reducer,
    listRequest: listRequest.reducer,
    notification: notification.reducer,
    inforChat: inforChatReducer.reducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
