import React, { useContext } from "react";
import { List, Avatar, Button } from "antd";
import styles from "./index.module.less";
import VirtualList from "rc-virtual-list";
import { updateDocument, deleteDocument } from "../../firebase/service";
import { arrayUnion } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
const FriendRequestBox = ({ userSendRequest }) => {
  const { user } = useContext(AuthContext);

  //Delete

  const handleReject = async (requestUserId) => {
    const id =
      user.uid > requestUserId
        ? `${user.uid + requestUserId}`
        : `${requestUserId + user.uid}`;
    await deleteDocument("requests", id);
  };

  //Update
  const handleAccept = async (requestUserId) => {
    const id =
      user.uid > requestUserId
        ? `${user.uid + requestUserId}`
        : `${requestUserId + user.uid}`;
    await updateDocument(
      "users",
      {
        listFriend: arrayUnion(`${user.uid}`),
      },
      requestUserId
    );
    await updateDocument(
      "users",
      {
        listFriend: arrayUnion(`${requestUserId}`),
      },
      user.uid
    );
    await deleteDocument("requests", id);
  };
  return (
    <div>
      <List>
        <VirtualList
          data={userSendRequest}
          height={400}
          itemHeight={47}
          itemKey="email"
        >
          {(item) => (
            <List.Item
              className={styles.buttonAction}
              key={item.uid}
              style={{ padding: "0", height: "73px" }}
              actions={[
                <Button
                  onClick={() => handleAccept(item.uid)}
                  type="primary"
                  size="small"
                >
                  Comfrim
                </Button>,
                <Button
                  onClick={() => handleReject(item.uid)}
                  type="danger"
                  size="small"
                >
                  Reject
                </Button>,
              ]}
            >
              <List.Item.Meta
                className={styles.customAvatar}
                avatar={
                  <Avatar size={48} src={item.photoURL}>
                    {item?.photoURL
                      ? ""
                      : item?.displayName?.charAt(0)?.toUpperCase()}{" "}
                  </Avatar>
                }
                title={item.displayName}
                style={{
                  padding: "12px 16px",
                  alignItems: "center",
                }}
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
};

export default FriendRequestBox;
