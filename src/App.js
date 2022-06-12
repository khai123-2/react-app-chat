import React from "react";
import Login from "./pages/Login";
import ChatPage from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import store from "./redux/store";
import { Provider } from "react-redux";
import AddFriend from "./Features/Modal/InviteUsersModal";
import AddRoomModal from "./Features/Modal/AddRoomModal";
import EditProFile from "./Features/Modal/EditProfile";
import InviteMemberModal from "./Features/Modal/InviteMemberModal";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <AddFriend />
          <AddRoomModal />
          <EditProFile />
          <InviteMemberModal />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
