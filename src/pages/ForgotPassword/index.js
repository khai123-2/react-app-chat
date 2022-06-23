import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Typography,
  Alert,
  notification,
} from "antd";
import { auth } from "../../firebase/config";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import {
  FacebookOutlined,
  GoogleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setDocument, updateDocument } from "../../firebase/service";
import { generateKeywords } from "../../firebase/service";

const fbProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const cx = classNames.bind(styles);

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, SetError] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    await fetchSignInMethodsForEmail(auth, email)
      .then(async (methods) => {
        if (methods.length !== 0 && methods.includes("password")) {
          SetError(false);
          await sendPasswordResetEmail(auth, email);
          notification.success({
            message: "Gửi yêu cầu reset password thành công",
            description: "Vui lòng kiểm tra email",
          });

          return;
        }
        SetError(true);
      })
      .catch((err) => console.log(err));

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
              <Typography.Title level={3}>Reset mật khẩu</Typography.Title>
            </div>
          </div>
          <div className={cx("main")}>
            {error && <LoginMessage content="Tài khoản không tồn tại" />}
            <Form name="control-ref" form={form} onFinish={onSubmit}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                ]}
                hasFeedback
              >
                <Input
                  size="large"
                  type="email"
                  placeholder="Email"
                  prefix={
                    <MailOutlined
                      style={{
                        color: "#4eac6d",
                      }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  className={cx("submit")}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                >
                  Gửi
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
                Bạn đã có tài khoản ?{" "}
                <Link
                  style={{ fontWeight: "600", fontSize: "15px" }}
                  to="/login"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
