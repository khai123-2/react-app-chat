import React from "react";
import { Row, Col } from "antd";
import SideMenu from "../../Features/Sidemenu";
import RightChat from "../../Features/RightChat";

const Sidebar = () => {
  return (
    <div style={{ backgroundColor: "#ffff", color: "white", height: "100vh" }}>
      <Row>
        <Col span={5}>
          <SideMenu />
        </Col>
        <Col span={19}>
          <RightChat />
        </Col>
      </Row>
    </div>
  );
};

export default Sidebar;
