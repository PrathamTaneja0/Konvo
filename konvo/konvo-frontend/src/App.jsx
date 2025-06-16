import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfile} from "./Store/Auth/Action.jsx";

function App() {
  const jwt = localStorage.getItem("jwt");
  const {auth} = useSelector(store=>store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // First useEffect: Handle initial auth state and JWT
  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt));
    }
  }, [jwt, dispatch, auth.user]);

  // Second useEffect: Handle navigation based on auth state
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isAuthRoute = currentPath === "/signin" || currentPath === "/signup" || currentPath === "/auth";
    
    if (auth.user) {
      // If user is authenticated and on auth routes, redirect to home
      if (isAuthRoute) {
        navigate("/home");
      }
    } else {
      // If user is not authenticated and not on auth routes, redirect to auth
      if (!isAuthRoute) {
        navigate("/auth");
      }
    }
  }, [auth.user, navigate]);

  return (
    <>
      <div>
        <Routes>
          <Route path="/signin" element={<Authentication />} />
          <Route path="/signup" element={<Authentication />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/*" element={auth.user ? <HomePage/> : <Authentication />} />
        </Routes>
      </div>
    </>
  );
}

export default App;