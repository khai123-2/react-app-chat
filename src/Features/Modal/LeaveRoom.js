import React, { useState } from "react";
import { Modal, Form } from "antd";
import {
  isLeaveRoomVisibleSelector,
  roomIdSelector,
} from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./ModalReducer";
import inforChatReducer from "../InforChat/inForChatReducer";
import { updateDocument } from "../../firebase/service";
import { arrayRemove } from "firebase/firestore";
import { auth } from "../../firebase/config";
import chatItemReducer from "../ChatItem/chatItemReducer";
const AddRoomModal = () => {
  const user = auth.currentUser;
  const isLeaveRoomVisible = useSelector(isLeaveRoomVisibleSelector);
  const roomId = useSelector(roomIdSelector);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  //

  const handleOk = async () => {
    await updateDocument(
      "rooms",
      {
        members: arrayRemove(`${user.uid}`),
      },
      roomId
    );
    dispatch(modalReducer.actions.setIsLeaveRoomVisible(false));
    dispatch(chatItemReducer.actions.selectedConversation({}));
    dispatch(inforChatReducer.actions.setRoomId(""));
  };
  const handleCancel = () => {
    dispatch(modalReducer.actions.setIsLeaveRoomVisible(false));
    dispatch(inforChatReducer.actions.setRoomId(""));
  };

  return (
    <div>
      <Modal
        visible={isLeaveRoomVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Roi nhom"
      >
        <Form form={form} layout="vertical">
          <p>Bạn có chắc muốn rời nhóm ?</p>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRoomModal;
