import React from "react";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import RightChat from "../../../Features/RightChat";
import SideMenu from "../../../Features/SideMenu";

const cx = classNames.bind(styles);
const Sidebar = () => {
  return (
    <div className={cx("sidebar-nav")}>
      <div className={cx("main-tab")}>
        <SideMenu />
      </div>
      <div className={cx("chat-leftsidebar")}>
        <RightChat />
      </div>
    </div>
  );
};

export default Sidebar;
