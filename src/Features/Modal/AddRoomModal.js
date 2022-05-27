import React, { useContext, useState } from "react";
import { Modal, Form, Input, Avatar } from "antd";
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
import { storage, db } from "../../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
const cx = classNames.bind(styles);
const AddRoomModal = () => {
  const { user } = useContext(AuthContext);
  const isAddRoomVisible = useSelector(isAddroomVisibleSelector);
  const dispatch = useDispatch();
  const [img, setImg] = useState(null);
  const [form] = Form.useForm();
  //
  const handleChangeImg = (e) => {
    setImg(e.target.files[0]);
    dispatch(modalReducer.actions.setChangeImg(img));
  };
  const handleOk = async () => {
    dispatch(modalReducer.actions.setIsAddroomVisible(false));
    const roomName = form.getFieldValue().room;
    if (roomName) {
      const roomId = uuidv4();
      if (img) {
        const uploadImg = async () => {
          const imgRef = ref(
            storage,
            `avatar/${new Date().getTime()} - ${img.name}`
          );

          try {
            const snap = await uploadBytes(imgRef, img);
            const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
            console.log(url);
            await setDocument(
              "rooms",
              {
                roomId,
                roomName: roomName,
                members: [user.uid],
                photoURL: url,
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
            roomName: form.getFieldValue().room,
            members: [user.uid],
          },
          roomId
        );
      }
    }
    setImg(null);
    form.resetFields();
  };
  const handleCancel = () => {
    setImg(null);
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
          <div className={cx("avartar-div")}>
            {img ? (
              <Avatar src={URL.createObjectURL(img)} size={64} />
            ) : (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                size={64}
                icon={<CameraOutlined />}
              />
            )}
            <div className={cx("overlay")}>
              <div>
                <label htmlFor="photo">
                  <Camera />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="photo"
                  onChange={handleChangeImg}
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
