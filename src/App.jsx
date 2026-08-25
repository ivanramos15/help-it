import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./page/login/Login.jsx";
import Register from "./page/register/Register.jsx";
import NotFound from "./page/notfound/NotFound.jsx";
import NavBar from "./Components/navbar/NavBar.jsx";
import Found from "./page/found/Found.jsx";
import Error from "./page/error/Error.jsx";
import CreatePost from "./page/createPost/CreatePost.jsx";
import ItemViewNotFound from "./page/item-view-not-found/ItemViewNotFound.jsx";
import ItemViewFound from "./page/item-view-found/ItemViewFound.jsx";
import EditPost from "./page/edit-post/EditPost.jsx";
import "./index.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config.js";
function App() {
  const [user, setUser] = useState();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else setUser(null);
      setAuthReady(true);
    });
  }, []);

  if (!authReady) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        {user && <NavBar />}

        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route
                path="/notfound"
                element={
                  <>
                    <NotFound />
                  </>
                }
              />
              <Route
                path="/found"
                element={
                  <>
                    <Found />
                  </>
                }
              />
              <Route
                path="/create-post"
                element={
                  <>
                    <CreatePost />
                  </>
                }
              />
              <Route
                path="/item-view-not-found/:key"
                element={
                  <>
                    <ItemViewNotFound />
                  </>
                }
              />
              <Route
                path="/item-view-found/:key"
                element={
                  <>
                    <ItemViewFound />
                  </>
                }
              />
              <Route path="/edit-post/:postID" element={<EditPost />} />
              <Route path="*" element={<Navigate to="/found" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
