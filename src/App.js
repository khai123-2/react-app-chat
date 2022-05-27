import React from "react";
// import Login from "./Components/User/Login";
// import ChatPage from "./Components/ChatPage";
import Login from "./pages/Login";
import ChatPage from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import store from "./redux/store";
import { Provider } from "react-redux";
import AddFriend from "./Features/Modal/InviteUsersModal";
import AddRoomModal from "./Features/Modal/AddRoomModal";
import EditProFile from "./Features/Modal/EditProfile";
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
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
