import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Image from "../../../server/40364610_1.png";
const Manager = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [highestOrderedDish, setHighestOrderedDish] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [recentOrder, setRecentOrder] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const staffUser = JSON.parse(localStorage.getItem("staffUser"));
    if (staffUser) {
      setStaffName(`${staffUser.firstName} ${staffUser.lastName}`);
      setRestaurantName(staffUser.restaurant);
    }
  }, []);

  useEffect(() => {
    const fetchHighestOrderedDishAndRevenue = async () => {
      const restaurant_id = JSON.parse(
        localStorage.getItem("staffUser")
      )?.rest_id;

      try {
        const highestOrderedResponse = await fetch(
          `http://localhost:8000/analytics/${restaurant_id}/highest_ordered_dish`
        );
        const highestOrderedData = await highestOrderedResponse.json();
        setHighestOrderedDish(highestOrderedData);

        const totalRevenueResponse = await fetch(
          `http://localhost:8000/analytics/${restaurant_id}/total_revenue`
        );
        const totalRevenueData = await totalRevenueResponse.json();
        setTotalRevenue(totalRevenueData);
        const recent_Order = await fetch(
          `http://localhost:8000/analytics/${restaurant_id}/recent_order_status`
        );
        const recentOrderData = await recent_Order.json();
        setRecentOrder(recentOrderData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHighestOrderedDishAndRevenue();
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const restaurant_id = JSON.parse(
        localStorage.getItem("staffUser")
      )?.rest_id;

      try {
        const orderHistoryResponse = await fetch(
          `http://localhost:8000/orders/${restaurant_id}`
        );
        const orderHistoryData = await orderHistoryResponse.json();
        console.log(orderHistoryData);
        setOrderHistory(orderHistoryData);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchOrderHistory();
  }, []); // Separate useEffect for order history

  useEffect(() => {
    const staffUser = JSON.parse(localStorage.getItem("staffUser"));
    if (staffUser) {
      setStaffName(`${staffUser.firstName} ${staffUser.lastName}`);
    }
  }, []);

  console.log(recentOrder.Status);
  // const updateOrderStatus = async (orderId, status) => {
  //   try {
  //     await fetch(`http://localhost:8000/orders/${orderId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ status }),
  //     });

  //     console.log(status);
  //     // Update the local orderHistory state
  //     setOrderHistory(status);
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //   }
  // };
  // useEffect(() => {
  //   const fetchRestaurantImages = async () => {
  //     const restaurant_id = JSON.parse(
  //       localStorage.getItem("staffUser")
  //     )?.rest_id;

  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/save-images/${restaurant_id}`
  //       );
  //       // const data = await response.json();
  //       // Assuming the API returns the image URLs in the response
  //       // setRestaurantImages(data.images); // Update state with image URLs
  //     } catch (error) {
  //       console.error("Error fetching restaurant images:", error);
  //     }
  //   };

  //   fetchRestaurantImages(); // Call the new function
  // }, []);

  useEffect(() => {
    const fetchRestaurantImages = async () => {
      const restaurant_id = JSON.parse(
        localStorage.getItem("staffUser")
      )?.rest_id;

      try {
        const response = await fetch(
          `http://localhost:8000/save-images/${restaurant_id}`
        );
        const data = await response.json(); // Assuming the API returns the image URLs in the response
        setRestaurantImages(data.images); // Update state with image URLs
      } catch (error) {
        console.error("Error fetching restaurant images:", error);
      }
    };

    fetchRestaurantImages(); // Call the new function
  }, []);

  const restaurantImagesArray = [
    restaurantImages.image1,
    restaurantImages.image2,
  ].filter(Boolean);

  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % restaurantImagesArray.length; // Loop back to the first image
      } else {
        return (
          (prevIndex - 1 + restaurantImagesArray.length) %
          restaurantImagesArray.length
        ); // Loop back to the last image
      }
    });
  };

  console.log(totalRevenue.total_sales);
  console.log(highestOrderedDish);

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
        <h1 className="text-3xl font-bold mb-8">{restaurantName}</h1>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-[#A04732] p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Most Ordered</h3>
              <p className="text-xl font-bold">
                {highestOrderedDish.highest_ordered_dish}
              </p>
            </div>
            <div className="border-2 border-[#A04732] p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Revenue This Month</h3>
              <p className="text-xl font-bold">${totalRevenue.total_sales}</p>
            </div>
            <div className="border-2 border-[#A04732]  p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Ratings</h3>
              <p className="text-xl font-bold">4.8/5.0</p>
            </div>
            <div className="border-2 border-[#A04732]  p-4 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Recent Order Status</h3>
              <p className="text-xl font-bold">{recentOrder.Status}</p>
            </div>
          </div>
          <div className="border-2 border-[#A04732] p-4 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2 text-center">
              Restaurant Visualizations
            </h3>
            <div className="flex items-center">
              <button onClick={() => changeImage("prev")} className="mr-2">
                ←
              </button>
              {restaurantImagesArray.length > 0 && (
                <img
                  src={`data:image/png;base64,${restaurantImagesArray[currentImageIndex]}`}
                  alt={`Restaurant Image ${currentImageIndex + 1}`}
                  className="w-[600px] h-auto object-cover"
                />
              )}
              <button onClick={() => changeImage("next")} className="ml-2">
                →
              </button>
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
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orderHistory.recent_orders) && // Check for recent_orders
                  orderHistory.recent_orders.map(
                    (
                      order // Map over recent_orders
                    ) => (
                      <tr
                        key={order.id}
                        className="border-b-[2px] border-[#A04732]"
                      >
                        <td className="py-3">{order.order_id}</td>
                        <td className="py-3">{order.customer_name}</td>
                        <td className="py-3">
                          {typeof order.items_ordered === "string" && // Check if items_ordered is a string
                            Object.entries(
                              JSON.parse(order.items_ordered.replace(/'/g, '"'))
                            ).map(
                              // Replace single quotes and parse
                              ([item, quantity], index) => (
                                <div key={index}>
                                  {item} (Quantity: {quantity}) // Display item
                                  name and quantity
                                </div>
                              )
                            )}
                        </td>
                        <td className="py-3">${order.Amount}</td>
                        <td className="py-3">
                          <select
                            value={order.Status} // Ensure this is unique for each order
                            className="border rounded p-1"
                            // onChange={(e) => {
                            //   const updatedStatus = e.target.value;
                            //   updateOrderStatus(order.id, updatedStatus); // Call the function to update status
                            // }}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
