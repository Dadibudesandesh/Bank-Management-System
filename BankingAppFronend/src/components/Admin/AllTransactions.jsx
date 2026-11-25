import React, {  useEffect, useState } from "react";

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);

 


  useEffect(() => {
     const fetchTransactions = async () => {
    const res = await fetch(`http://localhost:8080/api/transactions`);
    const data = await res.json();
    setTransactions(data);
  };
  fetchTransactions();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          All Transactions
        </h2>
        <table className="w-full border text-sm text-left">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Time</th>
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
                <td className="p-2">{t.fromAccount}</td>
                <td className="p-2">{t.toAccount}</td>
                <td className="p-2">₹{t.amount}</td>
                <td className="p-2">{new Date(t.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
