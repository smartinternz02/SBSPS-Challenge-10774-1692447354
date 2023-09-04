import React from "react";
import axios from "axios";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginScreen from "./components/LoginScreen/LoginScreen";
import HomePage from "./components/HomePage/HomePage";
import History from "./components/History/History";
import Query from "./components/Query/Query";
import AuthProvider from "./store/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/homepage",
    element: <HomePage />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/history/:id",
    element: <Query />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
