import { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", formData);
  };

  return (
    <div className="bg-[#EDEAE2] w-full h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg w-96 border-2 border-[#A04732]">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#A04732] text-white py-2 px-4 rounded hover:bg-[#cc7c6a] transition-colors"
          >
            Login
          </button>
        </form>
        <Link
          to="/"
          className="mt-10 bg-[#A04732] text-white py-2 px-4 rounded hover:bg-[#cc7c6a] transition-colors"
        >
          <button className="w-[90%] mt-10">Back</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
