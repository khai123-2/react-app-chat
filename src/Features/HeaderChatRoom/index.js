import React from "react";
import styles from "./index.module.less";
import { Avatar, Button, Tooltip } from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const HeaderChatRoom = ({ selectedRoom, members }) => {
  // console.log(selectedRoom);
  return (
    <>
      {selectedRoom ? (
        <>
          <div className={styles.headerInfor}>
            <div>
              <Avatar size={48} src={selectedRoom.photoURL}>
                {selectedRoom.photoURL
                  ? ""
                  : selectedRoom.roomName?.charAt(0)?.toUpperCase()}{" "}
              </Avatar>
            </div>
            <div className={styles.title}>
              <p className={styles.name}>{selectedRoom.roomName}</p>
              {/* <span style={{ fontSize: "12px" }}>Active</span> */}
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.uid}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <Tooltip title="add friends">
              <Button type="text" icon={<UserAddOutlined />} />
            </Tooltip>
            <Tooltip title="search">
              <Button type="text" icon={<SearchOutlined />} />
            </Tooltip>
            <Tooltip title="Call">
              <Button type="text" icon={<VideoCameraOutlined />} />
            </Tooltip>
            <Tooltip title="Chat infor">
              <Button type="text" icon={<InfoCircleOutlined />} />
            </Tooltip>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default HeaderChatRoom;
