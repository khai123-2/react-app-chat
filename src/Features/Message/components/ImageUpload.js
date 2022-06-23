import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "../index.module.less";
import { Avatar, Typography, Image, Row, Col } from "antd";
import { AuthContext } from "../../../Context/AuthProvider";
const ImageUpload = ({ msg, prevMess }) => {
  const scrollRef = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  const { user } = useContext(AuthContext);

  return (
    <div
      className={`${styles.container} ${
        user.uid === msg.from ? styles.right : ""
      }`}
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
      <div className={styles.chatMessage}>
        <Typography.Text className={styles.authors}>
          {user.uid !== msg.from && msg.type === "room" ? msg.displayName : ""}
        </Typography.Text>
        <div
          className={`${styles.imageContainer} ${
            user.uid === msg.from ? styles.right : ""
          }`}
        >
          <Image.PreviewGroup
            preview={{
              visible,
              onVisibleChange: (vis) => setVisible(vis),
            }}
          >
            <Row gutter={[8, 8]}>
              {msg.imgs.map((photoURL, i) => (
                <Col span={8} key={i}>
                  <Image
                    key={i}
                    className={styles.customImage}
                    src={photoURL}
                  />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImageUpload);
