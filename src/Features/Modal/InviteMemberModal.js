import React, { useState, useContext } from "react";
import { Form, Modal, Select, Spin, Avatar } from "antd";
import { debounce } from "lodash";
import { db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import {
  isInviteMemberVisibleSelector,
  selectedRoomSelector,
} from "../../redux/selectors";
import modalReducer from "./ModalReducer";
import chatItemReducer from "../ChatItem/chatItemReducer";
import {
  query,
  where,
  orderBy,
  limit,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../Hooks/useFirestore";
function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  listFriendId,
  ...props
}) {
  // Search: abcddassdfasdf

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers, listFriendId).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  React.useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, curMembers, listFriendId) {
  const usersCollectionRef = collection(db, "users");
  const q = query(
    usersCollectionRef,
    where("keywords", "array-contains", search?.toLowerCase()),
    where("uid", "in", listFriendId),
    orderBy("displayName"),
    limit(20)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      label: doc.data().displayName,
      value: doc.data().uid,
      photoURL: doc.data().photoURL,
    }))
    .filter((opt) => !curMembers.includes(opt.value));
}

export default function InviteMemberModal() {
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isInviteMemberVisible = useSelector(isInviteMemberVisibleSelector);
  const selectedRoom = useSelector(selectedRoomSelector);
  const { user } = useContext(AuthContext);

  const membersCondition = React.useMemo(() => {
    return {
      fieldName: "listFriend",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);
  const listFriend = useFirestore("users", membersCondition);
  const listFriendId = listFriend.map((item) => {
    return item.uid;
  });
  const handleOk = async () => {
    // reset form value
    form.resetFields();
    setValue([]);
    await updateDoc(doc(db, "rooms", selectedRoom.id), {
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });
    const updateMembers = [
      ...selectedRoom.members,
      ...value.map((val) => val.value),
    ];
    dispatch(chatItemReducer.actions.setMembers(updateMembers));
    dispatch(modalReducer.actions.setIsInviteMemberVisible(false));
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    dispatch(modalReducer.actions.setIsInviteMemberVisible(false));
  };

  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Tên các thành viên"
            value={value}
            placeholder="Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom.members}
            listFriendId={listFriendId}
          />
        </Form>
      </Modal>
    </div>
  );
}
