import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "../index.module.less";
import { Avatar, Typography, Button } from "antd";
import { FileZipOutlined, DownloadOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../Context/AuthProvider";
import FileDownload from "js-file-download";
import Axios from "axios";
const FileUpload = ({ msg, prevMess }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  const { user } = useContext(AuthContext);

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
      <div className={styles.wrapperMessage}>
        {/* <Typography.Text className={styles.author}>
            {user.uid !== msg.from && msg.type === "room"
              ? msg.displayName
              : ""}
          </Typography.Text>
          <Typography.Text className={styles.content}>
            {msg.text}
          </Typography.Text>
          <Typography.Text className={styles.date}>
            {formatDate(msg.createdAt?.seconds)}
          </Typography.Text> */}
        {msg.files.map((file, i) => {
          return (
            <div key={i}>
              <FileZipOutlined style={{ width: "24px" }} />
              <Typography.Text className={styles.author}>
                {file.name}
              </Typography.Text>
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
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(FileUpload);
