import React, { useState } from "react";
import { Button, Form, Input, Space, Typography, Alert } from "antd";
import { auth } from "../../firebase/config";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import styles from "./index.module.less";
import classNames from "classnames/bind";
import {
  UserOutlined,
  LockOutlined,
  FacebookOutlined,
  GoogleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { setDocument, updateDocument } from "../../firebase/service";
import { generateKeywords } from "../../firebase/service";
import { Link } from "react-router-dom";
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
const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, SetError] = useState(false);
  const onSubmit = async ({ email, password, displayName }) => {
    setLoading(true);
    await fetchSignInMethodsForEmail(auth, email)
      .then(async (methods) => {
        if (methods.length !== 0) {
          SetError(true);
        } else {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(user, {
            displayName,
            photoURL: null,
          });

          await setDocument(
            "users",
            {
              displayName,
              email,
              photoURL: null,
              uid: user.uid,
              providerId: "email/password",
              listFriend: [],
              keywords: generateKeywords(displayName?.toLowerCase()),
              isOnline: true,
            },
            user.uid
          );
        }
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
                src="https://brademar.com/wp-content/uploads/2022/05/Line-Logo-PNG-2016-%E2%80%93-Now-1.png"
              />
            </div>
            <div className={cx("desc")}>
              <Typography.Title level={3}>Đăng ký tài khoản</Typography.Title>
              Nhận tài khoản miễn phí của bạn ngay bây giờ.
            </div>
          </div>
          <div className={cx("main")}>
            {error && <LoginMessage content="Email này đã có người sử dụng" />}
            <Form name="control-ref" form={form} onFinish={onSubmit}>
              <Form.Item
                name="displayName"
                rules={[
                  {
                    whitespace: true,
                    message: "Tên hiển thị không được để trống",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập tên hiển thị",
                  },
                  {
                    min: 6,
                    message: "Tên hiện thỉ tối thiểu 6 ký tự",
                  },
                ]}
                hasFeedback
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Tên hiển thị"
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

              <Form.Item
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                  {
                    whitespace: true,
                    message: "Mật khẩu không được để trống",
                  },
                  {
                    min: 6,
                    validator: (_, value) =>
                      value &&
                      value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "Mật khẩu có ít nhất 6 ký tự trong đó có ít nhất một chữ số, một chữ hoa và một chữ thường"
                            )
                          ),
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
              <Form.Item
                name="comfirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập xác nhận mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Hai mật khẩu bạn đã nhập không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
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
                <Button
                  className={cx("submit")}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                >
                  Đăng ký
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

export default Register;
