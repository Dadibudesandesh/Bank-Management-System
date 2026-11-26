
import React, { useState } from "react";
import api from "../api/axiosConfig";

export default function UserWithdraw() {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!user) {
            setMessage("Please login again.");
            return;
        }

        if (Number(amount) <= 0) {
            setMessage("Please enter a valid amount.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/transactions/withdraw",
                null,
                {
                    params: {
                        accountNumber: user.accountNumber,
                        amount: amount
                    }
                }
            );

            setMessage(
                typeof response.data === "string"
                    ? response.data
                    : response.data.message || "Withdrawal successful!"
            );

            // Refresh user details after successful withdrawal
            const updatedResponse = await api.get(`/${user.id}`);

            setUser(updatedResponse.data);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedResponse.data)
            );

            setAmount("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Withdrawal failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto mt-10">

            <h2 className="text-2xl font-semibold text-red-600 mb-4">
                Withdraw Money 💸
            </h2>

            <form onSubmit={handleWithdraw} className="space-y-4">

                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Withdraw"}
                </button>

            </form>

            {message && (
                <p className="mt-4 text-center text-gray-700">
                    {message}
                </p>
            )}

            <div className="mt-4 text-sm text-gray-600 text-center">
                <strong>Current Balance:</strong> ₹{user?.balance ?? 0}
            </div>

        </div>
    );
}
