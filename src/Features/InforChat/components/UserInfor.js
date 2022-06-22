import React from "react";
import useFirestore from "../../../Hooks/useFirestore";
import styles from "../index.module.less";
import classNames from "classnames/bind";
import { Avatar, Typography, Collapse, List } from "antd";
import { auth } from "../../../firebase/config";
const { Panel } = Collapse;
const cx = classNames.bind(styles);
const UserInfor = ({ user }) => {
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains-any",
      compareValue: [auth.currentUser.uid, user.uid],
    };
  }, [user.uid]);

  const rooms = useFirestore("rooms", roomsCondition);

  const filterRooms = rooms.filter((item) => {
    return item.members.includes(user.uid, auth.currentUser.uid);
  });
  const roomsCount = filterRooms.length;
  return (
    <div className={cx("container")}>
      <div className={cx("header-infor")}>
        <div className={cx("header-infor-avatar")}>
          <Avatar size={72} src={user.photoURL}>
            {user.photoURL ? "" : user.displayName?.charAt(0)?.toUpperCase()}{" "}
          </Avatar>
        </div>
        <div className={cx("header-infor-name")}>
          <Typography.Title level={5}>{user.displayName}</Typography.Title>
        </div>
      </div>
      <div className={cx("list-section")}>
        <Collapse ghost defaultActiveKey={["1"]} className={styles.panelCustom}>
          <Panel header={`Danh sách nhóm chung (${roomsCount})`} key="room">
            <List
              itemLayout="horizontal"
              dataSource={filterRooms}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.photoURL}>
                        {item.photoURL
                          ? ""
                          : item.roomName?.charAt(0)?.toUpperCase()}{" "}
                      </Avatar>
                    }
                    title={item.roomName}
                    style={{
                      padding: 0,
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

export default React.memo(UserInfor);
