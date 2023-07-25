import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PRDashboard from "./pages/PRDashboard";

import AuthLayout from "./layouts/AuthLayout";
import LoginUser from "./pages/LoginUser";
import SignInUser from "./pages/SignInUser";
import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/NewPassword";
import ConfirmAccount from "./pages/ConfirmAccount";
import { AuthProvider } from "./context/AuthProvider";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<LoginUser />} />
            <Route path="sign-in" element={<SignInUser />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="forget-password/:token" element={<NewPassword />} />
            <Route path="confirm-account/:id" element={<ConfirmAccount />} />
          </Route>
          <Route path="main-page" element={<PRDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
