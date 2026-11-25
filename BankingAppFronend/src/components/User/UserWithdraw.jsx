import React, { useState } from "react";

export default function UserWithdraw() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8080/api/transactions/withdraw?accountNumber=${user.accountNumber}&amount=${amount}`,
      { method: "POST" }
    );

    const text = await res.text();
    setMessage(text);

    if (res.ok) {
      const updatedUser = await fetch(`http://localhost:8080/api/${user.id}`).then((r) => r.json());
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    setAmount("");
    //  window.location.reload();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Withdraw Money 💸</h2>
      <form onSubmit={handleWithdraw} className="space-y-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Withdraw
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      <div className="mt-4 text-sm text-gray-600 text-center">
        <strong>Current Balance:</strong> ₹{user.balance}
      </div>
    </div>
  );
}
