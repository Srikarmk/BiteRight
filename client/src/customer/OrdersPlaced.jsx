import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "../images/cart.svg";
import Logo from "../images/Logo.png";
import axios from "axios";
const OrdersPlaced = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (curruser) {
      setUser(curruser.firstName);
    }
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/orders"); // Adjust the URL as needed
        const data = await response.json();
        setOrderItems(data.order ? [data.order] : []); // Set order items to an array containing the order or an empty array
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  console.log(orderItems);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Navigate to home
  };
  console.log(orderItems);
  const handleDeleteAccount = async () => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (!curruser) return;

    try {
      await axios.delete(`http://localhost:8000/customers/${curruser.email}`);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
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
                  <span>Welcome {user}</span>
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
                    <button
                      onClick={handleDeleteAccount}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex w-full justify-between px-10 h-[80px]">
        <button className="">
          <Link to="/home" className="bg-orange-300 px-5 py-2 rounded-lg">
            Home
          </Link>
        </button>
        <button className="flex items-center space-x-2">
          <Link to="/cart">
            <img src={Cart} alt="" />
          </Link>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p className="mt-2">
          Order ID: {orderItems.length > 0 ? orderItems[0].order_id : "N/A"}
        </p>
        <div className="mt-2">
          <table className="min-w-full mt-2 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">S.no</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.item_count}</td>
                  <td className="border px-4 py-2">
                    {Object.keys(item.items_ordered).map(
                      (orderedItem, index) => (
                        <div key={index}>{item.items_ordered[orderedItem]}</div>
                      )
                    )}
                  </td>
                  <td className="border px-4 py-2">${item.amount}</td>
                </tr>
              ))}
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
