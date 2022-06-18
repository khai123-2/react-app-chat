import React, { useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { auth } from "../../firebase/config";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  updateProfile,
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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onSubmit = async ({ email, password, displayName }) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setDocument(
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
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: null,
      });
    } catch (error) {
      alert("error,", error);
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
                src="https://brademar.com/wp-content/uploads/2022/05/Line-Logo-PNG-2016-%E2%80%93-Now-1.png"
              />
            </div>
            <div className={cx("desc")}>
              <Typography.Title level={3}>Register Account</Typography.Title>
              Get your free Doot account now.
            </div>
          </div>
          <div className={cx("main")}>
            <Form name="control-ref" form={form} onFinish={onSubmit}>
              <Form.Item
                name="displayName"
                rules={[
                  {
                    whitespace: true,
                    message: "The display name cannot be empty",
                  },
                  {
                    required: true,
                    message: "Please input your name",
                  },
                  {
                    min: 6,
                    message: "The display name at least 6 character",
                  },
                ]}
                hasFeedback
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Display name"
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
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input email",
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
                    message: "Please input password",
                  },
                  {
                    whitespace: true,
                    message: "Password cannot be empty",
                  },
                  {
                    min: 6,
                    validator: (_, value) =>
                      value &&
                      value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "Password at least 6 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
                            )
                          ),
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="Password"
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
                    message: "Please input comfirm password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="Comfirm password"
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
                  Register
                </Button>
              </Form.Item>
            </Form>

            <div className={cx("group-login")}>
              <Space>
                Login with:
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
                Already have an account ?{" "}
                <Link
                  style={{ fontWeight: "600", fontSize: "15px" }}
                  to="/login"
                >
                  Login
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
