import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
// import { AuthContext } from "../../Context/AuthProvider";
// import useFirestore from "../../Hooks/useFirestore";
// import { useDispatch } from "react-redux";
// import chatListReducer from "../../Features/ChatList/chatListReducer";
// import listRequestReducer from "../../Features/ListRequest/listRequestReducer";
function ChatPage() {
  //   const { user } = useContext(AuthContext);
  //   const dispatch = useDispatch();

  //   const requestUserCondition = React.useMemo(() => {
  //     return {
  //       fieldName: "receiveId",
  //       operator: "==",
  //       compareValue: user.uid,
  //     };
  //   }, [user.uid]);
  //   // Get conversations have receive id = current user  id
  //   const conversationsRequest = useFirestore(
  //     "conversations",
  //     requestUserCondition
  //   );
  //   const ConverCondition = React.useMemo(() => {
  //     return {
  //       fieldName: "members",
  //       operator: "array-contains",
  //       compareValue: user.uid,
  //     };
  //   }, [user.uid]);

  //   //Get list conversations
  //   const conversations = useFirestore("conversations", ConverCondition);
  //   const filterConversation = (data) => {
  //     const listFriend = data.filter(checkIsfriend);

  //     function checkIsfriend(item) {
  //       return (
  //         item.isFriend === true && item.members.find((id) => id !== user.uid)
  //       );
  //     }

  //     const listFriendId = listFriend.map(getFriendId);

  //     function getFriendId(item) {
  //       const friendId = item.members.find((id) => {
  //         return id !== user.uid;
  //       });
  //       return friendId;
  //     }
  //     return listFriendId;
  //   };

  //   const getRequestFriendId = (data) => {
  //     const listNotFriend = data.filter((item) => item.isFriend === false);
  //     const listRequestId = listNotFriend.map((item) =>
  //       item.members.find((id) => id !== user.uid)
  //     );
  //     return listRequestId;
  //   };

  //   const listFriendId = filterConversation(conversations);
  //   const listFriendRequestId = getRequestFriendId(conversationsRequest);

  //   //Dispatch
  //   dispatch(chatListReducer.actions.fetchListFriendId(listFriendId));
  //   dispatch(
  //     listRequestReducer.actions.getListFriendRequestId(listFriendRequestId)
  //   );
  return (
    <>
      <div
        className="container"
        style={{ height: "100%", overflow: "hidden", display: "flex" }}
      >
        <>
          <Sidebar />
        </>
        <>
          <ChatWindow />
        </>
      </div>
    </>
  );
}

export default ChatPage;
