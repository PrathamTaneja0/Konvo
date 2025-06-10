import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Authentication from "./Components/Authentication/Authentication";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          {/* <Route path="/auth" element={<Authentication />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
