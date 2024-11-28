import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <div className="bg-[#EDEAE2] h-[100vh] w-[100vw]">
      <div className="pt-5">
        <h1 className="text-3xl">
          <img src={Logo} alt="" className="w-[300px]" />
        </h1>
      </div>
      <div className="flex space-x-40 justify-center mt-40">
        <div className="border-[3px] border-[#A04732] p-5 rounded-lg flex-col space-y-5">
          <h2 className="text-3xl text-[#A04732] font-bold">
            Existing customer
          </h2>
          <p>Lorem ipsum dolor sit amet.</p>

          <button className="p-2 text-white bg-[#A04732] rounded-lg">
            <Link to="/login">Login</Link>
          </button>
        </div>
        <div className="border-[3px] border-[#A04732] p-5 rounded-lg flex-col space-y-5">
          <h2 className="text-3xl text-[#A04732] font-bold">New customer?</h2>
          <p>Lorem ipsum dolor sit amet.</p>
          <button className="p-2 text-white bg-[#A04732] rounded-lg">
            <Link to="/signup">Signup</Link>
          </button>
        </div>
        <div className="border-[3px] border-[#A04732] p-5 rounded-lg flex-col space-y-5">
          <h2 className="text-3xl text-[#A04732] font-bold">
            Restaurant Manager or Chef?
          </h2>
          <p>Lorem ipsum dolor sit amet.</p>
          <button className="p-2 text-white bg-[#A04732] rounded-lg">
            <Link to="/stafflogin">Staff Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
