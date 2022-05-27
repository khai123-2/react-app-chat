import {
  MessageOutlined,
  ContactsOutlined,
  BellOutlined,
  MessageFilled,
  ContactsFilled,
  BellFilled,
  GlobalOutlined,
} from "@ant-design/icons";
export const SideMenutopData = [
  {
    title: "Chats",
    iconOutlined: <MessageOutlined />,
    iconFilled: <MessageFilled />,
    tab: "chats",
  },
  {
    title: "Contacts",
    iconOutlined: <ContactsOutlined />,
    iconFilled: <ContactsFilled />,
    tab: "contacts",
  },
  {
    title: "Notifications",
    iconOutlined: <BellOutlined />,
    iconFilled: <BellFilled />,
    tab: "notifications",
  },
];

export const SideMenuBotData = [
  {
    title: "Languages",
    iconOutlined: <GlobalOutlined />,
    iconFilled: <GlobalOutlined />,
    tab: "languages",
  },
];
