import { AlternateEmail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/firebase";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError("");
    setSuccess("");

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess("Password reset email sent");
        setIsLoggingIn(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoggingIn(false);
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
        <span className="text-center my-2 text-sm font-bold text-green-500">
          {success}
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

        <div className="mt-8">
          <button className="bg-black rounded hover:opacity-70 transition-all text-white flex items-center justify-center w-full h-11 ">
            {isLoggingIn ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Send password reset email"
            )}
          </button>
        </div>

        <div className="flex items-center pt-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="underline text-sm "
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
