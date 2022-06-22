import React from "react";
import { Button, Typography, notification } from "antd";
import { auth } from "../../firebase/config";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import { signOut, sendEmailVerification } from "firebase/auth";

const cx = classNames.bind(styles);

const VerifyEmail = () => {
  const user = auth.currentUser;

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(user);
      notification.success({
        message: "Gửi xác nhận địa chỉ email thành công",
        description: "Vui lòng kiểm tra email",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("top")}>
            <div className={cx("header")}>
              <img
                alt="logo"
                className={cx("logo")}
                src="https://brademar.com/wp-content/uploads/2022/05/Line-Logo-PNG-2016-%E2%80%93-Now-1.png"
              />
            </div>
            <div className={cx("desc")}>
              <Typography.Title level={3}>Wellcome to Doot</Typography.Title>
              Bạn cần xác minh email để tiếp tục
            </div>
          </div>
          <div className={cx("main")}>
            <Button
              className={cx("button")}
              size="large"
              type="primary"
              onClick={handleSendVerification}
            >
              Gửi xác nhận đến email của bạn
            </Button>
            <Button
              className={cx("button")}
              size="large"
              type="primary"
              onClick={() => signOut(auth)}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
