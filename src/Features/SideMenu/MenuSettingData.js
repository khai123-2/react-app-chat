import React, { useContext } from "react";
import { UserOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { Menu } from "antd";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
const cx = classNames.bind(styles);

const MenuSettingData = ({ handleOpenProfile }) => {
  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
  };
  return (
    <Menu className={cx("setting-items")}>
      <Menu.Item
        key="4"
        title={false}
        icon={<UserOutlined />}
        onClick={handleOpenProfile}
      >
        Thông tin tài khoản
      </Menu.Item>
      <Menu.Item onClick={handleSignout} key="6" title={false}>
        <p style={{ color: "red", textAlign: "center" }}>Đăng xuất</p>
      </Menu.Item>
    </Menu>
  );
};
export default MenuSettingData;
