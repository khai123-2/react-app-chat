import React from "react";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { Avatar, Collapse, List } from "antd";
import useFirestore from "../../Hooks/useFirestore";
import { useDispatch } from "react-redux";
import chatItemReducer from "../ChatItem/chatItemReducer";
import { auth } from "../../firebase/config";
const { Panel } = Collapse;
const cx = classNames.bind(styles);
const Contacts = () => {
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const currentUserCondition = React.useMemo(() => {
    return {
      fieldName: "listFriend",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);
  const handleSelectedUser = (user) => {
    dispatch(chatItemReducer.actions.selectedConversation(user));
  };
  const handleSelectedRoom = (room) => {
    dispatch(chatItemReducer.actions.selectedConversation(room));
  };
  const listFriend = useFirestore("users", currentUserCondition);
  const listRoom = useFirestore("rooms", roomsCondition);

  const friendsCount = listFriend.length;
  const roomCount = listRoom.length;
  return (
    <div className={cx("container")}>
      <Collapse
        ghost
        defaultActiveKey={["friends", "rooms"]}
        className={cx("panel-custom")}
      >
        <Panel header={`Danh sách bạn bè (${friendsCount})`} key="friends">
          <List
            itemLayout="horizontal"
            dataSource={listFriend}
            renderItem={(item) => (
              <List.Item className={cx("custom")}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.photoURL} size={48}>
                      {item.photoURL
                        ? ""
                        : item.displayName?.charAt(0)?.toUpperCase()}{" "}
                    </Avatar>
                  }
                  title={
                    <span style={{ fontSize: "16px" }}>{item.displayName}</span>
                  }
                  style={{
                    padding: "0",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectedUser(item)}
                />
              </List.Item>
            )}
          />
        </Panel>
        <Panel header={`Danh sách nhóm (${roomCount})`} key="rooms">
          <List
            itemLayout="horizontal"
            dataSource={listRoom}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.photoURL} size={48}>
                      {item.photoURL
                        ? ""
                        : item.roomName?.charAt(0)?.toUpperCase()}{" "}
                    </Avatar>
                  }
                  title={
                    <span style={{ fontSize: "16px" }}>{item.roomName}</span>
                  }
                  style={{
                    padding: "0",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectedRoom(item)}
                />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default React.memo(Contacts);
