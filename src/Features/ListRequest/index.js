import React, { useContext } from "react";
import { List, Avatar, Button } from "antd";
import styles from "./index.module.less";
import VirtualList from "rc-virtual-list";
import {
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";
const FriendRequestBox = ({ listRequest }) => {
  const { user } = useContext(AuthContext);
  const getConversationById = async (id) => {
    const conversations = await getDocuments("conversations", {
      fieldName: "members",
      operator: "array-contains",
      compareValue: id,
    });

    return conversations;
  };

  //Delete

  const handleReject = async (friendId) => {
    const conversations = await getConversationById(friendId);
    const selectedConversation = conversations.find(myfilter);
    function myfilter(item) {
      return item.members.includes(friendId) && item.members.includes(user.uid);
    }

    await deleteDocument("conversations", selectedConversation.id);
  };

  //Update
  const handleAccept = async (friendId) => {
    const conversations = await getConversationById(friendId);
    const selectedConversation = conversations.find(myfilter);
    function myfilter(item) {
      return item.members.includes(friendId) && item.members.includes(user.uid);
    }
    await updateDocument(
      "conversations",
      {
        isFriend: true,
      },
      selectedConversation.id
    );
  };
  return (
    <div>
      <List>
        <VirtualList
          data={listRequest}
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
                avatar={<Avatar size={48} src={item.photoURL} />}
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
