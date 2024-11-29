import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo.png";
import axios from "axios";
const Home = () => {
  const navigate = useNavigate();
  const [radius, setRadius] = useState(5);
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [rating, setRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [zipcode, setZipcode] = useState("12345");
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    liveSearch(searchQuery);
  };
  const handleLogout = () => {
    navigate("/");
  };
  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (curruser) {
      setUser(curruser.firstname);
    }
  }, []);

  const liveSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setRestaurants([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/restaurants/search/${query}`
      );
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      liveSearch(searchQuery);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, liveSearch]);

  return (
    <div className="min-h-screen bg-[#EDEAE2] pb-20">
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

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="w-full md:w-1/2">
          <div className="relative flex items-center gap-2">
            Zipcode:{" "}
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 inline-block"
              placeholder="Enter zipcode"
            />
            <button
              className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => {
                console.log("Searching with zipcode:", zipcode);
              }}
            >
              Set Location
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Radius: {radius}mi.
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
              >
                <option value="">All Categories</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Cafe</option>
                <option value="fastfood">Fast Food</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cuisine
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
              >
                <option value="">All Cuisines</option>
                <option value="italian">Italian</option>
                <option value="indian">Indian</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
              >
                <option value="">All Prices</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alcohol Served
              </label>
              <select
                value={alcohol}
                onChange={(e) => setAlcohol(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
              >
                <option value="">Both</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, cuisine, or borough..."
                  className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.restaurant_id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    navigate(`/restaurant/${restaurant.restaurant_id}`)
                  }
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {restaurant.name}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Cuisine:</span>
                      {restaurant.cuisine}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Borough:</span>
                      {restaurant.borough}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Rating:</span>
                      {restaurant.stars} ⭐
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {restaurants.length === 0 && !loading && searchQuery && (
              <div className="text-center text-gray-600 mt-8">
                No restaurants found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
