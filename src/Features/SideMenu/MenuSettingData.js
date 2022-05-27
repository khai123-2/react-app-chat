import React from "react";
import { UserOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { Menu } from "antd";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
const cx = classNames.bind(styles);

const MenuSettingData = ({ handleOpenProfile }) => {
  return (
    <Menu className={cx("setting-items")}>
      <Menu.Item
        key="4"
        title={false}
        icon={<UserOutlined />}
        onClick={handleOpenProfile}
      >
        Account
      </Menu.Item>
      <Menu.Item onClick={() => signOut(auth)} key="6" title={false}>
        <p style={{ color: "red", textAlign: "center" }}>Sign out</p>
      </Menu.Item>
    </Menu>
  );
};
export default MenuSettingData;
