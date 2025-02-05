import React, { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [ListOfRestaurants, setListOfRestaurant] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(
        "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9715987&lng=77.5945627&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
      );
      const json = await data.json();
      console.log("API Response:", json); // Debug log

      // Update the path to match Swiggy's response structure
      const restaurants = json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];
      console.log("Extracted restaurants:", restaurants); // Debug log
      
      setListOfRestaurant(restaurants);
      setFilteredRestaurants(restaurants);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    if (isSearching) {
      setFilteredRestaurants(ListOfRestaurants);
      setSearchText("");
      setIsSearching(false);
    } else {
      if (searchText) {
        const filteredRestaurent = ListOfRestaurants.filter((res) =>
          res.info.name.toLowerCase().includes(searchText.toLowerCase())  // Changed from res.data to res.info
        );
        setFilteredRestaurants(filteredRestaurent);
        setIsSearching(true);
      }
    }
  };

  const handleTopRated = () => {
    const topRatedRestaurants = ListOfRestaurants.filter((res) => 
      res.info.avgRating >= 4.5  // Changed from res.data to res.info
    );
    setFilteredRestaurants(topRatedRestaurants);
  };

  return ListOfRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="filter">
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            value={searchText}
            placeholder="Search for restaurants..."
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value === "") {
                setFilteredRestaurants(ListOfRestaurants);
                setIsSearching(false);
              }
            }}
          />
          <button
            className="search-button"
            onClick={handleSearch}
          >
            {isSearching ? "All Restaurants" : "Search"}
          </button>
        </div>
        <button
          className="top-rated-button"
          onClick={handleTopRated}
        >
          Top Rated Restaurants
        </button>
      </div>
      <div className="res-container">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.info.id} 
            resData={restaurant.info}  // Changed from restaurant.data to restaurant.info
          />
        ))}
      </div>
    </div>
  );
};

export default Body;