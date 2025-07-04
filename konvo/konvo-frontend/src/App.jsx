import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, setJwt } from "./Store/Auth/Action.js";

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
    const isAuthRoute = currentPath === "/signin" || currentPath === "/signup" || currentPath === "/auth";
    if (auth.user) {
      // If authenticated and on an auth route, redirect to home
      if (isAuthRoute) {
        navigate("/home");
      }
    } else {
      // If not authenticated and not on an auth route, redirect to auth
      if (!isAuthRoute) {
        navigate("/auth");
      }
    }
  }, [auth.user, navigate]);

  return (
    // App routes: show Authentication or HomePage based on auth state
    <div>
      <Routes>
        <Route path="/signin" element={<Authentication />} />
        <Route path="/signup" element={<Authentication />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/*" element={auth.user ? <HomePage /> : <Authentication />} />
      </Routes>
    </div>
  );
}

export default App;