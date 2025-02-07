import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./Routers";
import AdminDash from "./components/AdminDash";
import AdminCategory from "./components/AdminCategory";

import CollectorDash from "./components/collectorDash";




const App = () => {
  return (
    <Routes>
      <Route path={"/register"} element={<Register />} />
      <Route path={"/"} element={<Login />} />
      <Route path={"/admin"} element={<AdminDash />} />

      <Route path={"/category"} element={<AdminCategory />} />

      <Route path={"/collector"} element={<CollectorDash />} />
    </Routes>
  );
};

export default App;
