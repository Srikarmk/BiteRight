import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import Cart from "../images/cart.svg";
const Home = () => {
  const navigate = useNavigate();
  const [radius, setRadius] = useState(5);
  // const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  // const [alcohol, setAlcohol] = useState("");
  const [rating, setRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [zipcode, setZipcode] = useState("12345");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [allNearby, setAllNearby] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    liveSearch(searchQuery);
  };

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

  const fetchNearbyRestaurants = useCallback(async () => {
    try {
      const curruser = JSON.parse(localStorage.getItem("user")); // Retrieve user object
      const address = curruser ? curruser.address : null;
      if (!address) {
        console.error("Address not found in local storage");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/recognize-items/",
        {
          address: address,
          radius_km: radius,
        }
      );

      setNearbyRestaurants(response.data.results); // Store nearby restaurants in state
      console.log("Nearby Restaurants:", response.data.results);
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
    }
  }, [radius]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    if (curruser) {
      setUserName(curruser.firstname);
      fetchNearbyRestaurants();
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      fetchNearbyRestaurants();
    }
  }, [searchQuery]);

  useEffect(() => {
    let all_nearby = nearbyRestaurants?.nearby_restaurants || [];
    const filteredNearbyRestaurants = all_nearby.filter(
      (restaurant) =>
        (cuisine === "" ||
          restaurant.Cuisine.toLowerCase() === cuisine.toLowerCase()) &&
        (rating === "" || restaurant.Rating >= rating) && // Add rating filter
        (price === "" || restaurant.PriceRange == price) // Add category filter
    );
    setAllNearby(filteredNearbyRestaurants);
  }, [cuisine, rating, price, nearbyRestaurants]);

  useEffect(() => {
    fetchNearbyRestaurants();
  }, [radius, fetchNearbyRestaurants]);
  console.log(nearbyRestaurants.nearby_restaurants);

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
  useEffect(() => {
    const curruser = JSON.parse(localStorage.getItem("user"));
    console.log(curruser);
    if (curruser) {
      const user_val = curruser.firstName; // Corrected access to firstname
      console.log(user_val);
      setUserName(user_val);
    }
  }, []);
  console.log(userName);

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
                  <span>Welcome {userName}</span>
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
        <h1 className="flex items-center font-bold text-xl opacity-75">
          Welcome {userName} to Biteright, Go ahead and find a place to eat!
        </h1>
        <button className="flex items-center space-x-2">
          <Link to="/cart">
            <img src={Cart} alt="" />
          </Link>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="w-full md:w-1/2">
          <div className="relative flex items-center gap-2">
            Address:{" "}
            {userName
              ? JSON.parse(localStorage.getItem("user")).address
              : "No address found"}
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
                <option value="american">American</option>
                <option value="french">French</option>
                <option value="chinese">Chinese</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="asian">Asian</option>
                <option value="thai">Thai</option>
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
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
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
                <option value="3">3</option>
                <option value="3.5">3.5</option>
                <option value="4">4</option>
                <option value="4.5">4.5</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <form onSubmit={handleSearch} className="mb-8 w-full">
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
              {restaurants.length > 0 // Check if there are search results
                ? restaurants.map((restaurant) => (
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
                  ))
                : allNearby.map((restaurant) => (
                    <div
                      key={restaurant.restId}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/restaurant/${restaurant.restId}`)
                      }
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {restaurant.Name}
                      </h3>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Cuisine:</span>
                          {restaurant.Cuisine}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Borough:</span>
                          {restaurant.Borough}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Rating:</span>
                          {restaurant.Rating} ⭐
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
