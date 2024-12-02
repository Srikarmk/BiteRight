import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const StaffLogin = () => {
  const [formData, setFormData] = useState({
    restaurantId: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.restaurantId ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill in all fields");
      return;
    }
    console.log(
      formData.restaurantId,
      formData.email,
      formData.password,
      formData.role
    );
    try {
      const response = await fetch("http://localhost:8000/staff-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Add this to handle cookies if your server uses them
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      localStorage.setItem("staffId", data.staff_id);
      if (response.ok) {
        localStorage.setItem("staffUser", JSON.stringify(data.user));
        if (formData.role === "Manager") {
          navigate("/manager");
        } else if (formData.role === "Chef") {
          navigate("/manager");
        }
      } else {
        setError(
          data.detail ||
            data.message ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEAE2]">
      <div className="p-8 rounded-lg w-96 border-2 border-[#A04732]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#A04732]">
          Staff Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Restaurant ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[#A04732]"
              value={formData.restaurantId}
              onChange={(e) =>
                setFormData({ ...formData, restaurantId: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[#A04732]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[#A04732]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[#A04732]"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="Manager">Manager</option>
              <option value="Chef">Chef</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#A04732] text-white py-2 px-4 rounded-md hover:bg-[#8a3e2d] transition-colors"
          >
            Login
          </button>
        </form>
        <Link to="/">
          <button
            type="submit"
            className="w-full mt-5 bg-[#A04732] text-white py-2 px-4 rounded-md hover:bg-[#8a3e2d] transition-colors"
          >
            Back
          </button>
        </Link>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default StaffLogin;
