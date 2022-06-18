import React, { useState } from "react";
import styles from "./index.module.less";
import { Avatar, Badge } from "antd";
import { InfoCircleOutlined, InfoCircleFilled } from "@ant-design/icons";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import inforChatReducer from "../InforChat/inForChatReducer";
const cx = classNames.bind(styles);

////
const HeaderChat = ({ user }) => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const handleSelectInforChat = () => {
    if (!active) {
      dispatch(
        inforChatReducer.actions.setSelectedInforChat({
          colChatView: 17,
          isDisplay: "block",
        })
      );
    } else {
      dispatch(
        inforChatReducer.actions.setSelectedInforChat({
          colChatView: 24,
          isDisplay: "none",
        })
      );
    }
    setActive(!active);
  };
  return (
    <>
      <div className={cx("header-infor")}>
        <div>
          <Badge
            dot
            color={user.isOnline ? "green" : "yellow"}
            offset={[-8, 43]}
            style={{ width: "10px", height: "10px" }}
          >
            <Avatar size={48} src={user.photoURL}>
              {user.photoURL ? "" : user.displayName?.charAt(0)?.toUpperCase()}{" "}
            </Avatar>
          </Badge>
        </div>
        <div className={cx("title")}>
          <p className={cx("name")}>{user.displayName}</p>
          <span style={{ fontSize: "12px" }}></span>
        </div>
      </div>
      <div className={cx("button-group")} onClick={handleSelectInforChat}>
        {active ? (
          <InfoCircleFilled style={{ fontSize: "20px", cursor: "pointer" }} />
        ) : (
          <InfoCircleOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        )}
      </div>
    </>
  );
};

export default React.memo(HeaderChat);
