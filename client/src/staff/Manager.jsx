import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Manager = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    const staffUser = JSON.parse(localStorage.getItem("staffUser"));
    if (staffUser) {
      setStaffName(`${staffUser.firstName} ${staffUser.lastName}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#EDEAE2]">
      <nav className="bg-[#EDEAE2] shadow-md p-5 flex justify-between items-center">
        <img src={Logo} alt="Logo" className="h-12" />
        <div className="flex items-center gap-2 relative">
          <span className="text-gray-600">Welcome,</span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="font-semibold flex items-center gap-1"
          >
            {staffName}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <Link
                to="/"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Como Pizza</h1>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-[#A04732] p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Most Ordered</h3>
              <p className="text-xl font-bold">Pepperoni Pizza</p>
            </div>
            <div className="border-2 border-[#A04732] p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Revenue This Month</h3>
              <p className="text-xl font-bold">$12,000</p>
            </div>
            <div className="border-2 border-[#A04732]  p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Ratings</h3>
              <p className="text-xl font-bold">4.8/5.0</p>
            </div>
            <div className="border-2 border-[#A04732]  p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Total Sales</h3>
              <p className="text-xl font-bold">$145,000</p>
            </div>
          </div>
          <div className="border-2 border-[#A04732]  p-4 rounded-lg shadow">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Graph</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#A04732] ">
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Customer Name</th>
                  <th className="text-left py-3">Items</th>
                  <th className="text-left py-3">Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-[2px] border-[#A04732]">
                  <td className="py-3">001</td>
                  <td className="py-3">Pramukh Koushik</td>
                  <td className="py-3">
                    <div>2x Pepperoni Pizza</div>
                    <div>2x Coca Cola</div>
                  </td>
                  <td className="py-3">$25.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
