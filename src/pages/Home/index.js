import React from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

function ChatPage() {
  return (
    <>
      <div
        className="container"
        style={{ height: "100%", overflow: "hidden", display: "flex" }}
      >
        <>
          <Sidebar />
        </>
        <>
          <ChatWindow />
        </>
      </div>
    </>
  );
}

export default ChatPage;
