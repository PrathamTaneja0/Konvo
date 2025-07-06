import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, setJwt } from "./Store/Auth/Action.js";
import NotFound from "./Components/NotFoundPage/NotFound.jsx";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import React from "react";

function App() {
  // Get JWT from localStorage and Redux auth state
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = React.useState(false);

  // On mount: set JWT in Redux and fetch user profile if JWT exists
  useEffect(() => {
    if (jwt && !auth.jwt) {
      dispatch(setJwt(jwt));
    }
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt));
    }
    // Mark auth as checked after a short delay or when user state changes
    if (!jwt || auth.user || (!jwt && !auth.user)) {
      setAuthChecked(true);
    }
  }, [jwt, dispatch, auth.user, auth.jwt]);

  // Redirect based on authentication state and current route
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isAuthRoute =
      currentPath === "/signin" ||
      currentPath === "/signup" ||
      currentPath === "/auth";
    // Allow NotFound for random URLs (not /signin, /signup, /auth, or /home)
    const isNotFound = !["/signin", "/signup", "/auth", "/home"].some((route) =>
      currentPath.startsWith(route)
    );
    if (auth.user) {
      if (isAuthRoute) {
        navigate("/home");
      }
    } else {
      if (!isAuthRoute && !isNotFound) {
        navigate("/auth");
      }
      // If isNotFound, do nothing (let NotFound render)
    }
  }, [auth.user, navigate]);

  // Add loading guard
  if (!authChecked) {
    return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
  }

  return (
    // App routes: show Authentication or HomePage based on auth state
    <ErrorBoundary>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/signin" element={<Authentication />} />
          <Route path="/signup" element={<Authentication />} />
          <Route path="/home/*" element={<HomePage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route
            path="/*"
            element={auth.user ? <HomePage /> : <NotFound />}
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;

// Prompt: "How do I implement protected routes with proper authentication checks?"
// Prompt: "The routing is not working properly after login. How can I debug this?"