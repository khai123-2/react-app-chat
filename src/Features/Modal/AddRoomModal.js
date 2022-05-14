import React, { useContext } from "react";
import { Modal, Form, Input } from "antd";
import { isAddroomVisibleSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./ModalReducer";
import { v4 as uuidv4 } from "uuid";
import { setDocument } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";

const AddRoomModal = () => {
  const { user } = useContext(AuthContext);
  const isAddRoomVisible = useSelector(isAddroomVisibleSelector);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const handleOk = async () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(false));
    if (form.getFieldValue().room) {
      await setDocument(
        "rooms",
        {
          roomName: form.getFieldValue().room,
          members: [user.uid],
        },
        uuidv4()
      );
    }

    form.resetFields();
  };
  const handleCancel = () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(false));
    form.resetFields();
  };

  return (
    <div>
      <Modal
        visible={isAddRoomVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Tạo nhóm"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nhóm" name="room">
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRoomModal;
