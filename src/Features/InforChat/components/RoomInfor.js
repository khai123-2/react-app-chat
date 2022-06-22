import React from "react";
import styles from "../index.module.less";
import classNames from "classnames/bind";
import { Avatar, Typography, Collapse, List } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import useFirestore from "../../../Hooks/useFirestore";
import modalReducer from "../../Modal/ModalReducer";
import { useDispatch, useSelector } from "react-redux";
import { membersSelector } from "../../../redux/selectors";
import inforCharReducer from "../inForChatReducer";
const { Panel } = Collapse;
const cx = classNames.bind(styles);
const RoomInfor = ({ room }) => {
  const dispatch = useDispatch();
  const members = useSelector(membersSelector);
  const memberCount = members.length;
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: members,
    };
  }, [members]);
  const handleOpenLeaveRoom = (roomId) => {
    dispatch(modalReducer.actions.setIsLeaveRoomVisible(true));
    dispatch(inforCharReducer.actions.setRoomId(roomId));
  };
  const membersRoom = useFirestore("users", usersCondition);
  return (
    <div className={cx("container")}>
      <div className={cx("header-infor")}>
        <div className={cx("header-infor-avatar")}>
          <Avatar size={72} src={room.photoURL}>
            {room.photoURL ? "" : room.roomName?.charAt(0)?.toUpperCase()}{" "}
          </Avatar>
        </div>
        <div className={cx("header-infor-name")}>
          <Typography.Title level={5}>{room.roomName}</Typography.Title>
        </div>
      </div>
      <div className={cx("list-section")}>
        <Collapse ghost defaultActiveKey={["1"]} className={styles.panelCustom}>
          <Panel header={`Danh sách thành viên (${memberCount})`} key="room">
            <List
              itemLayout="horizontal"
              dataSource={membersRoom}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.photoURL}>
                        {item.photoURL
                          ? ""
                          : item.displayName?.charAt(0)?.toUpperCase()}{" "}
                      </Avatar>
                    }
                    title={item.displayName}
                    style={{
                      padding: "0",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  />
                </List.Item>
              )}
            />
          </Panel>
          <Panel header="Hỗ trợ" key="settings">
            <div
              className={cx("options-item")}
              onClick={() => handleOpenLeaveRoom(room.id)}
            >
              {" "}
              <LogoutOutlined style={{ color: "#ff4d4f" }} />
              <Typography.Text style={{ marginLeft: "5px" }} type="danger">
                Rời nhóm
              </Typography.Text>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(RoomInfor);
