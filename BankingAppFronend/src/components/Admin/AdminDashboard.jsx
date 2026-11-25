import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalCash: 0,
    totalAccounts: 0,
    totalUsers: 0,
    pendingUsers: 0,
    totalWithdrawal:0,
    totalDeposit:0
  });

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/summary");
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

    useEffect(() => {
    const loadData = async () => {
      await fetchSummary();
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
  <nav className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md h-[70px]">
    <div className="flex items-center gap-3">
      <span className="text-2xl">🏦</span>
      <h1 className="text-2xl font-extrabold tracking-wide">Admin Dashboard</h1>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full shadow-sm">
        <span className="text-sm font-semibold">Hello, {JSON.parse(localStorage.getItem("user")).fname}👋</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
      >
        🚪 Logout
      </button>
    </div>
  </nav>

  <div className="flex-1 py-2 px-6">
    <div className="grid grid-cols-2 grid-rows-2 gap-6 h-[calc(100vh-90px)]">
      <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-6 rounded-2xl shadow-lg flex flex-col justify-center transition-transform transform hover:scale-[1.02] hover:shadow-2xl">
        <h2 className="text-xl font-extrabold text-green-800 mb-3 flex items-center gap-2">
          💰 Bank Summary
        </h2>
        <div className="space-y-2 text-base font-semibold text-gray-700">
          <p><span className="font-bold text-green-900">Total Cash:</span> ₹{summary.totalCash}</p>
          <p><span className="font-bold text-green-900">Accounts:</span> {summary.totalAccounts}</p>
          <p><span className="font-bold text-green-900">Users:</span> {summary.totalUsers}</p>
          <p><span className="font-bold text-green-900">Pending:</span> {summary.pendingUsers}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-6 rounded-2xl shadow-lg flex flex-col justify-center transition-transform transform hover:scale-[1.02] hover:shadow-2xl">
        <h2 className="text-xl font-extrabold text-indigo-800 mb-3 flex items-center gap-2">
          📊 Quick Stats
        </h2>
        <div className="space-y-2 text-base font-semibold text-gray-700">
          <p><span className="font-bold text-indigo-900">Deposits:</span> {summary.totalDeposit}</p>
          <p><span className="font-bold text-indigo-900">Withdrawals:</span> {summary.totalWithdrawal}</p>
          <p><span className="font-bold text-indigo-900">Active:</span> 45</p>
          <p><span className="font-bold text-indigo-900">Inactive:</span> 3</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow-lg flex flex-col justify-evenly transition-transform transform hover:scale-[1.02] hover:shadow-2xl">
        <h2 className="text-xl font-extrabold text-yellow-800 mb-3 flex items-center gap-2">
          ⚙️ Manage
        </h2>
        <div className="flex flex-col space-y-3">
          <button onClick={() => navigate("/adminDashboard/registerRequests")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md">
            View Pending Users
          </button>
          <button onClick={() => navigate("/adminDashboard/allAccounts")}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold shadow-md">
            View All Accounts
          </button>
          <button onClick={() => navigate("/adminDashboard/allTransactions")}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold shadow-md">
            View Transactions
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl shadow-lg flex flex-col justify-evenly transition-transform transform hover:scale-[1.02] hover:shadow-2xl">
        <h2 className="text-xl font-extrabold text-pink-800 mb-3 flex items-center gap-2">
          📈 Reports & Insights
        </h2>
        <div className="flex flex-col space-y-3">
          <button onClick={() => navigate("/adminDashboard/userInformation")}
            className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold shadow-md">
            Get Account Info
          </button>
          <button onClick={() => navigate("/adminDashboard/getTransaction")}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md">
            Account Transactions
          </button>
          <button onClick={() => navigate("/register")}
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold shadow-md">
            Register User 
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
