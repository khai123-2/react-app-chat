import React, { useContext, useEffect, useState } from "react";
import { SettingOutlined, SettingFilled } from "@ant-design/icons";
import { Tooltip, Avatar, Dropdown } from "antd";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { SideMenutopData } from "./SideMenuData";
import MenuSettingData from "./MenuSettingData";
import { useSelector, useDispatch } from "react-redux";
import { tabSelector, changeImgSelector } from "../../redux/selectors";
import sideMenuReducer from "./sideMenuReducer";
import { AuthContext } from "../../Context/AuthProvider";
import modalReducer from "../Modal/ModalReducer";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
const cx = classNames.bind(styles);
const SideMenu = () => {
  const { user } = useContext(AuthContext);
  // dispatch action select tab
  const tab = useSelector(tabSelector);
  const img = useSelector(changeImgSelector);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState({});
  const handleSelectedTab = (tab) => {
    dispatch(sideMenuReducer.actions.selectedtab(tab));
  };
  const handleOpenProfile = () => {
    dispatch(modalReducer.actions.setIsEditProfileVisible(true));
  };
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setCurrentUser(doc.data());
    });

    return () => unsub();
  }, [user.uid, img]);
  return (
    <>
      <div>
        <div className={cx("nav_tabs_user")}>
          <Tooltip title={currentUser?.displayName} placement="right">
            <Avatar
              size={48}
              src={currentUser?.photoURL}
              style={{ cursor: "pointer" }}
            >
              {currentUser?.photoURL
                ? ""
                : currentUser?.displayName?.charAt(0)?.toUpperCase()}{" "}
            </Avatar>
          </Tooltip>
        </div>
        <div className={cx("nav_tabs_top")}>
          <ul className={cx("tablist")}>
            {SideMenutopData.map((val, key) => {
              return (
                <li
                  id={tab === val.tab ? styles.active : ""}
                  className={cx("leftbar-tab")}
                  key={key}
                  onClick={() => handleSelectedTab(val.tab)}
                >
                  <Tooltip title={val.title} placement="right">
                    {tab === val.tab ? val.iconFilled : val.iconOutlined}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={cx("nav_tabs_bottom")}>
        <ul className={cx("tablist")}>
          <Dropdown
            key="settings"
            overlay={<MenuSettingData handleOpenProfile={handleOpenProfile} />}
            trigger={["click"]}
          >
            <div
              tabIndex="1"
              id={styles.settingsTab}
              className={cx("leftbar-tab")}
            >
              <Tooltip title="Cài đặt" placement="right">
                {tab === "settings" ? <SettingFilled /> : <SettingOutlined />}
              </Tooltip>
            </div>
          </Dropdown>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
