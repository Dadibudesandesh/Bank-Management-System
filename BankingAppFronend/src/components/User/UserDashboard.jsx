import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDeposit from "./UserDeposit";
import UserWithdraw from "./UserWithdraw";
import UserTransactions from "./UserTransaction";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    navigate("/");
    return;
  }

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:8080/api/${storedUser.id}`);
    const freshUser = await res.json();
    setUser(freshUser);
    localStorage.setItem("user", JSON.stringify(freshUser));
  };

  fetchUser();
}, []);


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/${user.id}/latest`
        );
        console.log(user.id)
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-green-700 text-white shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏦</span>
          <h1 className="text-2xl font-bold">Bank Dashboard</h1>
        </div>

        <ul className="flex gap-8 text-lg font-medium">
          {[
            { name: "home", label: "🏠 Home" },
            { name: "deposit", label: "💰 Deposit" },
            { name: "withdraw", label: "💸 Withdraw" },
            { name: "transactions", label: "📜 Transactions" },
            { name: "profile", label: "👤 Profile" },
          ].map((tab) => (
            <li
              key={tab.name}
              className={`cursor-pointer hover:text-yellow-300 ${
                activeTab === tab.name && "text-yellow-300 font-semibold"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.label}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <span className="text-sm font-semibold">
            Hello, {user?.fname || "User"} 👋
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8">
        {activeTab === "home" && (
          <div>
            <h1 className="text-3xl font-semibold text-green-700 mb-6">
              Welcome, {user.fname} 👋
            </h1>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-600 mb-2">
                  Account Info
                </h3>
                <p>
                  <strong>Account No:</strong> {user.accountNumber}
                </p>
                <p>
                  <strong>Balance:</strong> ₹{user.balance}
                </p>
                <p>
                  <strong>Status:</strong> {user.status}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-600 mb-2">
                  Contact Info
                </h3>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.contactNo}
                </p>
                <p>
                  <strong>Gender:</strong> {user.gender}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                🪙 Latest Transactions
              </h3>
              {transactions.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-100 text-left">
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">From</th>
                      <th className="p-3">To</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{tx.transactionType}</td>
                        <td className="p-3">₹{tx.amount}</td>
                        <td className="p-3">{tx.fromAccount || "-"}</td>
                        <td className="p-3">{tx.toAccount || "-"}</td>
                        <td className="p-3">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            tx.status === "SUCCESS"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">
                  No recent transactions found.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "deposit" && <UserDeposit user={user} />}

        {activeTab === "withdraw" && <UserWithdraw user={user} />}

        {activeTab === "transactions" && <UserTransactions user={user}/>}

        {activeTab === "profile" && (
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              👤 Profile Information
            </h2>
            <div className="space-y-3 text-gray-700 text-lg">
              <p>
                <strong>Name:</strong> {user.fname} {user.mname} {user.lname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.contactNo}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender}
              </p>
              <p>
                <strong>Account No:</strong> {user.accountNumber}
              </p>
              <p>
                <strong>Balance:</strong> ₹{user.balance}
              </p>
              <p>
                <strong>Status:</strong> {user.status}
              </p>
              <hr className="my-4" />
              <p className="text-center text-gray-500 italic">
                "Your account details are safe and secure 🔒"
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
