import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase-config";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState(false);

  const showFailedModal = function () {
    const errModal = document.querySelector(".error-modal-box");

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

  const handleSubmit = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          localStorage.setItem("showSuccessModal", "true");

          document
            .querySelector(".success-modal-box")
            .classList.remove("hidden");
        })
        .catch(() => {
          showFailedModal();
        });
    } else {
      showFailedModal();
    }
  };

  const handleLoginSuccessContinue = () => {
    navigate("/found");
  };

  const fillDemoAccount = () => {
    setEmail("demouser@helpit.app");
    setPassword("Demo123!");
  };

  const openResetModal = () => {
    setResetEmail(email);
    setResetSent(false);
    setResetError(false);
    setResetModalOpen(true);
  };

  const sendResetEmail = () => {
    if (!resetEmail) {
      setResetError(true);
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setResetSent(true);
      })
      .catch(() => {
        setResetError(true);
      });
  };

  return (
    <div className="login-page">
      <header className="header-section">
        <h1 className="main-title">Help It!</h1>
        <p className="subtitle">Helping items find their way home.</p>
      </header>

      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Log In</h2>
        </div>

        <div className="login-form-content">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="button" className="login-button" onClick={handleSubmit}>
            Log In
          </button>

          <div className="forgot-password">
            <button
              type="button"
              className="link-text"
              onClick={openResetModal}
            >
              Forgot password?
            </button>
          </div>

          <div className="signup-prompt">
            Don't Have an account?{" "}
            <Link to="/register" className="link-text bold-link">
              Sign Up
            </Link>
          </div>

          <div className="demo-box">
            <p className="demo-title">Just looking around?</p>
            <p className="demo-credentials">
              Email: demouser@helpit.app
              <br />
              Password: Demo123!
            </p>
            <button type="button" className="demo-button" onClick={fillDemoAccount}>
              Fill demo account
            </button>
          </div>
        </div>
      </div>

      <div className="modal-overlay error-modal-box hidden">
        <div className="modal-content error-modal">
          <div className="icon-container error-icon-bg">
            <span className="modal-icons">&#10006;</span>
          </div>

          <h3 className="modal-title">Incorrect email or password.</h3>
          <p className="modal-message">Please try again.</p>
        </div>
      </div>

      {resetModalOpen && (
        <div className="modal-overlay" onClick={() => setResetModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {resetSent ? (
              <>
                <div className="icon-container success-icon-bg">
                  <span className="modal-icons">&#10003;</span>
                </div>

                <h3 className="modal-title">Reset email sent!</h3>
                <p className="modal-message">
                  Check {resetEmail} for a link to reset your password.
                </p>
                <button
                  className="modal-button success-button"
                  onClick={() => setResetModalOpen(false)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 className="modal-title">Reset your password</h3>
                <p className="modal-message">
                  Enter your email and we'll send you a reset link.
                </p>

                <div className="input-group">
                  <label htmlFor="resetEmail" className="input-label">
                    Email
                  </label>
                  <input
                    type="text"
                    id="resetEmail"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>

                {resetError && (
                  <p className="modal-message">
                    Please enter a valid email address.
                  </p>
                )}

                <button
                  className="modal-button success-button"
                  onClick={sendResetEmail}
                >
                  Send reset email
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="modal-overlay success-modal-box hidden">
        <div className="modal-content success-modal">
          <div className="icon-container success-icon-bg">
            <span className="modal-icons">&#10003;</span>
          </div>
          <h3 className="modal-title">Login Successful!</h3>
          <button
            className="modal-button success-button"
            onClick={handleLoginSuccessContinue}
          >
            {" "}
            Continue{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
