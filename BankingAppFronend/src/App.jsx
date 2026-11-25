import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import UserDashboard from "./components/User/UserDashboard";
import UserWithdraw from "./components/User/UserWithdraw";
import UserDeposit from "./components/User/UserDeposit";
import UserTransaction from "./components/User/UserTransaction";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AllAccounts from "./components/Admin/AllAccounts";
import RegisterRequest from "./components/Admin/RegisterRequest";
import GetTransaction from "./components/Admin/GetTransaction";
import UserInformation from "./components/Admin/UserInformation";
import AllTransaction from "./components/Admin/AllTransactions";
import DepositRequest from "./components/Admin/DepositRequest";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* 🔹 User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/withdraw" element={<UserWithdraw />} />
        <Route path="/deposit" element={<UserDeposit />} />
        <Route path="/transaction" element={<UserTransaction />} />

        {/* 🔹 Admin Routes */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminDashboard/allAccounts" element={<AllAccounts />} />
        <Route path="/adminDashboard/registerRequests" element={<RegisterRequest />} />
        <Route path="/adminDashboard/getTransaction" element={<GetTransaction />} />
        <Route path="/adminDashboard/userInformation" element={<UserInformation />} />
        <Route path="/adminDashboard/allTransactions" element={<AllTransaction />} />
        <Route path="/adminDashboard/depositRequest" element={<DepositRequest />} />
        
      </Routes>
    </Router>
  );
}

export default App;
