import React from "react";
import styles from "./index.module.less";
import { Avatar, Button, Tooltip, Badge } from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { FriendIdSelector } from "../../redux/selectors";
import useFirestore from "../../Hooks/useFirestore";
const HeaderChat = () => {
  const friendId = useSelector(FriendIdSelector);
  const friendIdCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: friendId,
    };
  }, [friendId]);
  // get chat list friend
  const friends = useFirestore("users", friendIdCondition);
  const friend = friends[0];
  return (
    <>
      {friend ? (
        <>
          <div className={styles.headerInfor}>
            <div>
              <Badge
                dot
                color="green"
                offset={[-8, 43]}
                style={{ width: "10px", height: "10px" }}
              >
                <Avatar size={48} src={friend.photoURL}>
                  {friend.photoURL
                    ? ""
                    : friend.displayName?.charAt(0)?.toUpperCase()}{" "}
                </Avatar>
              </Badge>
            </div>
            <div className={styles.title}>
              <p className={styles.name}>{friend.displayName}</p>
              <span style={{ fontSize: "12px" }}>Active</span>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <Tooltip title="add friends">
              <Button type="text" icon={<UserAddOutlined />} />
            </Tooltip>
            <Tooltip title="search">
              <Button type="text" icon={<SearchOutlined />} />
            </Tooltip>
            <Tooltip title="Call">
              <Button type="text" icon={<VideoCameraOutlined />} />
            </Tooltip>
            <Tooltip title="Chat infor">
              <Button type="text" icon={<InfoCircleOutlined />} />
            </Tooltip>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default HeaderChat;
