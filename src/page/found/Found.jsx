import "./found.css";
import ItemCard from "../../Components/itemcard/ItemCard";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../firebase-config";

function FoundPage() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [dateTime, setDateTime] = useState();
  const [user, setUser] = useState();
  const [sortOrder, setSortOrder] = useState("desc");


  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };


  const handleToCreatePost = () => {
    navigate("/create-post");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    onValue(ref(db, `/posts`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const tempArr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const filterArr = tempArr
          .filter((item) => item.found === true)
          .reverse();

        setFoundItems(filterArr);
      }
    });

    setDate();
  }, []);

  const setDate = function () {
    const now = new Date();

    const optionsDate = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      now
    );
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      now
    );
    const finalOutput = `${formattedDate} — ${formattedTime}`;

    document.querySelector(".currentDate").textContent = finalOutput;
  };

    const filteredItems = foundItems .filter((item) => 
    {
      const text = searchQuery.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text) ||
        item.owner.toLowerCase().includes(text)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.datePosted);
      const dateB = new Date(b.datePosted);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const paginatedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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


  return (
    <div className="container">
      <div className="contentColumn">
        <h2 className="sectionTitle">Found Items </h2>
        <p className="sectionSubtitle">List of items that have been found.</p>

        <div className="topActionsRow">
          <div className="topRow">
            <span className="sortLabel" onClick={toggleSortOrder} style={{ cursor: "pointer" }}>
              Sort: {sortOrder === "desc" ? "Oldest ↑" : "Latest ↓"}
            </span>
            <span className="currentDate">November 10, 2025 — 5:00 PM</span>
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
          {foundItems && (
            <>
              {paginatedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  status="Found"
                  postID={item.id}
                />
              ))}
            </>
          )}
        </div>

        {filteredItems.length === 0 ? 
        (
          <h3 className="no-items-message" style={{ textAlign: "center", marginTop: "50px", width: "100%" }}>
            No items match your search.
          </h3>
        ) : null}


        <div className="paginationRow">
          <span className="paginationText" onClick={goPrevious} style={{ cursor: "pointer" }}>
            Previous
          </span>

          <span className="paginationText" onClick={goNext} style={{ cursor: "pointer" }}>
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

export default FoundPage;
