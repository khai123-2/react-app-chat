export const tabSelector = (state) => state.sideMenu.tab;
export const selectedConversSelector = (state) => state.chatItem.conversation;
export const isInviteUserVisibleSelector = (state) =>
  state.modal.isInviteUserVisible;
export const requestIdSelector = (state) =>
  state.listRequest.listRequestFriendId;
export const isAddroomVisibleSelector = (state) => state.modal.isAddroomVisible;
export const isEditProfileVisibleSelector = (state) =>
  state.modal.isEditProfileVisible;
export const changeImgSelector = (state) => state.modal.changeImg;
