import React, { useContext } from "react";
import { List, Avatar, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useSelector, useDispatch } from "react-redux";
import { FriendsIdSelector } from "../../redux/selectors";
import useFirestore from "../../Hooks/useFirestore";
import chatListReducer from "./chatListReducer";
import { getDocuments } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";
import modalReducer from "../Modal/ModalReducer";
//
const ListMessages = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const listFriendId = useSelector(FriendsIdSelector);

  const getConversationById = async (id) => {
    const conversations = await getDocuments("conversations", {
      fieldName: "members",
      operator: "array-contains",
      compareValue: id,
    });

    return conversations;
  };

  const handleSeletecdConvers = async (friendId) => {
    dispatch(chatListReducer.actions.setSelectedRoomId(""));
    const conversations = await getConversationById(friendId);
    const selectedConversation = conversations.find(myfilter);
    function myfilter(item) {
      return item.members.includes(friendId) && item.members.includes(user.uid);
    }

    //dispatch
    dispatch(chatListReducer.actions.selectedConver(selectedConversation));
    dispatch(chatListReducer.actions.selectedFriendId(friendId));
  };
  const membersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: listFriendId,
    };
  }, [listFriendId]);

  const roomCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);

  // get chat list friend
  const listChat = useFirestore("users", membersCondition);
  // get chat list friend
  const listRoom = useFirestore("rooms", roomCondition);

  const handleAddfriend = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(true));
  };
  const handleAddRoom = () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(true));
  };

  const handleSeletecdRoom = (roomId) => {
    dispatch(chatListReducer.actions.setSelectedRoomId(roomId));
  };
  return (
    <div>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={listChat}
          header={
            <div className={styles.headerChatList}>
              <h4>DIRECT MESSAGES</h4>{" "}
              <Button
                type="ghost"
                onClick={handleAddfriend}
                icon={<PlusOutlined />}
                size="small"
              />
            </div>
          }
          renderItem={(user) => (
            <List.Item
              key={user.email}
              style={{ padding: "0", height: "40", borderBottom: "0" }}
              className={styles.customListItem}
              onClick={() => handleSeletecdConvers(user.uid)}
            >
              <List.Item.Meta
                className={styles.customAvatar}
                avatar={
                  <Avatar size={29} src={user.photoURL}>
                    {user.photoURL
                      ? ""
                      : user.displayName?.charAt(0)?.toUpperCase()}{" "}
                  </Avatar>
                }
                title={user.displayName}
                style={{
                  padding: "5px 24px",
                  alignItems: "center",
                }}
              />
            </List.Item>
          )}
        />
      </div>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={listRoom}
          header={
            <div className={styles.headerChatList}>
              <h4>CHANNELS</h4>{" "}
              <Button
                type="ghost"
                onClick={handleAddRoom}
                icon={<PlusOutlined />}
                size="small"
              />
            </div>
          }
          renderItem={(room) => (
            <List.Item
              key={room.id}
              style={{ padding: "0", height: "40", borderBottom: "0" }}
              className={styles.customListItem}
              onClick={() => handleSeletecdRoom(room.id)}
            >
              <List.Item.Meta
                className={styles.customAvatar}
                avatar={
                  <Avatar size={29} src={room.photoURL}>
                    {room.photoURL
                      ? ""
                      : room.roomName?.charAt(0)?.toUpperCase()}{" "}
                  </Avatar>
                }
                title={room.roomName}
                style={{
                  padding: "5px 24px",
                  alignItems: "center",
                }}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ListMessages;
