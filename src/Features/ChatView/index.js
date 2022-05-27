import React, { useContext, useRef, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import Message from "../../Features/Message";
import styles from "./index.module.less";
import { Button, Tooltip, Upload, Form, Input } from "antd";
import {
  FileImageOutlined,
  LinkOutlined,
  SmileOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectedConversSelector } from "../../redux/selectors";
import { AuthContext } from "../../Context/AuthProvider";
import { setDocument } from "../../firebase/service";
import HeaderChat from "../HeaderChat";
import HeaderChatRoom from "../HeaderChatRoom";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const ChatView = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  //Send message
  const handleOnSubmit = async () => {
    //Check is user messages
    if (selectedConvers.uid) {
      const id =
        uid > selectedConvers.uid
          ? `${uid + selectedConvers.uid}`
          : `${selectedConvers.uid + uid}`;

      await addDoc(collection(db, "messages", id, "chat"), {
        text: inputValue,
        from: uid,
        photoURL,
        to: selectedConvers.uid,
        displayName,
        type: "user",
        createdAt: serverTimestamp(),
      });
      await setDocument(
        "lastMsg",
        {
          text: inputValue,
          from: uid,
          to: selectedConvers.uid,
          unread: true,
        },
        id
      );
    }
    if (selectedConvers.roomId) {
      //room messages
      await addDoc(collection(db, "messages", selectedConvers.roomId, "chat"), {
        text: inputValue,
        from: uid,
        photoURL,
        to: selectedConvers.roomId,
        displayName,
        type: "room",
        createdAt: serverTimestamp(),
      });

      await setDocument(
        "lastMsg",
        {
          text: inputValue,
          from: uid,
          to: selectedConvers.roomId,
          displayName,
          unread: true,
        },
        selectedConvers.roomId
      );
    }
    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, []);
  const selectedConvers = useSelector(selectedConversSelector);
  const isValue = Object.keys(selectedConvers).length !== 0;

  //Get messages
  if (selectedConvers.uid) {
    const id =
      uid > selectedConvers.uid
        ? `${uid + selectedConvers.uid}`
        : `${selectedConvers.uid + uid}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  }
  if (selectedConvers.roomId) {
    const msgsRef = collection(db, "messages", selectedConvers.roomId, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));
    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  }
  return (
    <>
      {isValue ? (
        <div className={cx("main-chat")}>
          <div className={cx("header-chat")}>
            {selectedConvers.displayName ? (
              <HeaderChat user={selectedConvers} />
            ) : (
              <HeaderChatRoom room={selectedConvers} />
            )}
          </div>
          <div className={cx("chat-view")}>
            <div className={cx("messages-page")}>
              <div className={cx("messages-view ")}>
                {msgs.map((msg, i) => (
                  <Message currentUser={uid} key={i} msg={msg} />
                ))}
              </div>
            </div>
            <div className={cx("chat-enter")}>
              <div className={cx("ztoolbar")}>
                <Tooltip title="Send image">
                  <Button type="text" icon={<FileImageOutlined />} />
                </Tooltip>
                <Upload>
                  <Tooltip title="Send file">
                    <Button type="text" icon={<LinkOutlined />} />
                  </Tooltip>
                </Upload>
              </div>
              <div className={cx("chat-input")}>
                <Form className={cx("form-custom")} form={form}>
                  <Form.Item name="message">
                    <Input
                      ref={inputRef}
                      placeholder="Enter your messages..."
                      bordered={false}
                      autoComplete="off"
                      onChange={handleInputChange}
                      onPressEnter={handleOnSubmit}
                    />
                  </Form.Item>
                  <div>
                    <Tooltip title="Send image">
                      <Button type="text" icon={<SmileOutlined />} />
                    </Tooltip>
                    <Button
                      onClick={handleOnSubmit}
                      size="large"
                      style={{ borderRadius: "6px" }}
                      type="primary"
                      icon={<SendOutlined />}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatView;
