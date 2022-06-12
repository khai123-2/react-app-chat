import React, { useContext } from "react";
import { Collapse } from "antd";
import styles from "./index.module.less";
import ListRequest from "../ListRequest";
import useFirestore from "../../Hooks/useFirestore";
import { AuthContext } from "../../Context/AuthProvider";
const { Panel } = Collapse;
const Notification = () => {
  const { user } = useContext(AuthContext);
  const requestCondition = React.useMemo(() => {
    return {
      fieldName: "to",
      operator: "==",
      compareValue: user.uid,
    };
  }, [user.uid]);

  const listRequest = useFirestore("requests", requestCondition);
  const userSendRequestId = React.useMemo(
    () =>
      listRequest.map((req) => {
        return req.from;
      }),
    [listRequest]
  );

  const userCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: userSendRequestId,
    };
  }, [userSendRequestId]);
  const userSendRequest = useFirestore("users", userCondition);
  return (
    <div className="listNotification">
      <Collapse ghost defaultActiveKey={["1"]} className={styles.panelCustom}>
        <Panel header="Thông báo" key="1">
          <ListRequest userSendRequest={userSendRequest} />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Notification;
