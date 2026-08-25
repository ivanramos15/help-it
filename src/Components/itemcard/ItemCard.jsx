import React from "react";
import "./item-card.css";
import { NavLink, useNavigate } from "react-router";

function ItemCard({ item, status, postID }) {
  const navigate = useNavigate();
  const statusClass = status === "Found" ? "status-found" : "status-not-found";

  const handleView = () => {
    if (status === "Found") {
      navigate(`/item-view-found/${postID}`);
    } else {
      navigate(`/item-view-not-found/${postID}`);
    }
  };

  return (
    <NavLink
      className="itemCard"
      to={`/item-view-${status !== "Found" ? "not-" : ""}found/${postID}`}
    >
      {item && (
        <>
          <div
            className="itemImage"
            style={{ backgroundImage: `url(${item.imageURL})` }}
          >
            {status && (
              <div className={`itemStatusTopRight ${statusClass}`}>
                <span className="statusText">{status}</span>
              </div>
            )}
          </div>

          <div className="itemContent">
            <div className="itemTitle">{item.itemName}</div>
            <div className="itemDescription">{item.description}</div>
            <div className="itemOwner">
              <span className="itemOwnerLabel">Owner:</span> {item.owner}
            </div>
            <div className="itemFooter">
              <span className="itemPosted">Posted on {item.datePosted}</span>
              <button className="viewButton" onClick={handleView}>
                View
              </button>
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default ItemCard;
