import React from "react";
import RoomInfor from "./components/RoomInfor";
import UserInfor from "./components/UserInfor";
import { useSelector, useDispatch } from "react-redux";
import { selectedConversSelector } from "../../redux/selectors";
import chatItemReducer from "../ChatItem/chatItemReducer";

const InforChat = () => {
  const dispatch = useDispatch();
  const selectedConvers = useSelector(selectedConversSelector);
  if (selectedConvers) {
    dispatch(chatItemReducer.actions.selectedConversation(selectedConvers));
  }
  const isValue = Object.keys(selectedConvers).length !== 0;
  return (
    <>
      {isValue ? (
        <>
          {selectedConvers.displayName ? (
            <UserInfor user={selectedConvers} />
          ) : (
            <RoomInfor room={selectedConvers} />
          )}
        </>
      ) : (
        <div style={{ display: "none" }}>h1</div>
      )}
    </>
  );
};

export default React.memo(InforChat);
