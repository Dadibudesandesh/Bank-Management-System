import React, { useEffect, useState } from "react";

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("⚠️ Please log in first!");
      window.location.href = "/";
      return;
    }
    setUser(storedUser);

    fetchUserTransactions(storedUser.accountNumber);
  }, []);

  const fetchUserTransactions = async (accountNo) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/${accountNo}`
      );
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading transactions...
      </div>
    );
  }

  return (
    // <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          🧾 Your Transaction History
        </h2>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <p>
            <strong>Name:</strong> {user?.fname} {user?.lname}
          </p>
          <p>
            <strong>Account Number:</strong> {user?.accountNumber}
          </p>
          <p>
            <strong>Current Balance:</strong> ₹{user?.balance}
          </p>
        </div>

        {transactions.length > 0 ? (
          <table className="w-full border text-sm text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-2">Type</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className={`border-b ${
                    t.transactionType === "DEPOSIT"
                      ? "bg-green-50"
                      : t.transactionType === "WITHDRAW"
                      ? "bg-red-50"
                      : "bg-blue-50"
                  }`}
                >
                  <td className="p-2 font-medium">{t.transactionType}</td>
                  <td className="p-2">{t.fromAccount || "-"}</td>
                  <td className="p-2">{t.toAccount || "-"}</td>
                  <td className="p-2 font-semibold text-gray-800">
                    ₹{t.amount}
                  </td>
                  <td className="p-2">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td
                    className={`p-2 font-semibold ${
                      t.status === "SUCCESS"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No transactions found.
          </p>
        )}
      </div>
    // </div>
  );
}
