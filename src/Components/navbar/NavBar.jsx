import "./nav-bar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../../firebase-config";

function NavBar() {
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      get(ref(db, `/admins/${u.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setAdmin(snapshot.val());
        }
      });
    });

    const successModal = document.querySelector(".success-modal-box");
    if (!localStorage.getItem("showSuccessModal")) {
      successModal.classList.add("hidden");
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        successModal.classList.add("hidden");
      }
    });
  }, []);

  const handleLoginSuccessContinue = () => {
    const successModal = document.querySelector(".success-modal-box");

    successModal.classList.add("hidden");
    localStorage.removeItem("showSuccessModal");

    successModal.addEventListener("click", function () {
      successModal.classList.add("hidden");
    });
  };

  const handleLogoutClick = () => {
    const logoutModal = document.querySelector(".confirm-modal");
    logoutModal.classList.remove("hidden");
  };

  const handleConfirmLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("showSuccessModal");
      window.location.href = "/login";
    });
  };

  const handleCloseModal = () => {
    const logoutModal = document.querySelector(".confirm-modal");
    logoutModal.classList.add("hidden");

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") logoutModal.classList.add("hidden");
    });
  };

  return (
    <>
      <nav className="navBar">
        <div className="brand-info">
          <h1 className="brand-title">Help It!</h1>
          <p className="welcome-message">Welcome {admin?.fullName}!</p>
        </div>

        <div className="links-container">
          <NavLink to="/found">Found</NavLink>
          <NavLink to="/notfound">Not Found</NavLink>
        </div>

        <div className="user-actions">
          <button className="logout-button" onClick={handleLogoutClick}>
            Log out
          </button>
        </div>
      </nav>

      <div
        className="modal-overlay confirm-modal hidden"
        onClick={handleCloseModal}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon-container error">
            <span className="modal-icon-text">!</span>
          </div>

          <h3 className="modal-title">Are you sure you want to log out?</h3>
          <div className="modal-button-container">
            <button className="modal-button yes" onClick={handleConfirmLogout}>
              Yes, Log Out
            </button>
            <button className="modal-button no" onClick={handleCloseModal}>
              No, cancel!
            </button>
          </div>
        </div>
      </div>

      <div className="modal-overlay success-modal-box">
        <div className="modal-content success-modal">
          <div className="icon-container success-icon-bg">
            <span className="modal-icons">&#10003;</span>
          </div>
          <h3 className="modal-title">Welcome!</h3>
          <button
            className="modal-button success-button"
            onClick={handleLoginSuccessContinue}
          >
            {" "}
            Continue{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
