import React, { useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { auth } from "../../firebase/config";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import {
  UserOutlined,
  LockOutlined,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { setDocument, updateDocument } from "../../firebase/service";
import { generateKeywords } from "../../firebase/service";
import { Link } from "react-router-dom";
const fbProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const cx = classNames.bind(styles);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const onLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await updateDocument(
        "users",
        {
          isOnline: true,
        },
        auth.currentUser.uid
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const handleLogin = async (provider) => {
    const data = await signInWithPopup(auth, provider);
    const { user } = data;
    const additionalUserInfo = getAdditionalUserInfo(data);
    if (additionalUserInfo?.isNewUser) {
      await setDocument(
        "users",
        {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          listFriend: [],
          keywords: generateKeywords(user.displayName?.toLowerCase()),
          isOnline: true,
        },
        user.uid
      );
    } else {
      await updateDocument(
        "users",
        {
          isOnline: true,
        },
        user.uid
      );
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
                src="https://logos-download.com/wp-content/uploads/2017/01/WeChat_logo_icon.png"
              />
            </div>
            <div className={cx("desc")}>
              <Typography.Title level={3}>Welcome back !</Typography.Title>
              Đăng nhập để tiếp tục
            </div>
          </div>
          <div className={cx("main")}>
            <Form name="control-ref" onFinish={onLogin}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  placeholder="Email"
                  prefix={
                    <UserOutlined
                      style={{
                        color: "#4eac6d",
                      }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="Mật khẩu"
                  prefix={
                    <LockOutlined
                      style={{
                        color: "#4eac6d",
                      }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Link to="/forgotpassword">Quên mật khẩu ?</Link>
              </Form.Item>
              <Form.Item>
                <Button
                  className={cx("submit")}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className={cx("group-login")}>
              <Space>
                Đăng nhập bằng:
                <FacebookOutlined
                  title="Facebook"
                  className={styles.icon}
                  onClick={() => handleLogin(fbProvider)}
                />
                <GoogleOutlined
                  title="Google"
                  className={styles.icon}
                  onClick={() => handleLogin(googleProvider)}
                />
              </Space>
            </div>
            <div className={cx("text-muted")}>
              <p>
                Bạn chưa có tài khoản ?{" "}
                <Link
                  style={{ fontWeight: "600", fontSize: "15px" }}
                  to="/register"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
