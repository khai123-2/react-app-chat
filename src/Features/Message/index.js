import React, { useContext } from "react";
import styles from "./index.module.less";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import { AuthContext } from "../../Context/AuthProvider";
const Message = ({ msg, currentUser }) => {
  const { user } = useContext(AuthContext);
  function formatDate(seconds) {
    let formattedDate = "";

    if (seconds) {
      formattedDate = formatRelative(new Date(seconds * 1000), new Date());

      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
  }
  return (
    <div
      className={`${styles.conversation} ${
        user.uid === msg.from ? styles.right : ""
      }`}
    >
      <div className={styles.avatar}>
        <Avatar size={40} src={msg.photoURL}>
          {msg.photoURL ? "" : msg.displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
      </div>
      <div className={styles.wrapperMessage}>
        <Typography.Text className={styles.author}>
          {user.uid !== msg.from && msg.type === "room" ? msg.displayName : ""}
        </Typography.Text>
        <Typography.Text className={styles.content}>{msg.text}</Typography.Text>
        <Typography.Text className={styles.date}>
          {formatDate(msg.createdAt?.seconds)}
        </Typography.Text>
      </div>
    </div>
  );
};

export default Message;
