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
  useEffect(() => {
  if(jwt){
    dispatch(getUserProfile(jwt));
  }
  },[jwt, dispatch])

  useEffect(() => {
    if (auth.user && window.location.pathname === "/") {
      navigate("/home"); // Redirect to /home if authenticated and at root
    }
    if (!auth.user && window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
      navigate("/auth"); // Redirect to /signin if not authenticated and not already on auth page
    }
  }, [auth.user, navigate]);

  return (
    <>
      <div>
        <Routes>
          <Route path="/signin" element={<Authentication />} />
          <Route path="/signup" element={<Authentication />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/*" element={auth.user ? <HomePage /> : <Authentication />} />
        </Routes>
      </div>
    </>
  );
}

export default App;