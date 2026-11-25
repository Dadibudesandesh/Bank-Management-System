import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Wallet, ArrowLeft } from "lucide-react";

export default function UserDeposit() {
  // const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/api/transactions/deposit?accountNumber=${accountNumber}&amount=${amount}`,
      { method: "POST" }
    );
    const text = await res.text();
    setMessage(text);
    setAccountNumber("");
    setAmount("");
  };

  return (
    <div className="flex justify-center items-center  bg-gradient-to-br ">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <Wallet className="mx-auto text-green-600 w-10 h-10" />
          <h2 className="text-2xl font-semibold text-green-700 mt-2">Deposit Money</h2>
        </div>

        <form onSubmit={handleDeposit} className="space-y-4">
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Deposit
          </button>
        </form>

        {message && <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>}

        {/* <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-sm flex items-center gap-1 text-gray-600 hover:text-green-600 justify-center"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button> */}
      </div>
    </div>
  );
}
