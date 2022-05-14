import React, { useContext } from "react";
import { Layout, Menu, Avatar, Tooltip, Dropdown } from "antd";
import {
  MessageOutlined,
  ContactsOutlined,
  BellOutlined,
  SettingOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./index.module.less";
import { AuthContext } from "../../Context/AuthProvider";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { keyItemSelector } from "../../redux/selectors";
import sideMenuReducer from "./sideMenuReducer";
const { Sider } = Layout;

const SideMenu = () => {
  const keyItem = useSelector(keyItemSelector);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const selectedItem = ({ key }) => {
    dispatch(sideMenuReducer.actions.selectedItem(key));
  };
  const menu = (
    <Menu className={styles.menuSetting}>
      <Menu.Item key="4" title={false} icon={<UserOutlined />}>
        1st menu item
      </Menu.Item>
      <Menu.Item key="5" title={false} icon={<UserOutlined />}>
        2nd menu item
      </Menu.Item>
      <Menu.Item onClick={() => signOut(auth)} key="6" title={false}>
        <p style={{ color: "red", textAlign: "center" }}>Sign out</p>
      </Menu.Item>
    </Menu>
  );
  return (
    <Sider
      theme="light"
      className={styles.siderMenu}
      trigger={null}
      collapsible
      collapsed={true}
    >
      <div className={styles.navTabs}>
        <div className={styles.navTabsTop}>
          <div className={styles.sideMenuLogo}>
            <Tooltip title={user.displayName} placement="right">
              <Avatar size={48} src={user.photoURL}>
                {user.photoURL
                  ? ""
                  : user.displayName?.charAt(0)?.toUpperCase()}{" "}
              </Avatar>
            </Tooltip>
          </div>
          <Menu
            theme="light"
            className={styles.menu}
            selectedKeys={[keyItem]}
            mode="inline"
            onClick={selectedItem}
          >
            <Menu.Item
              key="chats"
              icon={<MessageOutlined style={{ fontSize: "24px" }} />}
            >
              Chats
            </Menu.Item>
            <Menu.Item
              key="groupChats"
              icon={<ContactsOutlined style={{ fontSize: "24px" }} />}
            >
              Danh bạ
            </Menu.Item>
            <Menu.Item
              key="listfriends"
              icon={<BellOutlined style={{ fontSize: "24px" }} />}
            >
              Thông báo
            </Menu.Item>
          </Menu>
        </div>
        <div className={styles.navTabsBottom}>
          <Menu
            theme="light"
            className={styles.menu}
            defaultSelectedKeys={false}
            mode="inline"
          >
            <Menu.Item
              key="1"
              icon={<GlobalOutlined style={{ fontSize: "24px" }} />}
            >
              Ngôn ngữ
            </Menu.Item>
            <Dropdown key="2" overlay={menu} trigger={["click"]}>
              <Menu.Item
                className={styles.settingButton}
                icon={<SettingOutlined style={{ fontSize: "24px" }} />}
              >
                Settings
              </Menu.Item>
            </Dropdown>
          </Menu>
        </div>
      </div>
    </Sider>
  );
};

export default SideMenu;
