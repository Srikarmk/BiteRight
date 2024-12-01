import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "../images/cart.svg";
import Logo from "../images/Logo.png";

const CustCart = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("");
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (curruser) {
      setUser(curruser.firstname);
    }
  }, []);

  useEffect(() => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(currentCart);
  }, []);
  console.log(cartItems);
  const handleLogout = () => {
    navigate("/");
  };
  const total = Object.entries(cartItems).reduce(
    (acc, [, item]) => acc + item.price * item.count,
    0
  );
  const serviceFee = 5.0; // Fixed service fee
  const grandTotal = total + serviceFee;
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
            {Object.entries(cartItems).map(([key, item], index) => (
              <tr key={key}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.count}</td>{" "}
                <td className="border px-4 py-2">{item.menu_item}</td>
                <td className="border px-4 py-2">
                  ${item.price * item.count}
                </td>{" "}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <p className="font-bold">Total: ${total.toFixed(2)}</p>
          <p className="font-bold">Service Fee: ${serviceFee.toFixed(2)}</p>
          <p className="font-bold">Grand Total: ${grandTotal.toFixed(2)}</p>
        </div>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          <Link to="/ordersplaced">Place Order</Link>
        </button>
      </div>
    </div>
  );
};

export default CustCart;
