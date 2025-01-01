import { CircularProgress } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { AlternateEmail, Key } from "@mui/icons-material";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    return unsub;
  }, []);

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError("");
    console.log("Signing in...");

    signInWithEmailAndPassword(auth, email, password).catch((e) => {
      const err = e.code.replace("auth/", "").replace(/-/g, " ");
      setError(err);
      setIsLoggingIn(false);
      console.log(e.message);
    });
  };

  return (
    <div
      style={{ height: "100vh" }}
      className="flex items-center justify-center"
    >
      <form
        onSubmit={handleLogin}
        className="w-11/12 md:w-1/3 bg-white p-5"
        action=""
      >
        <span className="text-center my-2 text-sm font-bold text-red-500">
          {error}
        </span>
        <div className="form__control mb-4 flex flex-col gap-3">
          <label className="text-xs" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
              <AlternateEmail fontSize="small" color="inherit" />
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="john@doe.com"
              className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
            />
          </div>
        </div>

        <div className="form__control flex flex-col gap-3">
          <label className="text-xs" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
              <Key fontSize="small" color="inherit" />
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
            />
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-black rounded hover:opacity-70 transition-all text-white flex items-center justify-center w-full h-11 ">
            {isLoggingIn ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Log In"
            )}
          </button>

          <div className="flex gap-4 items-center pt-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="underline text-sm "
            >
              Reset password
            </button>
            <span>or</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="underline text-sm "
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
