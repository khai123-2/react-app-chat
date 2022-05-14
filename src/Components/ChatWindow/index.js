import React from "react";
import MainChat from "./MainChat";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import {
  FriendIdSelector,
  selectedRoomIdSelector,
} from "../../redux/selectors";
const ChatWindow = () => {
  const friendId = useSelector(FriendIdSelector);
  const selectedRoomId = useSelector(selectedRoomIdSelector);
  return (
    <>
      {friendId || selectedRoomId ? (
        <Row>
          <Col span={16}>
            <MainChat />
          </Col>
          <Col span={8} style={{ display: "none" }}>
            <h1>h1h1h</h1>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col
            span={24}
            style={{
              backgroundImage:
                "url('https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cd.png')",
              height: "100vh",
              backgroundColor: "#f2f2f2",
            }}
          ></Col>
        </Row>
      )}
    </>
  );
};

export default ChatWindow;
