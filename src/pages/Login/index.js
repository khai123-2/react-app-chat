import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { auth } from "../../firebase/config";
import {
  signInWithPopup,
  FacebookAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { setDocument, updateDocument } from "../../firebase/service";
import { generateKeywords } from "../../firebase/service";
const fbProvider = new FacebookAuthProvider();
const Login = () => {
  const handleFbLogin = async () => {
    const data = await signInWithPopup(auth, fbProvider);
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
      <Row justify="center" style={{ height: "800" }}>
        <Col span={8}>
          <Typography.Title style={{ textAlign: "center" }} level={3}>
            Kakao Talk
          </Typography.Title>
          <Button style={{ width: "100%", marginBottom: "5px" }}>
            Đăng nhập bằng google
          </Button>
          <Button style={{ width: "100%" }} onClick={handleFbLogin}>
            Đăng nhập bằng facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
