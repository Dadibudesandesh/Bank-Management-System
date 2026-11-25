import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    contactNo: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("❌ Passwords do not match!");
    return;
  }

  const res = await fetch("http://localhost:8080/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (res.ok) {
    alert("✅ Registration submitted!\nWait for admin approval before login.");
    navigate("/"); 
  } else {
    alert("❌ Registration failed! Try again.");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-emerald-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          User Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              className="p-3 border border-gray-300 rounded-lg"
              value={form.fname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mname"
              placeholder="Middle Name"
              className="p-3 border border-gray-300 rounded-lg"
              value={form.mname}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              className="p-3 border border-gray-300 rounded-lg"
              value={form.lname}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="contactNo"
            placeholder="Mobile Number"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.contactNo}
            // maxLength={10}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit number"
            required
          />

          <div className="flex items-center gap-6">
            <label className="text-gray-700 font-medium">Gender:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={form.gender === "Other"}
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
          </div>

          <select
            name="role"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Request Registration
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
