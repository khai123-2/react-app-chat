import React from "react";
import {
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { tabSelector } from "../../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import ListMessages from "../ChatList";
import Notification from "../Notification";
import modalReducer from "../Modal/ModalReducer";
const cx = classNames.bind(styles);

function Render({ tab }) {
  if (tab === "chats") {
    return <ListMessages />;
  }
  if (tab === "contacts") {
    // return <Groups />;
    return <h1>condtacts</h1>;
  }
  if (tab === "notifications") {
    return <Notification />;
  }
}
const RightChatd = () => {
  const tab = useSelector(tabSelector);

  const dispatch = useDispatch();
  const handleAddfriend = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(true));
  };
  const handleAddRoom = () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(true));
  };
  return (
    <>
      <div className={cx("contact-search")}>
        <div className={cx("search-box")}>
          <Input
            style={{ borderRadius: "16px" }}
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm"
          />
        </div>
        <Button
          onClick={handleAddfriend}
          shape="circle"
          icon={<UserAddOutlined />}
          type="text"
        />
        <Button
          onClick={handleAddRoom}
          shape="circle"
          icon={<UsergroupAddOutlined />}
          type="text"
        />
      </div>
      <div className={cx("content")}>
        <Render tab={tab} />
      </div>
    </>
  );
};

export default RightChatd;
