import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout";
import { HomePage } from "../components/HomePage";
import { ChatsPage } from "../components/ChatsPage";
import { BookingsPage } from "../components/BookingsPage";
import { ProfilePage } from "../components/ProfilePage";
import { ChatDetailPage } from "../components/ChatDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "chats", Component: ChatsPage },
      { path: "chats/:chatId", Component: ChatDetailPage },
      { path: "bookings", Component: BookingsPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
