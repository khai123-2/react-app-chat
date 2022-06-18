import React, { useState } from "react";
import styles from "./index.module.less";
import { Avatar, Tooltip, Button } from "antd";
import {
  InfoCircleOutlined,
  InfoCircleFilled,
  UserAddOutlined,
} from "@ant-design/icons";
import useFirestore from "../../Hooks/useFirestore";
import classNames from "classnames/bind";
import inforChatReducer from "../InforChat/inForChatReducer";
import modalReducer from "../Modal/ModalReducer";
import { useDispatch, useSelector } from "react-redux";
import { changeMembersSelector } from "../../redux/selectors";
const cx = classNames.bind(styles);
const HeaderChatRoom = ({ room }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const changeMembers = useSelector(changeMembersSelector);
  const handleInviteMember = () => {
    dispatch(modalReducer.actions.setIsInviteMemberVisible(true));
  };
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
  const membersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: room.members,
    };
  }, [room.members]);
  const members = useFirestore("users", membersCondition);
  return (
    <>
      <div className={cx("header-infor")}>
        <div>
          <Avatar size={48} src={room.photoURL}>
            {room.photoURL ? "" : room.roomName?.charAt(0)?.toUpperCase()}{" "}
          </Avatar>
        </div>
        <div className={cx("title")}>
          <p className={cx("name")}>{room.roomName}</p>
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
      <div className={cx("button-group")} onClick={handleSelectInforChat}>
        <Tooltip title="add friends">
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={handleInviteMember}
          />
        </Tooltip>
        {active ? (
          <InfoCircleFilled style={{ fontSize: "20px", cursor: "pointer" }} />
        ) : (
          <InfoCircleOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        )}
      </div>
    </>
  );
};

export default React.memo(HeaderChatRoom);
