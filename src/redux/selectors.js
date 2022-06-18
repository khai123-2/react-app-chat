export const tabSelector = (state) => state.sideMenu.tab;
export const selectedConversSelector = (state) => state.chatItem.conversation;
export const selectedRoomSelector = (state) => state.chatItem.room;
export const isInviteUserVisibleSelector = (state) =>
  state.modal.isInviteUserVisible;
export const isInviteMemberVisibleSelector = (state) =>
  state.modal.isInviteMemberVisible;
export const changeMembersSelector = (state) => state.modal.changeMembers;
export const requestIdSelector = (state) =>
  state.listRequest.listRequestFriendId;
export const isAddroomVisibleSelector = (state) => state.modal.isAddroomVisible;
export const isEditProfileVisibleSelector = (state) =>
  state.modal.isEditProfileVisible;
export const changeImgSelector = (state) => state.modal.changeImg;
export const selectedInforChatSelector = (state) =>
  state.inforChat.colInforChat;
