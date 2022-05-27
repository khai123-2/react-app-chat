import React from "react";
import styles from "./index.module.less";
import { Avatar, Button, Tooltip } from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import useFirestore from "../../Hooks/useFirestore";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const HeaderChatRoom = ({ room }) => {
  const membersCondition = React.useMemo(
    () => ({
      fieldName: "uid",
      operator: "in",
      compareValue: room.members,
    }),
    [room.members]
  );
  const members = useFirestore("users", membersCondition);
  return (
    <>
      <div className={cx("header-infor")}>
        <div>
          <Avatar size={48} src={room.photoURL}>
            {room.photoURL ? "" : room.roomName?.charAt(0)?.toUpperCase()}{" "}
          </Avatar>
        </div>
        <div className={cx("title")}>
          <p className={cx("name")}>{room.roomName}</p>
          <Avatar.Group size="small" maxCount={2}>
            {members.map((member) => (
              <Tooltip title={member.displayName} key={member.uid}>
                <Avatar src={member.photoURL}>
                  {member.photoURL
                    ? ""
                    : member.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </div>
      </div>
      <div className={cx("button-group")}>
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
  );
};

export default HeaderChatRoom;
