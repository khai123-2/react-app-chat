import React, { useContext, useRef, useEffect } from "react";
import styles from "../index.module.less";
import { Avatar, Typography, Button } from "antd";
import { DownloadOutlined, PaperClipOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../Context/AuthProvider";
import { formatRelative } from "date-fns/esm";
import { saveAs } from "file-saver";
const FileUpload = ({ msg, prevMess }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
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
  const handleDownloadFile = (url) => {
    saveAs(url);
  };
  return (
    <div
      className={`${styles.conversation} ${
        user.uid === msg.from ? styles.right : ""
      }`}
      ref={scrollRef}
    >
      <div className={styles.avatar}>
        {prevMess && msg.from === prevMess ? (
          <div style={{ width: "40px" }}></div>
        ) : (
          <Avatar size={40} src={msg.photoURL}>
            {msg.photoURL ? "" : msg.displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        )}
      </div>
      <div
        className={`${styles.wrapperMessage} ${
          user.uid === msg.from ? styles.me : styles.friend
        }`}
      >
        <Typography.Text className={styles.author}>
          {user.uid !== msg.from && msg.type === "room" ? msg.displayName : ""}
        </Typography.Text>
        {msg.files.map((file, i) => {
          return (
            <div className={styles.messagesCard} key={i}>
              <div className={styles.messagesContainer}>
                <PaperClipOutlined className={styles.icon} />
                <div className={styles.messagesContent}>
                  <Typography.Text className={styles.fileName}>
                    {file.name}
                  </Typography.Text>
                  <Typography.Text className={styles.author}>
                    {file.size}
                  </Typography.Text>
                </div>
                <Button
                  type="link"
                  shape="circle"
                  icon={<DownloadOutlined />}
                  size={24}
                  onClick={() => handleDownloadFile(file.url)}
                />
              </div>
            </div>
          );
        })}
        <Typography.Text className={styles.date}>
          {formatDate(msg.createdAt?.seconds)}
        </Typography.Text>
      </div>
    </div>
  );
};

export default React.memo(FileUpload);
