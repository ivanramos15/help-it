import { useEffect, useState } from "react";
import ItemCard from "../../Components/itemcard/ItemCard";
import "./not-found.css";
import { useNavigate } from "react-router";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase-config";

function NotFoundPage() {
  const navigate = useNavigate();
  const [notFoundItems, setNotFoundItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination using FILTERED ITEMS
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const changeView = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Fetch items
  useEffect(() => {
    onValue(ref(db, `/posts`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const tempArr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        tempArr.reverse();

        const filterArr = tempArr.filter((item) => item.found === false);

        setNotFoundItems(filterArr);
        setFilteredItems(filterArr);
      }
    });

    setDate();
  }, []);

  // Search Handler
  const handleSearch = (value) => {
    setSearchQuery(value);

    const lower = value.toLowerCase();

    const filtered = notFoundItems.filter((item) =>
      item.itemName?.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower)
    );

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleToCreatePost = () => {
    navigate("/create-post");
  };

  const setDate = function () {
    const now = new Date();

    const optionsDate = { day: "numeric", month: "long", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(now);
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(now);

    const finalOutput = `${formattedDate} — ${formattedTime}`;
    document.querySelector(".currentDate").textContent = finalOutput;
  };

  return (
    <div className="container">
      <div className="contentColumn">
        <h2 className="sectionTitle">Not Found Items</h2>
        <p className="sectionSubtitle">List of items that remain unclaimed.</p>

        <div className="topActionsRow">
          <div className="topRow">
            <span className="sortLabel">Sort: Latest ↑</span>
            <span className="currentDate">November 5, 2025 — 2:45 PM</span>
          </div>

          <div className="bottomRow">
            <button
              type="button"
              className="buttonPrimary"
              onClick={handleToCreatePost}
            >
              Create Post
            </button>

            <div className="searchBox">
              <input
                type="text"
                placeholder="Search"
                className="searchInput"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <img
                src="/search.svg"
                className="searchIcon"
                alt="Search"
              />
            </div>
          </div>
        </div>

        <div className="separator"></div>

        <div className="itemsGrid">
          {currentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              status="Not Found"
              postID={item.id}
            />
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <h3 className="no-items-message">
            No matching items found. Please try a different search.
          </h3>
        ) : (
          <></>
        )}

        <div className="paginationRow">
          <span className="paginationText" onClick={goPrevious}>
            Previous
          </span>

          <span className="paginationText" onClick={goNext}>
            Next
          </span>

          <span className="paginationText">View:</span>

          <select
            className="paginationView"
            value={itemsPerPage}
            onChange={(e) => changeView(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
