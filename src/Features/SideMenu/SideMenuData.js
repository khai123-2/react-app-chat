import {
  MessageOutlined,
  ContactsOutlined,
  BellOutlined,
  MessageFilled,
  ContactsFilled,
  BellFilled,
} from "@ant-design/icons";
export const SideMenutopData = [
  {
    title: "Tin nhắn",
    iconOutlined: <MessageOutlined />,
    iconFilled: <MessageFilled />,
    tab: "chats",
  },
  {
    title: "Danh bạ",
    iconOutlined: <ContactsOutlined />,
    iconFilled: <ContactsFilled />,
    tab: "contacts",
  },
  {
    title: "Thông báo",
    iconOutlined: <BellOutlined />,
    iconFilled: <BellFilled />,
    tab: "notifications",
  },
];
