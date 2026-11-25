import React, { useEffect, useState } from "react";

export default function RegisterRequest() {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/pendingUsers");
      const data = await res.json();
      setPendingUsers(data);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this user?")) return;
    await fetch(`http://localhost:8080/api/admin/approve/${id}`, { method: "PUT" });
    fetchPendingUsers();
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this user?")) return;
    await fetch(`http://localhost:8080/api/admin/reject/${id}`, { method: "PUT" });
    fetchPendingUsers();
  };

  useEffect(() => {
  const loadData = async () => {
    await fetchPendingUsers();
  };
  loadData();
}, []);


  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">🧾 Pending User Approvals</h2>

      {pendingUsers.length === 0 ? (
        <p className="text-gray-600">✅ No pending users right now.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">
                  {user.fname || "—"} {user.lname || ""}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.contactNo}</td>
                <td className="border px-4 py-2">{user.gender}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
