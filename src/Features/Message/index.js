import React, { useContext } from "react";
import styles from "./index.module.less";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import { AuthContext } from "../../Context/AuthProvider";
const Message = ({ text, displayName, createdAt, photoURL, uid }) => {
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
        user.uid === uid ? styles.right : ""
      }`}
    >
      <div className={styles.avatar}>
        <Avatar size={40} src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
      </div>
      <div className={styles.wrapperMessage}>
        {/* <Typography.Text className={styles.author}>
          {displayName}
        </Typography.Text> */}
        <Typography.Text className={styles.content}>{text}</Typography.Text>
        <Typography.Text className={styles.date}>
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
    </div>
  );
};

export default Message;