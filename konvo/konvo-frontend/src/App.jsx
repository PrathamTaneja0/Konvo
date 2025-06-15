import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfile} from "./Store/Auth/Action.jsx";


function App() {
  const jwt = localStorage.getItem("jwt");
  const {auth} = useSelector(store=>store);


  const dispatch = useDispatch();
  useEffect(() => {
  if(jwt){
    dispatch(getUserProfile(jwt));
  }
  },[jwt, dispatch])
  return (
    <>
      <div>
        <Routes>
          <Route path="/*" element={auth.user?<HomePage />:<Authentication />} />
          {/* <Route path="/auth" element={<Authentication />} />
          <Route path = '/home' element ={<HomePage/>}/>
          <Route path="/signup" element={<Authentication />} />
          <Route path="/signin" element={<Authentication />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;