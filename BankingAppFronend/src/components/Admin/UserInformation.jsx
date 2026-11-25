import React, { useState } from "react";

export default function AccountInfo() {
  const [query, setQuery] = useState("");            // account number or email
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
//   const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchAccountByAccountNo = async (accNo) => {
    // adjust if your backend path differs
    const res = await fetch(`http://localhost:8080/api/account/${accNo}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const fetchAccountByEmail = async (email) => {
    const res = await fetch(`http://localhost:8080/api/email/${email}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

//   const fetchTransactions = async (accNo) => {
//     const res = await fetch(`http://localhost:8080/api/transactions/${accNo}`);
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();=
//   };

  const handleSearch = async () => {
    setError("");
    setUser(null);
    // setTransactions([]);
    if (!query.trim()) {
      setError("Please enter an account number or email.");
      return;
    }

    setLoading(true);
    try {
      // simple heuristic: contains '@' => email, else account number
      const account =
        query.includes("@")
          ? await fetchAccountByEmail(query.trim())
          : await fetchAccountByAccountNo(query.trim());

      setUser(account);

      // pull txns only if we have an accountNumber
    //   if (account?.accountNumber) {
    //     const tx = await fetchTransactions(account.accountNumber);
    //     setTransactions(tx);
    //   }
    } catch (err) {
      setError(err.message || "Failed to fetch account.");
    } finally {
      setLoading(false);
    }
  };

  const prettyName = (u) =>
    u?.fullName ||
    [u?.fname, u?.mname, u?.lname].filter(Boolean).join(" ").trim();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-extrabold text-green-700 mb-6 text-center">
          🔎 Account Information
        </h2>

        {/* Search Row */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Account No or Email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full md:w-96 shadow-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Account Card */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-green-100 to-emerald-200 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                👤 Account Holder
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800 font-medium">
                <p><span className="font-semibold">Name:</span> {prettyName(user) || "-"}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Contact:</span> {user.contactNo}</p>
                <p><span className="font-semibold">Gender:</span> {user.gender}</p>
                <p><span className="font-semibold">Role:</span> {user.role}</p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={
                    user.status === "APPROVED" ? "text-green-700 font-semibold" :
                    user.status === "REJECTED" ? "text-red-600 font-semibold" :
                    "text-yellow-700 font-semibold"
                  }>
                    {user.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white border p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🏦 Account</h3>
              <p className="text-gray-700 font-medium">
                <span className="font-semibold">Account No:</span> {user.accountNumber}
              </p>
              <p className="text-gray-700 font-medium mt-2">
                <span className="font-semibold">Balance:</span> ₹{user.balance}
              </p>
            </div>
          </div>
        )}

        {/* Transactions */}
        {/* {user && (
          <div className="bg-white border rounded-2xl shadow-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                📜 Recent Transactions
              </h3>
              <span className="text-sm text-gray-500">
                Showing {transactions.length} records
              </span>
            </div>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">From</th>
                      <th className="p-3">To</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
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
                        <td className="p-3 font-medium">{t.transactionType}</td>
                        <td className="p-3">{t.fromAccount || "-"}</td>
                        <td className="p-3">{t.toAccount || "-"}</td>
                        <td className="p-3 font-semibold">₹{t.amount}</td>
                        <td className="p-3">
                          {new Date(t.timestamp).toLocaleString()}
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            t.status === "SUCCESS" ? "text-green-700" : "text-red-600"
                          }`}
                        >
                          {t.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">
                No transactions found for this account.
              </p>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
