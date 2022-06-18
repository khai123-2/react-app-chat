import React from "react";
import styles from "../index.module.less";
import classNames from "classnames/bind";
import { Avatar, Typography, Collapse, List } from "antd";
import useFirestore from "../../../Hooks/useFirestore";
const { Panel } = Collapse;
const cx = classNames.bind(styles);
const RoomInfor = ({ room }) => {
  const memberCount = room.members.length;
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: room.members,
    };
  }, [room.members]);
  const members = useFirestore("users", usersCondition);
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
              dataSource={members}
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
          <Panel header="Hỗ trợ" key="settings"></Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(RoomInfor);
