export const keyItemSelector = (state) => state.sideMenu.keyItem;
export const FriendsIdSelector = (state) => state.chatList.listFriendId;
export const FriendIdSelector = (state) => state.chatList.friendId;
export const isInviteUserVisibleSelector = (state) =>
  state.modal.isInviteUserVisible;
export const requestIdSelector = (state) =>
  state.listRequest.listRequestFriendId;
export const ConverSelector = (state) => state.chatList.conversationSelected;
export const isAddroomVisibleSelector = (state) => state.modal.isAddroomVisible;
export const selectedRoomIdSelector = (state) => state.chatList.selectedRoomId;
