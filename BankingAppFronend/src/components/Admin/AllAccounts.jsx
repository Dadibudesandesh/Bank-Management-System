import React, { useEffect, useState } from "react";

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      } else {
        console.error("Failed to fetch accounts");
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this account?")) return;
    await updateStatus(id, "APPROVED");
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this account?")) return;
    await updateStatus(id, "REJECTED");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert(`User ${newStatus.toLowerCase()} successfully!`);
        fetchAccounts();
      } else {
        alert("Failed to update status!");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredAccounts = accounts.filter((acc) =>
    acc.fname?.toLowerCase().includes(search.toLowerCase()) ||
    acc.accountNumber?.includes(search) ||
    acc.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading accounts...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🧾 All User Accounts
        </h2>

        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or account no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-80 shadow-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">Account No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold text-gray-800">
                      {acc.accountNumber}
                    </td>
                    <td className="p-3">
                      {acc.fname} {acc.lname}
                    </td>
                    <td className="p-3">{acc.email}</td>
                    <td className="p-3">{acc.contactNo}</td>
                    <td className="p-3 font-semibold">₹{acc.balance}</td>
                    <td
                      className={`p-3 font-semibold ${
                        acc.status === "APPROVED"
                          ? "text-green-600"
                          : acc.status === "REJECTED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {acc.status}
                    </td>
                    <td className="p-3">{acc.role}</td>
                    <td className="p-3 space-x-2">
                      {acc.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(acc.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(acc.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {acc.status !== "PENDING" && (
                        <span className="text-gray-500 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-5 text-gray-500 italic"
                  >
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
