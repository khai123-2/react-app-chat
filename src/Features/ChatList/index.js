import React, { useContext, useState } from "react";
import { List } from "antd";
import useFirestore from "../../Hooks/useFirestore";
import { AuthContext } from "../../Context/AuthProvider";
import ChatItem from "../ChatItem";
import { useDispatch } from "react-redux";
import chatItemReducer from "../ChatItem/chatItemReducer";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
const ListMessages = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState("");
  const currentUserCondition = React.useMemo(() => {
    return {
      fieldName: "listFriend",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);
  const listFriend = useFirestore("users", currentUserCondition);
  const listRoom = useFirestore("rooms", roomsCondition);
  const listConversations = listFriend.concat(listRoom);

  const sort = async () => {
    await listConversations.sort((x, y) => {
      return y.createdAt.seconds - x.createdAt.seconds;
    });
  };
  sort();

  const handleSelectedUser = async (conversation) => {
    setConversation(conversation);
    if (conversation.uid) {
      const id =
        user.uid > conversation.uid
          ? `${user.uid + conversation.uid}`
          : `${conversation.uid + user.uid}`;
      // get last message b/w logged in user and selected user
      const docSnap = await getDoc(doc(db, "lastMsg", id));
      // if last message exists and message is from selected user
      if (docSnap.data() && docSnap.data().from !== user.uid) {
        // update last message doc, set unread to false
        await updateDoc(doc(db, "lastMsg", id), { unread: false });
      }
    }
    if (conversation.roomId) {
      // get last message b/w logged in user and selected user
      const docSnap = await getDoc(doc(db, "lastMsg", conversation.roomId));
      // if last message exists and message is from selected user
      if (docSnap.data() && docSnap.data().from !== user.uid) {
        // update last message doc, set unread to false
        await updateDoc(doc(db, "lastMsg", conversation.roomId), {
          unread: false,
        });
      }
    }
    dispatch(chatItemReducer.actions.selectedConversation(conversation));
  };
  return (
    <List
      dataSource={listConversations}
      renderItem={(item) => (
        <List.Item style={{ padding: "0", borderBottom: "0" }}>
          <ChatItem
            data={item}
            handleSelectedUser={handleSelectedUser}
            conversation={conversation}
          />
        </List.Item>
      )}
    />
  );
};

export default ListMessages;
