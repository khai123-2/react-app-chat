import React from "react";
import ChatView from "../../../Features/ChatView";
import { Row, Col } from "antd";
import styles from "./index.module.less";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const ChatWindow = () => {
  return (
    <div className={cx("chat-window")}>
      <Row>
        <Col span={17}>
          <ChatView />
        </Col>
        <Col span={7}>
          <h1>h1h1h</h1>
        </Col>
      </Row>
    </div>
  );
};

export default ChatWindow;
