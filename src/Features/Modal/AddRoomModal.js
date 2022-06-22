import React, { useContext, useState } from "react";
import { Modal, Form, Input, Avatar, Button } from "antd";
import { isAddroomVisibleSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./ModalReducer";
import { CameraOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { setDocument } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";
import Camera from "../../components/svg/Camera";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { storage } from "../../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { generateKeywords } from "../../firebase/service";
const cx = classNames.bind(styles);
const AddRoomModal = () => {
  const { user } = useContext(AuthContext);
  const isAddRoomVisible = useSelector(isAddroomVisibleSelector);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [form] = Form.useForm();
  const fromDb = undefined;
  //
  const handleChangeImg = (e) => {
    const obj = fromDb || {};
    obj.myFile = e.target.files[0];
    setImage(obj.myFile);
    dispatch(modalReducer.actions.setChangeImg(image));
  };

  const reset = (e) => {
    const obj = fromDb || {};
    obj.value = "";
    e.target.value = obj.value;
  };
  const handleOk = async () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(false));
    const roomName = form.getFieldValue().room;
    if (roomName) {
      const roomId = uuidv4();
      if (image) {
        const uploadImg = async () => {
          const imgRef = ref(
            storage,
            `avatar/${new Date().getTime()} - ${image.name}`
          );

          try {
            const snap = await uploadBytes(imgRef, image);
            const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
            await setDocument(
              "rooms",
              {
                roomId,
                roomName: roomName,
                members: [user.uid],
                photoURL: url,
                keywords: generateKeywords(roomName?.toLowerCase()),
              },
              roomId
            );
          } catch (err) {
            console.log(err.message);
          }
        };
        uploadImg();
      } else {
        await setDocument(
          "rooms",
          {
            roomId,
            roomName: roomName,
            members: [user.uid],
            keywords: generateKeywords(roomName?.toLowerCase()),
          },
          roomId
        );
      }
    }
    setImage(null);
    form.resetFields();
  };
  const handleCancel = () => {
    setImage(null);
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
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Tạo nhóm
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <div className={cx("avatar-div")}>
            {image ? (
              <Avatar src={URL.createObjectURL(image)} size={64} />
            ) : (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                size={64}
                icon={<CameraOutlined />}
              />
            )}
            <div className={cx("overlay")}>
              <div>
                <label htmlFor="photoRoom">
                  <Camera />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="photoRoom"
                  onChange={handleChangeImg}
                  onClick={reset}
                />
              </div>
            </div>
          </div>
          <Form.Item label="Nhóm" name="room">
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRoomModal;
