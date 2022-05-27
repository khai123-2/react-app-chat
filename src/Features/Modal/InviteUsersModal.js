import React, { useState, useContext } from "react";
import { Modal, Form, Input, Alert } from "antd";
import { isInviteUserVisibleSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./ModalReducer";
import { setDocument, getDocuments } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";

const InviteUsersModal = () => {
  const { user } = useContext(AuthContext);
  const currentUserId = user.uid;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isInviteUserVisible = useSelector(isInviteUserVisibleSelector);
  const [isUserExists, setIsUserExists] = useState(true);
  const handleCancel = () => {
    dispatch(modalReducer.actions.setIsInviteUserVisible(false));
    form.resetFields();
  };

  const handleOk = async () => {
    if (form.getFieldValue().email) {
      dispatch(modalReducer.actions.setIsInviteUserVisible(false));
      try {
        const data = await getDocuments("users", {
          fieldName: "email",
          operator: "==",
          compareValue: form.getFieldValue().email,
        });

        if (data.length > 0 && data[0].uid !== currentUserId) {
          const receiveUserId = data[0].uid;
          const id =
            currentUserId > receiveUserId
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
          setIsUserExists(true);
          form.resetFields();
        } else {
          setIsUserExists(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    form.resetFields();
  };
  return (
    <div>
      <Modal
        title="Thêm bạn bè"
        visible={isInviteUserVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập tên email" />
          </Form.Item>
        </Form>
        {isUserExists ? (
          ""
        ) : (
          <Alert
            message="Người dùng không tồn tại mời điền lại"
            type="warning"
            showIcon
          />
        )}
      </Modal>
    </div>
  );
};

export default InviteUsersModal;
