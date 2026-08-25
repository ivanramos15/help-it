import React, { useRef, useEffect, useState } from "react";
import "./item-information.css";
import { useNavigate } from "react-router-dom";
import { onValue, ref, remove, update } from "firebase/database";
import { db } from "../../firebase-config";



function ItemInformation({ status, postID }) {
  const isFound = status === "found";

  const [postData, setPostData] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();
  const isOwner = true;

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);

        if (modalType === "delete") {
          navigate("/found"); // back to Found page
        }
        if (modalType === "found") {
          navigate("/notfound"); // back to NotFound page
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, modalType, navigate]);




  useEffect(() => {
    onValue(ref(db, `/posts/${postID}`), (snapshot) => {
      setPostData(snapshot.val());
    });
  }, []);

  const handleMarkFound = () => {
    setModalType("found");
    setShowConfirm(true);
  };

  const handleDeletePost = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

    const confirmAction = async () => 
    {
      setShowConfirm(false);

      try {
        if (modalType === "delete") {
          await remove(ref(db, `/posts/${postID}`));  // DELETE from DB
        }

        if (modalType === "found") {
          await update(ref(db, `/posts/${postID}`), { found: true }); // mark as found
        }

        setShowSuccess(true); // show modal
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      }
    };


  const handleEditPost = () => {
    navigate(`/edit-post/${postID}`);
  };


  return (
    <>
      {postData && (
        <div className="item-info">
          <div className="item-box">
            <div className="image-box">
              <img
                src={postData.imageURL}
                alt={postData.title}
                className="item-image"
              />
              <span
                className={`status-label ${isFound ? "found" : "not-found"}`}
              >
                {isFound ? "Found" : "Not Found"}
              </span>
            </div>

            <div className="item-details">
              <h3 className="item-name">{postData.itemName}</h3>
              <p className="item-desc">{postData.description}</p>
              <p className="item-date">Posted on: {postData.datePosted}</p>
            </div>
          </div>

          <div className="divider" style={{ height: `${420}px` }}></div>

          <div className="item-info-details">
            <div className="item-info-text">
              <p>
                <b>Owner's Name: </b>
                {postData.owner}
              </p>
              <p>
                <b>Owner's Address: </b> {postData.ownersAddress}
              </p>
              <p>
                <b>Last Seen Location: </b> {postData.lastLocation}
              </p>
              <p>
                <b>Date Missing: </b> {postData.dateMissing}
              </p>
            </div>

            <div className="button-group">
              {isOwner && !isFound && (
                <button className="btn found-btn" onClick={handleMarkFound}>
                  Mark as Found
                </button>
              )}

              {isOwner && (
                <div className="side-buttons">
                  <button className="btn edit-btn" onClick={handleEditPost}>
                    Edit Post
                  </button>

                  <button className="btn delete-btn" onClick={handleDeletePost}>
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon-container error">
              <span className="modal-icon-text">!</span>
            </div>
            <h3>Are you sure?</h3>
            <p>You won’t be able to revert this!</p>

            <div className="modal-btn-group">
              <button className="confirm-btn" onClick={confirmAction}>
                {modalType === "found" ? "Yes, mark it" : "Delete Post"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                No, cancel!
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-box success">
            <div className="modal-check">&#10003;</div>
            <h3>
              {modalType === "found"
                ? "Successfully marked as found!"
                : "Post deleted successfully!"}
                
            </h3>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemInformation;
