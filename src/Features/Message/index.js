import React from "react";
import ImageUpload from "./components/ImageUpload";
import FileUpload from "./components/FileUpload";
import MessageText from "./components/MessageText";

const renderChildren = (typeMess, msg, prevMess) => {
  switch (typeMess) {
    case "image":
      return <ImageUpload msg={msg} prevMess={prevMess} />;
    case "file":
      return <FileUpload msg={msg} prevMess={prevMess} />;
    default:
      return <MessageText msg={msg} prevMess={prevMess} />;
  }
};
const Message = ({ msg, prevMess }) => {
  return <>{renderChildren(msg.typeMess, msg, prevMess)}</>;
};

export default React.memo(Message);
