import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "../images/cart.svg";
import Logo from "../images/Logo.png";

const OrdersPlaced = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div>
      <nav className="bg-[#EDEAE2] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>Welcome customer </span>
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
                {showDropdown && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p className="mt-2">Order ID: #123456</p>
        <div className="mt-2">
          <table className="min-w-full mt-2 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">S.no</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Item</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">Item Name</td>
                <td className="border px-4 py-2">$10.00</td>
              </tr>
            </tbody>
          </table>
          <span className="font-semibold">Status: </span>
          <span className="text-green-500">In Progress</span>
        </div>
      </div>
    </div>
  );
};

export default OrdersPlaced;
