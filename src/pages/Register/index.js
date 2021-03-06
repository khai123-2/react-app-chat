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
                src="https://logos-download.com/wp-content/uploads/2017/01/WeChat_logo_icon.png"
              />
            </div>
            <div className={cx("desc")}>
              <Typography.Title level={3}>????ng k?? t??i kho???n</Typography.Title>
              Nh???n t??i kho???n mi???n ph?? c???a b???n ngay b??y gi???.
            </div>
          </div>
          <div className={cx("main")}>
            {error && <LoginMessage content="Email n??y ???? c?? ng?????i s??? d???ng" />}
            <Form name="control-ref" form={form} onFinish={onSubmit}>
              <Form.Item
                name="displayName"
                rules={[
                  {
                    whitespace: true,
                    message: "T??n hi???n th??? kh??ng ???????c ????? tr???ng",
                  },
                  {
                    required: true,
                    message: "Vui l??ng nh???p t??n hi???n th???",
                  },
                  {
                    min: 6,
                    message: "T??n hi???n th??? t???i thi???u 6 k?? t???",
                  },
                ]}
                hasFeedback
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="T??n hi???n th???"
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
                    message: "Email kh??ng h???p l???",
                  },
                  {
                    required: true,
                    message: "Vui l??ng nh???p email",
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
                    message: "Vui l??ng nh???p m???t kh???u",
                  },
                  {
                    whitespace: true,
                    message: "M???t kh???u kh??ng ???????c ????? tr???ng",
                  },
                  {
                    min: 6,
                    validator: (_, value) =>
                      value &&
                      value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "M???t kh???u c?? ??t nh???t 6 k?? t??? trong ???? c?? ??t nh???t m???t ch??? s???, m???t ch??? hoa v?? m???t ch??? th?????ng"
                            )
                          ),
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="M???t kh???u"
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
                    message: "Vui l??ng nh???p x??c nh???n m???t kh???u",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Hai m???t kh???u b???n ???? nh???p kh??ng kh???p")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  type="password"
                  placeholder="X??c nh???n m???t kh???u"
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
                  ????ng k??
                </Button>
              </Form.Item>
            </Form>

            <div className={cx("group-login")}>
              <Space>
                ????ng nh???p b???ng:
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
                B???n ???? c?? t??i kho???n ?{" "}
                <Link
                  style={{ fontWeight: "600", fontSize: "15px" }}
                  to="/login"
                >
                  ????ng nh???p
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
