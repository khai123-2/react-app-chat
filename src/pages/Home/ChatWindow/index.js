import React from "react";
import ChatView from "../../../Features/ChatView";
import InforChat from "../../../Features/InforChat";
import { Row, Col } from "antd";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { selectedInforChatSelector } from "../../../redux/selectors";
const cx = classNames.bind(styles);
const ChatWindow = () => {
  const colSpan = useSelector(selectedInforChatSelector);
  return (
    <div className={cx("chat-window")}>
      <Row>
        <Col span={colSpan.colChatView}>
          <ChatView />
        </Col>
        <Col span={7} style={{ display: colSpan.isDisplay }}>
          <InforChat />
        </Col>
      </Row>
    </div>
  );
};

export default ChatWindow;
