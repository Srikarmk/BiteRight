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
    localStorage.removeItem("user");
    navigate("/");
  };
  const total = parseFloat(
    Object.entries(cartItems).reduce(
      (acc, [, item]) => acc + item.price * item.count,
      0
    )
  );

  const serviceFee = 5.0;
  const grandTotal = parseFloat(total + serviceFee);

  const handleDeleteItem = (key) => {
    const updatedCartItems = { ...cartItems }; // Create a shallow copy of the cartItems object
    delete updatedCartItems[key]; // Delete the item by key
    setCartItems(updatedCartItems); // Update the state with the new object
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  console.log(cartItems);

  const handlePlaceOrder = async () => {
    const details = JSON.parse(localStorage.getItem("cart")) || {};
    console.log(details);
    const firstItem = Object.values(details)[0];
    console.log(firstItem);
    console.log(Object.values(cartItems).map((item) => item.menu_item));
    const order = {
      restaurant_id: parseInt(firstItem.restaurant_id),
      restaurant_name: String(firstItem.restaurant_name),
      items_ordered: Object.values(cartItems).map((item) => item.menu_item),
      item_count: Object.values(cartItems).reduce(
        (acc, item) => acc + item.count,
        0
      ),
      amount: parseInt(grandTotal),
      status: "Pending",
    };
    console.log("Order to be sent:", JSON.stringify(order));

    try {
      const response = await fetch(`http://localhost:8000/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          `Failed to create order: ${
            responseData.message || response.statusText
          }`
        );
      }

      console.log(responseData.message);
      navigate("/ordersplaced");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  // const handlePlaceOrder = async () => {
  //   const currentCart = JSON.parse(localStorage.getItem("cart")) || {};
  //   const firstItem = Object.values(currentCart)[0];
  //   const currRestaurant = firstItem.restaurant_name || "default_name";
  //   const currRestaurantId = firstItem.restaurant_id || "default_id";
  //   const order = {
  //     restaurant_id: currRestaurant,
  //     restaurant_name: currRestaurantId,
  //     items_ordered: Object.keys(cartItems),
  //     item_count: Object.values(cartItems).reduce(
  //       (acc, item) => acc + item.count,
  //       0
  //     ),
  //     amount: grandTotal,
  //     status: "Pending", // or any initial status you want
  //   };

  //   try {
  //     const response = await fetch("http://localhost:8000/orders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(order),
  //     });
  //     console.log(order);
  //     if (!response.ok) {
  //       throw new Error("Failed to create order");
  //     }

  //     const data = await response.json();
  //     console.log(data.message); // Handle success message
  //     console.log("Order ID:", data.order_id); // Log the order ID
  //     navigate("/ordersplaced"); // Redirect to orders placed page
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     // Handle error (e.g., show a notification to the user)
  //   }
  // };
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
                <td className="border px-4 py-2">{item.count}</td>
                <td className="border px-4 py-2">{item.menu_item}</td>
                <td className="border px-4 py-2">${item.price * item.count}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteItem(key)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <p className="font-bold">Total: ${total.toFixed(2)}</p>
          <p className="font-bold">Service Fee: ${serviceFee.toFixed(2)}</p>
          <p className="font-bold">Grand Total: ${grandTotal.toFixed(2)}</p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handlePlaceOrder}
        >
          <Link to="/ordersplaced">Place Order</Link>
        </button>
      </div>
    </div>
  );
};

export default CustCart;
