import React from "react";
import HeaderChat from "../../Features/HeaderChat";
import HeaderChatRoom from "../../Features/HeaderChatRoom";
import styles from "./index.module.less";
import ChatView from "../../Features/ChatView";
import { useSelector } from "react-redux";
import { selectedRoomIdSelector } from "../../redux/selectors";
import useFirestore from "../../Hooks/useFirestore";
const MainChat = () => {
  const selectedRoomId = useSelector(selectedRoomIdSelector);

  //get room selected
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "id",
      operator: "==",
      compareValue: selectedRoomId,
    };
  }, [selectedRoomId]);
  const rooms = useFirestore("rooms", roomsCondition);

  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  //get members in  room
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore("users", usersCondition);
  return (
    <div className={styles.mainChat}>
      <div className={styles.header}>
        {selectedRoomId ? (
          <HeaderChatRoom selectedRoom={selectedRoom} members={members} />
        ) : (
          <HeaderChat />
        )}
      </div>
      <div className={styles.chatView}>
        <ChatView />
      </div>
    </div>
  );
};

export default MainChat;
