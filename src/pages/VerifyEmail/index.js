import React, { useState, useEffect } from "react";
import { Button, Typography } from "antd";
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
      alert("send verification");
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
              <Typography.Title level={3}>
                {`Wellcome  ${user.displayName} to Doot`}
              </Typography.Title>
              You need to verify email to continue
            </div>
          </div>
          <div className={cx("main")}>
            <Button
              className={cx("button")}
              size="large"
              type="primary"
              onClick={handleSendVerification}
            >
              Send verification to your email
            </Button>
            <Button
              className={cx("button")}
              size="large"
              type="primary"
              onClick={() => signOut(auth)}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
