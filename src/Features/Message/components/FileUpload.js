import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "../index.module.less";
import { Avatar, Typography, Button } from "antd";
import { DownloadOutlined, PaperClipOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../Context/AuthProvider";
import FileDownload from "js-file-download";
import { formatRelative } from "date-fns/esm";
import Axios from "axios";
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
  // const handleDownloadFile = (name, url) => {
  //   Axios({
  //     url: "https://firebasestorage.googleapis.com/v0/b/chat-app-demo-1315c.appspot.com/o/images%2F0.30811957852256566%20-%20download.jpeg?alt=media&token=41b99c02-d63e-4ace-9ee4-99a78c2be2da",
  //     method: "GET",
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       // "Content-Type": "application/json",
  //     },
  //     responseType: "blob",
  //   }).then((res) => {
  //     FileDownload(res.data, name);
  //   });
  // };
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
                    160MB
                  </Typography.Text>
                </div>
                <a href={file.url} download>
                  <Button
                    type="link"
                    shape="circle"
                    icon={<DownloadOutlined />}
                    size={24}
                    // onClick={() => handleDownloadFile(file.name, file.url)}
                  />
                </a>
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
