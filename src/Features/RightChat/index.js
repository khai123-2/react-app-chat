import React, { useState, useContext, useCallback } from "react";
import {
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { tabSelector } from "../../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import ListMessages from "../ChatList";
import Notification from "../Notification";
import modalReducer from "../Modal/ModalReducer";
import chatItemReducer from "../ChatItem/chatItemReducer";
import { Avatar } from "antd";
import { query, where, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
const cx = classNames.bind(styles);

const RightChatd = () => {
  const tab = useSelector(tabSelector);
  const [search, setSearch] = useState([]);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const handleAddfriend = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(true));
  };
  const handleAddRoom = () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(true));
  };

  const renderChildrenTab = () => {
    const menuTab = tab;
    switch (menuTab) {
      case "chats":
        return <ListMessages />;
      case "contacts":
        return <h1>condtacts</h1>;
      case "notifications":
        return <Notification />;
      default:
        return null;
    }
  };
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleSearch = async (e) => {
    const { value } = e.target;
    // setSearch(value);
    // setVale(val);
    const usersCollectionRef = collection(db, "users");
    const userQuery = query(
      usersCollectionRef,
      where("listFriend", "array-contains", user.uid)
    );
    const usersQuerySnapshot = await getDocs(userQuery);
    const listUsers = usersQuerySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    ////--------------------------------------------------
    const roomsCollectionRef = collection(db, "rooms");
    const roomQuery = query(
      roomsCollectionRef,
      where("members", "array-contains", user.uid)
    );
    const roomsQuerySnapshot = await getDocs(roomQuery);
    const listRooms = roomsQuerySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    const data = listUsers.concat(listRooms);
    const newData = data.filter((item) => {
      return item.keywords.includes(value);
    });

    setSearch(newData);
  };
  const handleClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSelectedUser = (conversation) => {
    dispatch(chatItemReducer.actions.selectedConversation(conversation));
    setVisible(true);
  };
  const optimisedVersion = useCallback(debounce(handleSearch), []);
  return (
    <>
      <div className={cx("contact-search")}>
        <Form form={form} className={cx("search-box")}>
          <Form.Item name="search">
            <Input
              style={{ borderRadius: "16px" }}
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm"
              onChange={optimisedVersion}
              onClick={() => setVisible(true)}
            />
          </Form.Item>
        </Form>
        <div
          className={cx("button-group")}
          id={visible ? styles.disappear : undefined}
        >
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
        <div
          className={cx("close-button")}
          id={visible ? styles.appear : undefined}
        >
          <Button type="text" size="small" shape="circle" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
      <div
        className={cx("recent-search-content")}
        // style={visible && { display: "block" }}
        id={visible ? styles.appear : undefined}
      >
        {search?.map((item, i) => (
          <div
            className={cx("conv-item")}
            onClick={() => handleSelectedUser(item)}
            key={i}
          >
            <div className={cx("conv-item-avatar")}>
              <Avatar src={item.photoURL} className={cx("avatar")} size={48}>
                {item.photoURL
                  ? ""
                  : item.displayName?.charAt(0)?.toUpperCase() ||
                    item.roomName?.charAt(0)?.toUpperCase()}{" "}
              </Avatar>
            </div>
            <div className={cx("conv-item-content")}>
              <span>{item.displayName || item.roomName}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        className={cx("content")}
        id={visible ? styles.disappear : undefined}
      >
        {renderChildrenTab()}
      </div>
    </>
  );
};

export default RightChatd;
