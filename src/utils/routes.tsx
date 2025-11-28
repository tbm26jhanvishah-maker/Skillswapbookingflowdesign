import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "../components/Layout";
import { HomePageNew } from "../components/HomePageNew";
import { ChatsPage } from "../components/ChatsPage";
import { BookingsPage } from "../components/BookingsPage";
import { ProfilePage } from "../components/ProfilePage";
import { ProfilePageSupabase } from "../components/ProfilePageSupabase";
import { ChatDetailPage } from "../components/ChatDetailPage";
import { AdminPanel } from "../components/AdminPanel";

// Supabase-integrated screens
import { LandingPage } from "../components/LandingPage";
import { LoginScreen } from "../components/LoginScreen";
import { SignupScreen } from "../components/SignupScreen";
import { ForgotPasswordScreen } from "../components/ForgotPasswordScreen";
import { AddTeachSkillsScreen } from "../components/AddTeachSkillsScreen";
import { AddLearnSkillsScreen } from "../components/AddLearnSkillsScreen";
import { HomeSupabase } from "../components/HomeSupabase";
import { ChatSupabase } from "../components/ChatSupabase";
import { ChatsListSupabase } from "../components/ChatsListSupabase";
import { BookingsSupabase } from "../components/BookingsSupabase";
import { RootRedirect } from "../components/RootRedirect";

export const router = createBrowserRouter([
  // Root - redirects based on auth
  {
    path: "/",
    element: <RootRedirect />,
  },
  
  // Auth routes (no layout)
  {
    path: "/landing",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginScreen,
  },
  {
    path: "/signup",
    Component: SignupScreen,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordScreen,
  },
  {
    path: "/add-skills",
    Component: AddTeachSkillsScreen,
  },
  {
    path: "/add-learn-skills",
    Component: AddLearnSkillsScreen,
  },
  
  // Main app routes with layout
  {
    path: "/home",
    Component: Layout,
    children: [
      // Supabase version (real backend) - Default
      { index: true, Component: HomeSupabase },
      { path: "chats", Component: ChatsListSupabase },
      { path: "chats/:matchId", Component: ChatSupabase },
      { path: "bookings", Component: BookingsSupabase },
      { path: "profile", Component: ProfilePageSupabase },
      
      // Mock/demo versions (for testing without backend)
      { path: "demo", Component: HomePageNew },
      { path: "demo/chats", Component: ChatsPage },
      { path: "demo/chats/:chatId", Component: ChatDetailPage },
      { path: "demo/bookings", Component: BookingsPage },
      
      // Admin panel (for seeding demo data to old KV store)
      { path: "admin", Component: AdminPanel },
    ],
  },
]);
