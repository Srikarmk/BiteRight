import { Route, Routes } from "react-router-dom";
import Landing from "./landing/Landing.jsx";
import Login from "./authentication/Login.jsx";
import Signup from "./authentication/Signup.jsx";
import StaffLogin from "./authentication/StaffLogin.jsx";
import Manager from "./staff/Manager.jsx";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/stafflogin" element={<StaffLogin></StaffLogin>}></Route>
        <Route path="/manager" element={<Manager></Manager>}></Route>
      </Routes>
    </div>
  );
};

export default App;
