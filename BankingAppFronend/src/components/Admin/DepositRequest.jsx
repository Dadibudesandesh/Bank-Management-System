import React, { useEffect, useState } from "react";

export default function AdminDepositRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const res = await fetch("http://localhost:8080/api/deposits/pending");
    const data = await res.json();
    setRequests(data);
  };

  const handleAction = async (id, action) => {
    await fetch(`http://localhost:8080/api/deposits/${action}/${id}`, { method: "PUT" });
    loadRequests();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Pending Deposit Requests
        </h2>

        <table className="w-full border text-sm text-left">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">User ID</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Requested At</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.userId}</td>
                <td className="p-2">₹{r.amount}</td>
                <td className="p-2">{new Date(r.requestedAt).toLocaleString()}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleAction(r.id, "approve")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(r.id, "reject")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
