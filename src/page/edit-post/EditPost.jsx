import React, { useEffect, useState } from "react";
import "./edit-post.css";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db, storage } from "../../firebase-config";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as sref } from "firebase/storage";

function EditPost() {
  const today = new Date().toISOString().split("T")[0];
  const { postID } = useParams();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [dateMissing, setDateMissing] = useState("");

  useEffect(() => {
    setDate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(db, `/posts/${postID}`));
      if (snapshot.exists()) {
        const data = snapshot.val();

        setItemName(data.itemName || "");
        setItemDescription(data.description || "");
        setOwnerName(data.owner || "");
        setOwnerAddress(data.ownersAddress || "");
        setLastSeen(data.lastLocation || "");
        setDateMissing(data.dateMissing || "");
        setImageURL(data.imageURL || "");
      }
    };

    fetchData();
  }, [postID]);

  const setDate = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    document.querySelector(".hef-date").textContent =
      `${formattedDate} — ${formattedTime}`;
  };

  const handleSubmit = async () => {
    const fields = [
      itemName,
      itemDescription,
      ownerName,
      ownerAddress,
      lastSeen,
      dateMissing,
    ];

    if (!fields.every((f) => f.trim() !== "")) {
      const errModal = document.querySelector(".error-modal");
      errModal.classList.remove("hidden");

      setTimeout(() => {
        errModal.classList.add("hidden");
      }, 2000);

      return;
    }


    try {
      if (newImage) {
        await uploadBytes(sref(storage, `/itemImages/${postID}`), newImage);
        const url = await getDownloadURL(
          sref(storage, `/itemImages/${postID}`)
        );
        await update(ref(db, `/posts/${postID}`), { imageURL: url });
        setNewImage(null);
      }

      await update(ref(db, `/posts/${postID}`), {
        itemName,
        description: itemDescription,
        owner: ownerName,
        ownersAddress: ownerAddress,
        lastLocation: lastSeen,
        dateMissing,
      });

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const triggerUpload = () => {
    document.querySelector("#inpEditPicture").click();
  };

  const handleFile = (f) => {
    if (!f) return;
    setNewImage(f);
    const imageBox = document.querySelector(".hef-imgBox");
    imageBox.style.backgroundImage = `url(${URL.createObjectURL(f)})`;
    imageBox.style.backgroundPosition = "center";
    imageBox.style.backgroundRepeat = "no-repeat";
    imageBox.style.backgroundSize = "contain";
  };

  const handleBackToPost = () => {
    navigate("/found");
    setShowSuccess(false);
  };

  return (
    <div className="hef-page">
      <div className="hef-header">
        <h2 className="hef-title">Edit Post</h2>

        <div className="back-date-div">
          <Link to="/found" className="hef-link-back">
            {"<< Back to Post"}
          </Link>
          <span className="hef-date">Loading date...</span>
        </div>
      </div>

      <div className="hef-box">
        <div className="hef-form">
          <div className="hef-col hef-col-left">
            <input
              style={{ display: "none" }}
              type="file"
              id="inpEditPicture"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div
              className="hef-imgBox"
              onClick={triggerUpload}
              style={
                imageURL && !newImage
                  ? {
                      backgroundImage: `url(${imageURL})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                    }
                  : undefined
              }
            >
              <img
                src="https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-PNG-Clipart-Background.png"
                alt="Upload placeholder"
              />
            </div>

            <div className="hef-group">
              <label>Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="hef-group">
              <label>Item Description</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="hef-col hef-col-right">
            <div className="hef-group">
              <label>Owner's Full Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="hef-group">
              <label>Owner's Address</label>
              <input
                type="text"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
            </div>

            <div className="hef-group">
              <label>Last Seen</label>
              <input
                type="text"
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
              />
            </div>

            <div className="hef-group">
              <label>Date Missing</label>
              <input
                type="date"
                value={dateMissing}
                max={today}
                onChange={(e) => setDateMissing(e.target.value)}
              />
            </div>

            <button className="hef-btn hef-saveBtn" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="hef-modalOverlay">
          <div className="hef-modal hef-successModal">
            <div className="hef-iconBox hef-successBg">
              <span className="hef-icon">&#10003;</span>
            </div>

            <h3 className="hef-modalTitle">Changes Saved!</h3>
            <p className="hef-modalMsg">
              Your post has been successfully updated.
            </p>
            <button className="hef-btn hef-successBtn" onClick={handleBackToPost}>
              Back to Post
            </button>
          </div>
        </div>
      )}

      <div className="hef-modalOverlay error-modal hidden">
        <div className="hef-modal hef-errorModal">
          <div className="hef-iconBox hef-errorBg">
            <span className="hef-icon">&#10006;</span>
          </div>

          <h3 className="hef-modalTitle">Missing Fields</h3>
          <p className="hef-modalMsg">
            Please fill out all required fields before saving.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
