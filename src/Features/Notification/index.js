import React from "react";
import { Collapse } from "antd";
import styles from "./index.module.less";
import ListRequest from "../ListRequest";
import { useSelector } from "react-redux";
import { requestIdSelector } from "../../redux/selectors";
import useFirestore from "../../Hooks/useFirestore";
const { Panel } = Collapse;
const Notification = () => {
  const listFriendRequestId = useSelector(requestIdSelector);
  const membersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: listFriendRequestId,
    };
  }, [listFriendRequestId]);
  // get chat list friend
  const listRequest = useFirestore("users", membersCondition);
  return (
    <div className="listNotification">
      <Collapse ghost defaultActiveKey={["1"]} className={styles.panelCustom}>
        <Panel header="Thông báo" key="1">
          <ListRequest listRequest={listRequest} />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Notification;
