import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "../images/cart.svg";
import Logo from "../images/Logo.png";

const Restaurant = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [menuCounts, setMenuCounts] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (curruser) {
      setUser(curruser.firstname);
    }
  }, []);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantRes = await fetch(
          `http://localhost:8000/restaurants/${restaurantId}`
        );
        const restaurantData = await restaurantRes.json();
        console.log(restaurantData);

        const menuRes = await fetch(
          `http://localhost:8000/restaurants/${restaurantId}/menu`
        );
        const menuData = await menuRes.json();
        console.log(menuData);

        if (restaurantData.success) {
          setRestaurant(restaurantData.restaurant);
        }
        if (menuData.success) {
          setMenuItems(menuData.menu);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  const handleCountChange = (itemId, newCount) => {
    if (newCount >= 0 && newCount <= 5) {
      setMenuCounts((prev) => {
        const updatedCounts = {
          ...prev,
          [itemId]: newCount,
        };

        // Update local storage
        const currentCart = JSON.parse(localStorage.getItem("cart")) || {};
        if (newCount === 0) {
          delete currentCart[itemId]; // Remove item if count is 0
        } else {
          currentCart[itemId] = {
            menu_item: menuItems.find((item) => item.menu_item === itemId)
              .menu_item,
            price: menuItems.find((item) => item.menu_item === itemId).price,
            count: newCount,
            restaurant_id: restaurant.restaurant_id, // Store restaurant_id
            restaurant_name: restaurant.name, // Store restaurant name
          };
        }
        localStorage.setItem("cart", JSON.stringify(currentCart)); // Save updated cart to local storage

        return updatedCounts;
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user object from local storage
    navigate("/"); // Navigate to home
  };
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-10">Restaurant not found</div>;
  }
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
            Back
          </Link>
        </button>
        <button className="flex items-center space-x-2">
          <Link to="/cart">
            <img src={Cart} alt="" />
          </Link>
        </button>
      </div>
      <div className="w-full h-[200px] bg-gray-300">
        <img
          src={
            "https://cdn10.bostonmagazine.com/wp-content/uploads/sites/2/2023/10/WUSONG-ROAD_INTERIORS_BOSTON-MAGAZINE_BRIAN-SAMUELS-PHOTOGRAPHY_AUGUST-2023-IMG_3539-960x640.jpg"
          }
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span>{restaurant.borough}</span>
          <span>⭐ {restaurant.stars}</span>
          <span>({restaurant.review_count || 0} reviews)</span>
          <span className="ml-2">{restaurant.cuisine}</span>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.restaurant_id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{item.menu_item}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id={item.menu_item}
                    onClick={() =>
                      handleCountChange(
                        item.menu_item,
                        Math.max((menuCounts[item.menu_item] || 0) - 1, 0) // Ensure count doesn't go below 0
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{menuCounts[item.menu_item] || 0}</span>
                  <button
                    id={item.menu_item}
                    onClick={() =>
                      handleCountChange(
                        item.menu_item,
                        Math.min((menuCounts[item.menu_item] || 0) + 1, 5) // Ensure count doesn't exceed 5
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
