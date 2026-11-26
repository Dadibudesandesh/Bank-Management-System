
import React, { useState } from "react";
import { Wallet } from "lucide-react";
import api from "../api/axiosConfig";

export default function UserDeposit() {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (Number(amount) <= 0) {
            setMessage("Please enter a valid amount.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/transactions/deposit",
                null,
                {
                    params: {
                        accountNumber: accountNumber,
                        amount: amount
                    }
                }
            );

            setMessage(
                typeof response.data === "string"
                    ? response.data
                    : response.data.message || "Deposit successful!"
            );

            setAccountNumber("");
            setAmount("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Deposit failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-br">
            <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-md">

                <div className="text-center mb-6">
                    <Wallet className="mx-auto text-green-600 w-10 h-10" />
                    <h2 className="text-2xl font-semibold text-green-700 mt-2">
                        Deposit Money
                    </h2>
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
                        min="0.01"
                        step="0.01"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Deposit"}
                    </button>

                </form>

                {message && (
                    <p className="mt-4 text-center text-gray-700 font-medium">
                        {message}
                    </p>
                )}

            </div>
        </div>
    );
}
