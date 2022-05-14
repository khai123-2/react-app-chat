import React from "react";
import { Row, Col, Input, Button } from "antd";
import styles from "./index.module.less";
import {
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import ListMessages from "../ChatList";
import Notification from "../Notification";
import { useSelector } from "react-redux";
import { keyItemSelector } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import modalReducer from "../Modal/ModalReducer";
function Render({ keyMenuItem }) {
  if (keyMenuItem === "chats") {
    return <ListMessages />;
  }
  if (keyMenuItem === "groupChats") {
    // return <Groups />;
    return <h1>haha</h1>;
  }
  if (keyMenuItem === "listfriends") {
    // return <ListContact />;
    return <Notification />;
  }
}
const RightChat = () => {
  const keyItem = useSelector(keyItemSelector);

  const dispatch = useDispatch();
  const handleAddfriend = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(true));
  };

  const handleAddRoom = () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(true));
  };
  return (
    <div className={styles.rightChat}>
      <div className={styles.contactSearch}>
        <Row style={{ width: "280px", alignItems: "center" }}>
          <Col span={18}>
            <div className={styles.searchBox}>
              <Input
                style={{ borderRadius: "16px" }}
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm"
              />
            </div>
          </Col>
          <Col span={3}>
            <Button
              onClick={handleAddfriend}
              shape="circle"
              icon={<UserAddOutlined />}
              type="text"
            />
          </Col>
          <Col span={3}>
            <Button
              onClick={handleAddRoom}
              shape="circle"
              icon={<UsergroupAddOutlined />}
              type="text"
            />
          </Col>
        </Row>
      </div>
      <div className={styles.content}>
        <Render keyMenuItem={keyItem} />
      </div>
    </div>
  );
};

export default RightChat;
