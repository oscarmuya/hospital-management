import { AlternateEmail, Key } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import db, { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleRegister = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError("");
    console.log("Signing in...");

    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const d = doc(db, `users/${res.user.uid}`);
        setDoc(d, {
          date: serverTimestamp(),
          email: res.user.email,
          role: "none",
        });
        setIsLoggingIn(false);
      })
      .catch((e) => {
        const err = e.code.replace("auth/", "").replace(/-/g, " ");
        setError(err);
        setIsLoggingIn(false);
        console.log(e.message);
      });
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setIsSignedIn(true);
      else setIsSignedIn(false);
    });

    return unsub;
  }, []);

  return (
    <div>
      <div
        style={{ height: "100vh" }}
        className="flex items-center justify-center"
      >
        {isSignedIn ? (
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1>Account created, contact Management to be guided further.</h1>
            <h1>Your email is {auth.currentUser?.email}</h1>
            <button onClick={() => auth.signOut()} className="underline">
              Log Out
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleRegister}
            className="w-11/12 md:w-1/3 bg-white p-5"
            action=""
          >
            <span className="text-center w-full capitalize my-2 text-sm font-bold text-red-500">
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
                  placeholder="Enter email"
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
                  placeholder="Enter password"
                  className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <button className="bg-black flex-1 rounded hover:opacity-70 transition-all text-white flex items-center justify-center w-full h-11 ">
                {isLoggingIn ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <div className="flex gap-4 items-center pt-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline text-sm "
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
