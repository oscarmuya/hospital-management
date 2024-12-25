import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../../../firebase/firebase";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { getUserData } from "../../../../../store/features/userSlice";

const Rightside = () => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const userData = useSelector(getUserData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendPassRestEmail = () => {
    if (isSendingEmail) return;
    setError("");
    setSuccess("");
    setIsSendingEmail(true);

    sendPasswordResetEmail(auth, userData?.email ?? "")
      .then(() => {
        setSuccess("Email sent");
        setIsSendingEmail(false);
      })
      .catch((e) => {
        setError(e.message);
        setIsSendingEmail(false);
      });
  };

  return (
    <div
      style={{ flex: "0.5" }}
      className="bg-white flex flex-col gap-2 relative p-3"
    >
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="">
        <h5 className="text-xs mb-2">Password reset</h5>

        <button
          onClick={handleSendPassRestEmail}
          className="text-sm text-white w-1/2 h-10 px-4 rounded bg-gray-600"
        >
          {isSendingEmail ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Send password reset email"
          )}
        </button>
        <p className="text-xs text-green-500 capitalize mt-1 font-bold">
          {success}
        </p>
        <p className="text-xs text-red-500 capitalize mt-1 font-bold">
          {error}
        </p>
      </div>
    </div>
  );
};

export default Rightside;
