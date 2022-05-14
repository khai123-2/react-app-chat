import React, { useContext, useRef, useState, useEffect } from "react";
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
import { ConverSelector } from "../../redux/selectors";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/service";
import useFirestore from "../../Hooks/useFirestore";
const ChatView = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const conversationSelected = useSelector(ConverSelector);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleOnSubmit = async () => {
    await addDocument("messages", {
      text: inputValue,
      uid,
      photoURL,
      conversationId: conversationSelected.id,
      displayName,
    });

    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: "conversationId",
      operator: "==",
      compareValue: conversationSelected.id,
    }),
    [conversationSelected.id]
  );

  const messages = useFirestore("messages", condition);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
  return (
    <>
      <div className={styles.messagePage}>
        <div className={styles.messageView}>
          {messages.map((mess) => (
            <Message
              uid={mess.uid}
              key={mess.displayName}
              text={mess.text}
              displayName={mess.displayName}
              photoURL={mess.photoURL}
              createdAt={mess.createAt}
            />
          ))}
        </div>
      </div>
      <div className="chatEnter">
        <div className={styles.ztoolbar}>
          <Tooltip title="Send image">
            <Button type="text" icon={<FileImageOutlined />} />
          </Tooltip>
          <Upload>
            <Tooltip title="Send file">
              <Button type="text" icon={<LinkOutlined />} />
            </Tooltip>
          </Upload>
        </div>
        <div className={styles.chatInput}>
          <Form className={styles.formCustom} form={form}>
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
    </>
  );
};

export default ChatView;
