import { useNavigate } from "react-router";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b flex items-center justify-between p-2 px-3 grad">
      <div className="">
        <img src={logo} className="w-20 h-20" />
      </div>
      <div className="flex justify-evenly gap-3">
        <button
          onClick={() => navigate("login")}
          className="bg-sky-500 text-white border rounded p-1 px-3"
        >
          <span className="text-md font-semibold">Login</span>
        </button>
        <button
          onClick={() => navigate("register")}
          className="bg-sky-500 text-white border rounded p-1 px-3"
        >
          <span className="text-md font-semibold">Register</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
