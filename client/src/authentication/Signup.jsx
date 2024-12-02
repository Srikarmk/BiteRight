import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate(); // Add this line

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNum: "",
    address: "",
    zip: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      console.log("Success:", data.user);
      alert("Registration Successful!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactNum: "",
        address: "",
        zip: "",
        password: "",
      });
      navigate("/home");
    } catch (error) {
      console.error("Error details:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEAE2] p-4">
      <div className="p-8 rounded-lg w-full border-2 border-[#A04732] max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNum">Phone Number</label>
            <input
              type="text"
              id="contactNum"
              name="contactNum"
              value={formData.contactNum}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip">Zip Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#A04732] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A04732]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#A04732] text-white py-2 px-4 rounded-md hover:bg-[#8B3C2A] transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
        <Link to="/">
          <button
            type="submit"
            className="w-full bg-[#A04732] text-white py-2 px-4 rounded-md hover:bg-[#8B3C2A] transition-colors duration-200 mt-5"
          >
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
