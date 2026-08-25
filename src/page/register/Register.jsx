import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { get, ref, set } from "firebase/database";

function SignupForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const data = {
              fullName,
              email,
              contactNumber,
            };

            set(ref(db, `/admins/${user.uid}`), data).then(() => {
              document
                .querySelector(".success-modal")
                .classList.remove("hidden");
            });
          }
        });
      })
      .catch(() => {
        document.querySelector("#email").value = "";
        handleInvalidForm("Email is already in use.");
      });
  };

  const handleInvalidForm = (message = "Some fields are missing.") => {
    const errModal = document.querySelector(".error-modal");

    document.querySelector(".err-title").textContent = message;
    errModal.classList.remove("hidden");

    errModal.addEventListener("click", function () {
      errModal.classList.add("hidden");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        errModal.classList.add("hidden");
      }
    });
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const changeErrMessage = function (errLabel, error) {
    errLabel.textContent = error;
    errLabel.style.color = "red";
  };

  function verifyFullName(e) {
    let tempFullName = e.target.value;
    let errFullName = document.querySelector(".errFullName");
    errFullName.style.color = "white";
    setFullName(null);

    if (tempFullName.trim().length <= 0)
      changeErrMessage(errFullName, "Blankspace Not Allowed");
    else if (tempFullName.length <= 4)
      changeErrMessage(errFullName, "At least 4 characters");
    else setFullName(tempFullName);
  }

  function verifyContact(e) {
    let tempContact = e.target.value;
    let errContact = document.querySelector(".errContact");
    errContact.style.color = "white";
    setContactNumber(null);

    if (tempContact.trim().length <= 0)
      changeErrMessage(errContact, "Blankspace Not Allowed");
    else if (tempContact.length !== 11)
      changeErrMessage(errContact, "Must be 11 Numbers");
    else if (!tempContact.match(/^09\d{9}$/))
      changeErrMessage(errContact, "Invalid Format");
    else setContactNumber(tempContact);
  }

  function verifyEmail(e) {
    let tempEmail = e.target.value;
    let errEmail = document.querySelector(".errEmail");
    errEmail.style.color = "white";
    setEmail(null);

    if (tempEmail.trim().length <= 0)
      changeErrMessage(errEmail, "Blankspace Not Allowed");
    else if (!tempEmail.match(/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
      changeErrMessage(errEmail, "Invalid Format");
    else setEmail(tempEmail);
  }

  function verifyPassword(e) {
    let tempPassword = e.target.value;
    let errPassword = document.querySelector(".errPassword");
    errPassword.style.color = "white";
    setPassword(null);

    if (tempPassword.trim().length === 0) {
      changeErrMessage(errPassword, "Blankspace not allowed");
    } else if (tempPassword.length < 8) {
      changeErrMessage(errPassword, "Must be at least 8 characters");
    } else if (!/[a-z]/.test(tempPassword)) {
      changeErrMessage(errPassword, "Must contain a lowercase letter");
    } else if (!/[A-Z]/.test(tempPassword)) {
      changeErrMessage(errPassword, "Must contain an uppercase letter");
    } else if (!/\d/.test(tempPassword)) {
      changeErrMessage(errPassword, "Must contain a number");
    } else if (!/[@$!%*?&]/.test(tempPassword)) {
      changeErrMessage(
        errPassword,
        "Must contain a special character (@$!%*?&)"
      );
    } else {
      setPassword(tempPassword);
    }
  }

  function verifyConfPassword(e) {
    let tempConfPassword = e.target.value;
    let errConfPassword = document.querySelector(".errConfPassword");
    errConfPassword.style.color = "white";
    setConfirmPassword(null);

    if (tempConfPassword.trim().length === 0) {
      changeErrMessage(errConfPassword, "Blankspace not allowed");
    } else if (tempConfPassword !== password) {
      changeErrMessage(errConfPassword, "Password not match.");
    } else {
      setConfirmPassword(tempConfPassword);
    }
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <h1 className="register-main-title">Help It!</h1>
        <p className="register-subtitle">Helping items find their way home.</p>
      </header>

      <div className="register-form-container">
        <div className="register-form-header">
          <h2 className="register-form-title">Sign Up</h2>
          <p className="register-form-subtitle">
            Please fill in this form to create an account!
          </p>
        </div>

        <div className="register-form-content">
          <div className="register-input-column">
            <div className="register-input-group">
              <label htmlFor="fullName" className="register-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                onInput={(e) => {
                  verifyFullName(e);
                }}
                required
              />
              <p className="error-message errFullName">Error</p>
            </div>

            {/* <div className="register-input-group">
              <label htmlFor="username" className="register-label">Username</label>
              <input type="text" id="username" required value={username}onChange={(e) => setUsername(e.target.value)}/>
            </div> */}

            <div className="register-input-group">
              <label htmlFor="email" className="register-label">
                Email
              </label>
              <input
                type="email"
                onInput={(e) => {
                  verifyEmail(e);
                }}
                id="email"
                required
              />
              <p className="error-message errEmail">Error</p>
            </div>

            <div className="register-input-group">
              <label htmlFor="contactNumber" className="register-label">
                Contact Number
              </label>
              <input
                type="tel"
                onInput={(e) => {
                  verifyContact(e);
                }}
                id="contactNumber"
                required
              />
              <p className="error-message errContact">Error</p>
            </div>
          </div>

          <div className="register-input-column">
            <div className="register-input-group">
              <label htmlFor="password" className="register-label">
                Password
              </label>
              <input
                type="password"
                onInput={(e) => {
                  verifyPassword(e);
                }}
                id="password"
                required
              />
              <p className="error-message errPassword">Error</p>
            </div>

            <div className="register-input-group">
              <label htmlFor="confirmPassword" className="register-label">
                Confirm Password
              </label>
              <input
                type="password"
                onInput={(e) => {
                  verifyConfPassword(e);
                }}
                id="confirmPassword"
                required
              />
              <p className="error-message errConfPassword">Error</p>
            </div>
          </div>

          <div className="register-form-actions">
            {fullName &&
            email &&
            contactNumber &&
            password &&
            confirmPassword ? (
              <button
                type="button"
                className="register-button primary-btn"
                onClick={handleSubmit}
              >
                Sign up
              </button>
            ) : (
              <button
                type="button"
                className="register-button primary-btn"
                onClick={() => {
                  handleInvalidForm();
                }}
              >
                Sign up
              </button>
            )}

            <p className="register-login-prompt">
              {" "}
              Already have an account?{" "}
              <Link to="/login" className="register-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="register-modal-overlay success-modal hidden">
        <div className="register-modal-content success">
          <div className="register-icon-box success-icon">
            <span className="register-icon">&#10003;</span>
          </div>

          <h3 className="register-modal-title">Registration Successful</h3>
          <button
            type="button"
            className="register-button primary-btn modal-btn"
            onClick={handleBackToLogin}
          >
            {" "}
            Back to Login{" "}
          </button>
        </div>
      </div>

      <div className="register-modal-overlay error-modal hidden">
        <div className="register-modal-content error">
          <div className="register-icon-box error-icon">
            <span className="register-icon">&#10006;</span>
          </div>
          <h3 className="register-modal-title err-title">
            Some fields are missing.
          </h3>
          <p className="register-modal-msg">Please try again.</p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
