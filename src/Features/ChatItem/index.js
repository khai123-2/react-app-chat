import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.less";
import { AuthContext } from "../../Context/AuthProvider";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import classNames from "classnames/bind";
import { Avatar } from "antd";
import { PushpinFilled } from "@ant-design/icons";
import Moment from "react-moment";
import moment from "moment";
const cx = classNames.bind(styles);
const ChatItem = ({ data, handleSelectedUser, conversation }) => {
  const { user } = useContext(AuthContext);
  const [lastMess, setLastMess] = useState({});
  useEffect(() => {
    let unsub;
    if (data.uid) {
      const id =
        user.uid > data.uid
          ? `${user.uid + data.uid}`
          : `${data.uid + user.uid}`;
      unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
        setLastMess(doc.data());
        return;
      });
    }
    if (data.roomId) {
      unsub = onSnapshot(doc(db, "lastMsg", data.roomId), (doc) => {
        setLastMess(doc.data());
        return;
      });
    }
    return () => unsub();
  }, [data.uid, data.roomId]);

  return (
    <div
      className={cx(`conv-item`)}
      id={
        conversation.displayName === data.displayName &&
        conversation.roomName === data.roomName &&
        conversation !== "" &&
        styles.selectedUser
      }
      onClick={() => handleSelectedUser(data)}
    >
      <div className={cx("conv-item-avatar")}>
        <Avatar src={data.photoURL} className={cx("avatar")}>
          {data.photoURL
            ? ""
            : data.displayName?.charAt(0)?.toUpperCase() ||
              data.roomName?.charAt(0)?.toUpperCase()}{" "}
        </Avatar>
      </div>
      <div className={cx("conv-item-content")}>
        <div className={cx("conv-item-title")}>
          <div className={cx("conv-item-title__name")}>
            <span>{data.displayName || data.roomName}</span>
            {lastMess?.from !== user.uid &&
              lastMess?.unread &&
              data?.id !== conversation?.id && (
                <small className={cx("unread")}>New</small>
              )}
          </div>
          <div className={cx("conv-item-title__more")}>
            <small>
              {lastMess ? (
                <Moment fromNow>{moment(lastMess.createAt).toDate()}</Moment>
              ) : (
                <Moment fromNow>{moment(data.createAt).toDate()}</Moment>
              )}
            </small>
          </div>
        </div>
        <div className={cx("conv-item-body")}>
          <div className={cx("conv-item-title__mess")}>
            {lastMess && (
              <span className="truncate">
                <strong>
                  {lastMess.from === user.uid
                    ? "Me:"
                    : lastMess.displayName
                    ? `${lastMess.displayName}:`
                    : ""}
                </strong>
                {lastMess.text}
              </span>
            )}
          </div>
          <div className={cx("conv-item-title__options")}>
            <PushpinFilled size="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatItem);
