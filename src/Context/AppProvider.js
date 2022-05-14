import React, { useState, useEffect } from "react";

export const AppContext = React.createContext();

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";

export default function AppProvider({ children }) {
  const [keyMenu, setkeyMenu] = useState("chats");
  const [friends, setfriends] = useState([]);

  //Key change sidebar content
  const changeMenu = ({ key }) => {
    setkeyMenu(key);
  };
  const keyValue = {
    keyMenu,
    changeMenu,
  };

  /* Fetch list friends*/
  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setfriends(friends.concat(body.results));
        // message.success(`${body.results.length} more items loaded!`);
      });
  };

  useEffect(() => {
    appendData();
  }, []);

  const friendsValue = {
    friends,
    appendData,
  };

  return (
    <AppContext.Provider value={{ keyValue, friendsValue }}>
      {children}
    </AppContext.Provider>
  );
}
