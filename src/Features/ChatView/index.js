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
import { Button, Tooltip, Form, Input, message, Progress } from "antd";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";
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
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
const cx = classNames.bind(styles);
const ChatView = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [userCurrent, setUserCurrent] = useState({});
  const [progress, setProgress] = useState(0);

  const [urls, setUrls] = useState([]);
  const dispatch = useDispatch();
  const {
    user: { uid, displayName },
  } = useContext(AuthContext);
  const selectedConvers = useSelector(selectedConversSelector);
  console.log("chatview");
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

  // const handleImageChange = async (e) => {
  //   const images = [];
  //   for (let i = 0; i < e.target.files.length; i++) {
  //     const newImage = e.target.files[i];
  //     newImage["id"] = Math.random();
  //     images.push(newImage);
  //   }

  //   Promise.all(
  //     images.map(async (image) => {
  //       const imgRef = await ref(storage, `images/${image.id} - ${image.name}`);
  //       const snap = await uploadBytes(imgRef, image);
  //       const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
  //       return dlUrl;
  //     })
  //   )
  //     .then(async (urls) => {
  //       if (selectedConvers.uid) {
  //         const id =
  //           uid > selectedConvers.uid
  //             ? `${uid + selectedConvers.uid}`
  //             : `${selectedConvers.uid + uid}`;

  //         await addDoc(collection(db, "messages", id, "chat"), {
  //           media: urls,
  //           from: uid,
  //           photoURL: userCurrent.photoURL,
  //           to: selectedConvers.uid,
  //           displayName,
  //           type: "user",
  //           createdAt: serverTimestamp(),
  //         });
  //         await setDocument(
  //           "lastMsg",
  //           {
  //             text: "image",
  //             from: uid,
  //             to: selectedConvers.uid,
  //             unread: true,
  //           },
  //           id
  //         );
  //       }
  //       if (selectedConvers.roomId) {
  //         //room messages
  //         await addDoc(
  //           collection(db, "messages", selectedConvers.roomId, "chat"),
  //           {
  //             media: urls,
  //             from: uid,
  //             photoURL: userCurrent.photoURL,
  //             to: selectedConvers.roomId,
  //             displayName,
  //             type: "room",
  //             createdAt: serverTimestamp(),
  //           }
  //         );

  //         await setDocument(
  //           "lastMsg",
  //           {
  //             text: "image",
  //             from: uid,
  //             to: selectedConvers.roomId,
  //             displayName,
  //             unread: true,
  //           },
  //           selectedConvers.roomId
  //         );
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };
  console.log(urls);
  const handleImageChange = (e) => {
    const promises = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      // setImages((prevState) => [...prevState, newImage]);
    }
  };
  // console.log(images);
  const handleOk = async (e) => {
    const imgs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      // setImages((prevState) => [...prevState, newImage]);
      imgs.push(newImage);
    }
    const promises = [];
    imgs.map((image) => {
      const storageRef = ref(storage, `images/${image.id} - ${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        }
      );
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
            media: urls,
            from: uid,
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
            media: urls,
            from: uid,
            photoURL: userCurrent.photoURL,
            to: selectedConvers.roomId,
            displayName,
            type: "room",
            createdAt: serverTimestamp(),
          });
        }
        setProgress(0);
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
          <Progress percent={progress} />
          <div className={cx("chat-view")}>
            <div className={cx("messages-page")}>
              <div className={cx("messages-view ")} ref={messageListRef}>
                {msgs.map((msg, i, messages) => (
                  <Message
                    currentUser={uid}
                    key={i}
                    msg={msg}
                    prevMess={messages[i - 1]?.from}
                  />
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
                    onChange={handleOk}
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
                    // onChange={(e) => setImg(e.target.files[0])}
                    type="file"
                    id="file"
                    accept="image/*"
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
                    <Tooltip title="Send image">
                      <Button type="text" icon={<SmileOutlined />} />
                    </Tooltip>
                    <Button
                      onClick={handleOk}
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
