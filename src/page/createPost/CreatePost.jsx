import React, { useState, useEffect } from "react";
import "./create-post.css";
import { useNavigate, Link } from "react-router-dom";
import { get, push, ref, update } from "firebase/database";
import { db, storage, auth } from "../../firebase-config";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as sref } from "firebase/storage";

function CreatePost() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState();
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [imageURL, setImageURl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [dateMissing, setDateMissing] = useState("");

  useEffect(() => {
    setDate();
  }, []);

  const handleSubmit = () => {
    const fields = [itemName, itemDescription, lastSeen, dateMissing];

    const allOk = fields.every((field) => field.trim() !== "");

    if (allOk) {
      const dateNow = new Date().toISOString().split("T")[0];

      let newPost = {
        itemName: itemName,
        description: itemDescription,
        datePosted: dateNow,
        dateMissing: dateMissing,
        lastLocation: lastSeen,
        owner: ownerName || "N/A",
        ownersAddress: ownerAddress || "N/A",
        imageURL: "https://placehold.co/400?text=No+Image",
        found: false,
        userId: auth.currentUser?.uid,
      };

      push(ref(db, "/posts"), newPost);

      let tempArr;

      get(ref(db, `/posts`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          tempArr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          tempArr.reverse();

          setPost(tempArr[0]);
        }

        {
          imageURL &&
            uploadBytes(
              sref(storage, `/itemImages/${tempArr[0].id}`),
              imageURL
            ).then(() => {
              getDownloadURL(
                sref(storage, `/itemImages/${tempArr[0].id}`)
              ).then((url) => {
                update(ref(db, `/posts/${tempArr[0].id}`), {
                  imageURL: url,
                }).then(() => {});
              });
            });
        }
      });

      setShowSuccess(true);
    } else {
      const errModal = document.querySelector(".error-modal");
      errModal.classList.remove("hidden");

      errModal.addEventListener("click", function () {
        errModal.classList.add("hidden");
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          errModal.classList.add("hidden");
        }
      });
    }
  };

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
      hour12: true, // 12-hour format
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      now
    );
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      now
    );
    const finalOutput = `${formattedDate} — ${formattedTime}`;

    document.querySelector(".date").textContent = finalOutput;
  };

  const handleContinue = () => {
    navigate("/notfound");
    setShowSuccess(false);
  };

  const triggerUpload = function () {
    document.querySelector("#inpProfilePicture").click();
  };

  const handleFile = function (f) {
    if (!f) return;
    setImageURl(f);
    const imageBox = document.querySelector(".imgBox");
    imageBox.innerHTML = "";
    imageBox.style.backgroundImage = `url(${URL.createObjectURL(f)})`;
    imageBox.style.zIndex = "9";

    imageBox.style.backgroundPosition = "center";
    imageBox.style.backgroundRepeat = "no-repeat";
    imageBox.style.backgroundSize = "contain";
  };

  return (
    <div className="page">
      <div className="header">
        <h2 className="title">Post New Item</h2>
        <div className="back-date-div">
          <Link to="/found" className="link">
            {"<< Back to Post"}
          </Link>
          <span className="date">November 5, 2025 — 2:45 PM</span>
        </div>
      </div>

      <div className="box">
        <div className="form">
          <div className="col left">
            <input
              style={{ display: "none" }}
              type="file"
              id="inpProfilePicture"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="imgBox" onClick={triggerUpload}>
              <img
                src={
                  "https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-PNG-Clipart-Background.png"
                }
                alt=""
              />{" "}
              <br />
              <p>Upload Photo</p>
            </div>

            <div className="group">
              <label htmlFor="itemName" className="input-labels">
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                placeholder="Item Name"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="group">
              <label htmlFor="itemDescription" className="input-labels">
                Item Description
              </label>
              <textarea
                id="itemDescription"
                placeholder="Item description"
                required
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              ></textarea>
            </div>

          </div>

          <div className="col right">
            <div className="group">
              <label htmlFor="ownerName" className="input-labels">
                Owner's Full Name (Optional)
              </label>
              <input
                type="text"
                id="ownerName"
                placeholder="Owner's Full Name"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="group">
              <label htmlFor="ownerAddress" className="input-labels">
                Owner's Address (Optional)
              </label>
              <input
                type="text"
                id="ownerAddress"
                placeholder="Owner's Address"
                required
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
            </div>

            <div className="group">
              <label htmlFor="lastSeen" className="input-labels">
                Last Seen Location of Item
              </label>
              <input
                type="text"
                id="lastSeen"
                placeholder="Last Seen Location of Item"
                required
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
              />
            </div>

            <div className="group">
              <label htmlFor="dateMissing" className="input-labels">
                Date Missing
              </label>
              <input
                type="date"
                id="dateMissing"
                required
                value={dateMissing}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDateMissing(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn postBtn"
              onClick={handleSubmit}
            >
              Post Item
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <>
          <div className="modalOverlay success-modal">
            <div className="modal successModal">
              <div className="iconBox successBg">
                <span className="icon">&#10003;</span>
              </div>

              <h3 className="modalTitle">Item Posted Successfully!</h3>
              <button className="btn successBtn" onClick={handleContinue}>
                Continue to Feed
              </button>
            </div>
          </div>
        </>
      )}

      <div className="modalOverlay error-modal hidden">
        <div className="modal errorModal">
          <div className="iconBox errorBg">
            <span className="icon">&#10006;</span>
          </div>

          <h3 className="modalTitle">Missing Fields</h3>
          <p className="modalMsg">
            Please fill out all required fields before posting.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
