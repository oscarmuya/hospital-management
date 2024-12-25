import { AlternateEmail, Badge } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { countryCodes } from "../../../../../constants/constants";
import { doc, updateDoc } from "firebase/firestore";
import db, { auth } from "../../../../../firebase/firebase";
import { useState } from "react";
import { getUserData } from "../../../../../store/features/userSlice";
import { CircularProgress } from "@mui/material";

const Leftside = () => {
  const userData = useSelector(getUserData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setError] = useState("");
  const [error, setSuccess] = useState("");

  const handleUpdateUser = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    setError("");
    setSuccess("");
    const form = document.getElementById("update_form");
    // @ts-ignore
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    const userDoc = doc(db, `users/${auth.currentUser?.uid}`);
    updateDoc(userDoc, { ...data })
      .then(() => {
        setIsUpdating(false);
        setError("");
        setSuccess("Updated details successfully");
      })
      .catch((err) => {
        setError(err.message);
        setIsUpdating(false);
      });
  };

  return (
    <div
      style={{ flex: "0.5" }}
      className="bg-white flex flex-col gap-2 relative p-3"
    >
      <h1 className="text-2xl font-bold mb-4">My details</h1>
      <form
        onSubmit={handleUpdateUser}
        id="update_form"
        className="flex text-sm flex-col gap-3"
        action=""
      >
        {/* email */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="form__control flex-1 flex flex-col gap-3">
            <label className="text-xs" htmlFor="email">
              My email
            </label>
            <div className="relative">
              <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
                <AlternateEmail fontSize="small" color="inherit" />
              </span>
              <input
                value={userData?.email}
                autoComplete="off"
                required
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
              />
            </div>
          </div>
        </div>
        {/* name */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="form__control flex-1 flex flex-col gap-3">
            <label className="text-xs" htmlFor="name">
              My name
            </label>
            <div className="relative">
              <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
                <Badge fontSize="small" color="inherit" />
              </span>
              <input
                defaultValue={userData?.name}
                autoComplete="off"
                required
                type="text"
                name="name"
                id="name"
                placeholder="Enter name"
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
              />
            </div>
          </div>
        </div>

        {/* phone number */}
        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Phone number
          </label>
          <div className="relative flex gap-3">
            <div className="h-full flex-1">
              <select
                defaultValue={userData?.countryCode}
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-4w-full bg-transparent h-full"
                name="countryCode"
                id="countryCode"
              >
                {countryCodes.map((code) => (
                  <option key={code.country} value={`+${code.code}`}>
                    {code.country} +{code.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <input
                defaultValue={userData?.phone}
                autoComplete="off"
                required
                type="tel"
                name="phone"
                id="phone"
                placeholder="Enter phone number"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center absolute bottom-0 left-0 w-full p-3 justify-center">
          <button className="bg-black w-1/3 primary-button p-3 h-12 px-6 border border-transparent transition-all rounded-full text-white flex items-center justify-center">
            {isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </button>
          <h4 className="text-sm font-bold text-green-500 text-center capitalize">
            {success}
          </h4>
          <h4 className="text-sm font-bold text-red-500 text-center capitalize">
            {error}
          </h4>
        </div>
      </form>
    </div>
  );
};

export default Leftside;
