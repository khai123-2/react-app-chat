import React from "react";
import styles from "./index.module.less";
import { Avatar, Button, Tooltip, Badge } from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

////
const HeaderChat = ({ user }) => {
  return (
    <>
      <div className={cx("header-infor")}>
        <div>
          <Badge
            dot
            color="green"
            offset={[-8, 43]}
            style={{ width: "10px", height: "10px" }}
          >
            <Avatar size={48} src={user.photoURL}>
              {user.photoURL ? "" : user.displayName?.charAt(0)?.toUpperCase()}{" "}
            </Avatar>
          </Badge>
        </div>
        <div className={cx("title")}>
          <p className={cx("name")}>{user.displayName}</p>
          <span style={{ fontSize: "12px" }}>Active</span>
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

export default HeaderChat;
