import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import Message from "../../Features/Message";
import styles from "./index.module.less";
import { Button, Tooltip, Form, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectedConversSelector } from "../../redux/selectors";
import { AuthContext } from "../../Context/AuthProvider";
import { setDocument } from "../../firebase/service";
import HeaderChat from "../HeaderChat";
import HeaderChatRoom from "../HeaderChatRoom";
import classNames from "classnames/bind";
import chatItemReducer from "../ChatItem/chatItemReducer";
import Image from "../../components/svg/Image";
import File from "../../components/svg/File";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const cx = classNames.bind(styles);

const ChatView = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [userCurrent, setUserCurrent] = useState({});

  const dispatch = useDispatch();

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const {
    user: { uid, displayName },
  } = useContext(AuthContext);
  const selectedConvers = useSelector(selectedConversSelector);
  if (selectedConvers) {
    dispatch(chatItemReducer.actions.selectedConversation(selectedConvers));
  }
  const isValue = Object.keys(selectedConvers).length !== 0;
  const handleInputChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [inputValue]
  );
  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUserCurrent(docSnap.data());
      }
    });
  }, [msgs]);

  const handleFileUpload = async (e) => {
    const files = [];
    const fileNames = [];
    const fileSizes = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      files.push(newFile);
      fileNames.push(newFile.name);
      fileSizes.push(formatBytes(newFile.size));
    }

    const promises = [];
    files.forEach((image) => {
      const storageRef = ref(storage, `files/${image.id} - ${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on("state_changed", (error) => {
        console.log(error);
      });
    });

    Promise.all(promises)
      .then((uploadTaskSnapshotsArray) => {
        const promises = [];
        uploadTaskSnapshotsArray.forEach((uploadTaskSnapshot) => {
          promises.push(
            getDownloadURL(ref(storage, uploadTaskSnapshot.ref.fullPath))
          );
        });
        return Promise.all(promises);
      })
      .then((urls) => {
        const files = urls.map((url, i) => {
          return { name: fileNames[i], url, size: fileSizes[i] };
        });
        if (selectedConvers.uid) {
          const id =
            uid > selectedConvers.uid
              ? `${uid + selectedConvers.uid}`
              : `${selectedConvers.uid + uid}`;

          addDoc(collection(db, "messages", id, "chat"), {
            files: files,
            from: uid,
            typeMess: "file",
            photoURL: userCurrent.photoURL,
            to: selectedConvers.uid,
            displayName,
            type: "user",
            createdAt: serverTimestamp(),
          });
          setDocument(
            "lastMsg",
            {
              text: "file",
              from: uid,
              to: selectedConvers.uid,
              unread: true,
            },
            id
          );
        }
        if (selectedConvers.roomId) {
          //room messages
          addDoc(collection(db, "messages", selectedConvers.roomId, "chat"), {
            files: files,
            from: uid,
            typeMess: "file",
            photoURL: userCurrent.photoURL,
            to: selectedConvers.roomId,
            displayName,
            type: "room",
            createdAt: serverTimestamp(),
          });

          setDocument(
            "lastMsg",
            {
              text: "file",
              from: uid,
              to: selectedConvers.roomId,
              displayName,
              unread: true,
            },
            selectedConvers.roomId
          );
        }
      })
      .catch((err) => console.log(err));
  };
  const handleImageUpload = async (e) => {
    const imgs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      imgs.push(newImage);
    }
    const promises = [];

    imgs.forEach((image) => {
      const storageRef = ref(storage, `images/${image.id} - ${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on("state_changed", (error) => {
        console.log(error);
      });
    });

    Promise.all(promises)
      .then((uploadTaskSnapshotsArray) => {
        const promises = [];
        uploadTaskSnapshotsArray.forEach((uploadTaskSnapshot) => {
          promises.push(
            getDownloadURL(ref(storage, uploadTaskSnapshot.ref.fullPath))
          );
        });
        return Promise.all(promises);
      })
      .then((urls) => {
        if (selectedConvers.uid) {
          const id =
            uid > selectedConvers.uid
              ? `${uid + selectedConvers.uid}`
              : `${selectedConvers.uid + uid}`;

          addDoc(collection(db, "messages", id, "chat"), {
            imgs: urls,
            from: uid,
            typeMess: "image",
            photoURL: userCurrent.photoURL,
            to: selectedConvers.uid,
            displayName,
            type: "user",
            createdAt: serverTimestamp(),
          });
          setDocument(
            "lastMsg",
            {
              text: "image",
              from: uid,
              to: selectedConvers.uid,
              unread: true,
            },
            id
          );
        }
        if (selectedConvers.roomId) {
          //room messages
          addDoc(collection(db, "messages", selectedConvers.roomId, "chat"), {
            imgs: urls,
            from: uid,
            typeMess: "image",
            photoURL: userCurrent.photoURL,
            to: selectedConvers.roomId,
            displayName,
            type: "room",
            createdAt: serverTimestamp(),
          });
          setDocument(
            "lastMsg",
            {
              text: "image",
              from: uid,
              to: selectedConvers.roomId,
              displayName,
              unread: true,
            },
            selectedConvers.roomId
          );
        }
      })
      .catch((err) => console.log(err));
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
        typeMess: "text",
        from: uid,
        photoURL: userCurrent.photoURL,
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
        typeMess: "text",
        photoURL: userCurrent.photoURL,
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

  //Get messages
  useEffect(() => {
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
      const msgsRef = collection(
        db,
        "messages",
        selectedConvers.roomId,
        "chat"
      );
      const q = query(msgsRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (querySnapshot) => {
        let msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMsgs(msgs);
      });
    }
  }, [selectedConvers]);
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
          {/* <Progress percent={progress} /> */}
          <div className={cx("chat-view")}>
            <div className={cx("messages-page")}>
              <div className={cx("messages-view ")} ref={messageListRef}>
                {msgs.map((msg, i, messages) => (
                  <Message key={i} msg={msg} prevMess={messages[i - 1]?.from} />
                ))}
              </div>
            </div>
            <div className={cx("chat-enter")}>
              <div className={cx("ztoolbar")}>
                <Tooltip title="Send image">
                  <label htmlFor="img">
                    <Image />
                  </label>
                  <input
                    onChange={handleImageUpload}
                    type="file"
                    id="img"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </Tooltip>
                <Tooltip title="Send file">
                  <label htmlFor="file">
                    <File />
                  </label>
                  <input
                    onChange={handleFileUpload}
                    type="file"
                    id="file"
                    accept="*"
                    multiple
                    style={{ display: "none" }}
                  />
                </Tooltip>
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
