import { Button, Modal } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEditProfileVisibleSelector } from "../../redux/selectors";
import modalReducer from "./ModalReducer";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { Form, Input, Avatar } from "antd";
import Camera from "../../components/svg/Camera";
import { storage, db } from "../../firebase/config";
import { auth } from "../../firebase/config";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { AuthContext } from "../../Context/AuthProvider";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Delete from "../../components/svg/Delete";
const fromDb = undefined;
const cx = classNames.bind(styles);

const EditProFile = () => {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [img, setImg] = useState(null);
  const dispatch = useDispatch();
  const isEditProfileVisible = useSelector(isEditProfileVisibleSelector);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists) {
          setCurrentUser(docSnap.data());
        }
      });
    }
  }, [user, img]);
  const reset = (e) => {
    const obj = fromDb || {};
    obj.value = "";
    e.target.value = obj.value;
  };
  const handleChangeImg = (e) => {
    setImg(e.target.files[0]);
  };
  const handleOk = async () => {
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          if (currentUser.photoPath) {
            await deleteObject(ref(storage, currentUser.photoPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: url,
            photoPath: snap.ref.fullPath,
          });
          dispatch(modalReducer.actions.setChangeImg(img));

          setImg(null);
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
    dispatch(modalReducer.actions.setIsEditProfileVisible(false));
  };
  const handleCancel = () => {
    setImg("");
    dispatch(modalReducer.actions.setIsEditProfileVisible(false));
  };
  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, currentUser.photoPath));

        await updateDoc(doc(db, "users", user.uid), {
          photoURL: null,
          photoPath: null,
        });
        dispatch(modalReducer.actions.setChangeImg(false));
        dispatch(modalReducer.actions.setIsEditProfileVisible(false));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Modal
      className={cx("modal")}
      width="400px"
      visible={isEditProfileVisible}
      title="Thông tin tài khoản"
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <div>
        <div className={cx("user-profile-img")}>
          <input
            type="image"
            alt="photo"
            className={cx("profile-img")}
            src="https://doot-light.react.themesbrand.com/static/media/img-4.c7a84ad5.jpg"
          />
        </div>
        <div className={cx("avatar-div")}>
          {img ? (
            <Avatar src={URL.createObjectURL(img)} className={cx("avatar")} />
          ) : (
            <Avatar src={currentUser?.photoURL} className={cx("avatar")}>
              {currentUser?.photoURL
                ? ""
                : currentUser?.displayName?.charAt(0)?.toUpperCase()}{" "}
            </Avatar>
          )}
          <div className={cx("overlay")}>
            <div>
              <label htmlFor="photoUser">
                <Camera />
              </label>
              {currentUser?.photoURL ? (
                <Delete deleteImage={deleteImage} />
              ) : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photoUser"
                onChange={handleChangeImg}
                onClick={reset}
              />
            </div>
          </div>
        </div>

        <Form layout="vertical" style={{ padding: "0 14px" }}>
          <Form.Item label="Họ tên">
            <Input disabled value={currentUser?.displayName} />
          </Form.Item>
          <Form.Item label="Email">
            <Input disabled value={currentUser?.email} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProFile;
