import React, { useState } from "react";
import { Modal, Form, Input, Alert, Empty, Avatar, Button } from "antd";
import { isInviteUserVisibleSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./ModalReducer";
import { setDocument } from "../../firebase/service";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../../firebase/config";
import styles from "./index.module.less";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const InviteUsersModal = () => {
  const currentUser = auth.currentUser;
  // const currentUserId = currentUser.uid;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isInviteUserVisible = useSelector(isInviteUserVisibleSelector);
  const [listUsers, setListUsers] = useState([]);
  const handleCancel = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(false));
    setListUsers([]);
    form.resetFields();
  };

  const handleSearch = async () => {
    if (form.getFieldValue().email) {
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(
        usersCollectionRef,
        where("email", "==", form.getFieldValue().email)
      );
      const usersQuerySnapshot = await getDocs(userQuery);
      const listUsers = usersQuerySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const filterUser = listUsers.filter((user) => {
        return user.uid !== currentUser.uid;
      });

      setListUsers(filterUser);
    }

    return;
  };
  const handleSendRequest = async (receiveUser) => {
    form.resetFields();
    setListUsers([]);
    try {
      const currentUserId = currentUser.uid;
      const receiveUserId = receiveUser.uid;
      const id =
        currentUser.uid > receiveUser.uid
          ? `${currentUserId + receiveUserId}`
          : `${receiveUserId + currentUserId}`;
      await setDocument(
        "requests",
        {
          from: currentUserId,
          to: receiveUserId,
        },
        id
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <Modal
        title="Thêm bạn bè"
        visible={isInviteUserVisible}
        onCancel={handleCancel}
        onOk={handleSearch}
        width={350}
        footer={[
          <Button key="cancle" onClick={handleCancel}>
            Cancle
          </Button>,
          <Button key="submit" type="primary" onClick={handleSearch}>
            Find
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input email",
              },
            ]}
          >
            <Input placeholder="Nhập tên email" allowClear />
          </Form.Item>
        </Form>
        <div>
          {listUsers.length > 0 ? (
            <div>
              {listUsers?.map((item, i) => (
                <div
                  className={cx("findFirend-item")}
                  // onClick={() => handleSelectedUser(item)}
                  key={i}
                >
                  <div className={cx("findFirend-item-infor")}>
                    <div className={cx("findFirend-item-avatar")}>
                      <Avatar
                        src={item.photoURL}
                        className={cx("avatar")}
                        size={40}
                      >
                        {item.photoURL
                          ? ""
                          : item.displayName?.charAt(0)?.toUpperCase() ||
                            item.roomName?.charAt(0)?.toUpperCase()}{" "}
                      </Avatar>
                    </div>
                    <div className={cx("findFirend-item-name")}>
                      <span>{item.displayName || item.roomName}</span>
                    </div>
                  </div>
                  {!item.listFriend.includes(currentUser.uid) ? (
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      onClick={() => handleSendRequest(item)}
                    >
                      Add friend
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default InviteUsersModal;
