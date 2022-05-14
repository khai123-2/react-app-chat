import React from "react";
import Login from "./Components/User/Login";
import ChatPage from "./Components/ChatPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import store from "./redux/store";
import { Provider } from "react-redux";
import AddFriend from "./Features/Modal/InviteUsersModal";
import AddRoomModal from "./Features/Modal/AddRoomModal";
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
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
