import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, setJwt } from "./Store/Auth/Action.js";
import NotFound from "./Components/NotFound";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";

function App() {
  // Get JWT from localStorage and Redux auth state
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // On mount: set JWT in Redux and fetch user profile if JWT exists
  useEffect(() => {
    if (jwt && !auth.jwt) {
      dispatch(setJwt(jwt));
    }
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt));
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

  return (
    // App routes: show Authentication or HomePage based on auth state
    <ErrorBoundary>
      <div>
        <Routes>
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