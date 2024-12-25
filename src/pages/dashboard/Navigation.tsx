import { ArrowForwardIos } from "@mui/icons-material";
import React, { useState } from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import logo from "../../assets/logo.svg";
import { useSelector } from "react-redux";
import { getUserData } from "../../store/features/userSlice";
import { auth } from "../../firebase/firebase";

interface navigationInterface {
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  active: string;
  content: {
    icon: JSX.Element;
    title: string;
    action: () => void;
    type: string;
  }[];
  setPatientFormIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  setDoctorFormIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  setAppointmentFormIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navigation({
  content,
  active,
  setPatientFormIsShown,
  setDoctorFormIsShown,
  setAppointmentFormIsShown,
}: navigationInterface) {
  const [menuOpen] = useState(true);
  const userData = useSelector(getUserData);

  return (
    <div
      className={`${
        menuOpen ? " w-64" : "w-12"
      } transition-smooth sticky  select-none flex flex-col full-height top-0 bg-white left-0`}
    >
      {/* header */}
      <div
        style={{ flex: "0.15" }}
        className={`${
          !menuOpen && "flex-col-reverse pt-4 "
        } border-b flex bg-gray-700 items-center px-3 justify-between  relative`}
      >
        <div className="logo__div flex items-center justify-center w-full">
          <a href="/">
            <img src={logo} alt="logo" className="h-16 aspect-auto" />
          </a>
        </div>
      </div>
      {/* content */}

      {userData?.role === "admin" && (
        <>
          <h1 className="px-3 py-2 text-gray-800 font-semibold text-sm">Add</h1>
          <div className="flex border-b px-3 gap-1">
            <div className="w-1/2 pb-4">
              <button
                onClick={() => setPatientFormIsShown(true)}
                className="h-10 w-full hover:opacity-60 transition-opacity rounded text-white bg-black/50 flex items-center justify-center"
              >
                <h1 className="text-sm">Patient</h1>
              </button>
            </div>
            <div className="w-1/2  pb-4">
              <button
                onClick={() => setDoctorFormIsShown(true)}
                className="h-10 w-full hover:opacity-60 transition-opacity rounded text-white bg-black/50 flex items-center justify-center"
              >
                <h1 className="text-sm">Doctor</h1>
              </button>
            </div>
          </div>
        </>
      )}

      {userData?.role === "patient" && (
        <div className="flex border-b px-3 pt-3 gap-1">
          <div className="w-full pb-4">
            <button
              onClick={() => setAppointmentFormIsShown(true)}
              className="h-10 w-full hover:opacity-60 transition-opacity rounded text-white bg-black/50 flex items-center justify-center"
            >
              <h1 className="text-sm">Book an appointment</h1>
            </button>
          </div>
        </div>
      )}
      <div
        className="overflow-y-auto scroller overflow-x-hidden"
        style={{ flex: "0.8" }}
      >
        {content.map((nav, key) => {
          return (
            <div key={key} className="">
              <h4 className="capitalize text-gray-500 pt-2 mt-2 mb-1 px-4 text-sm">
                {nav.type}
              </h4>

              <div
                title={nav.title}
                onClick={nav.action}
                className={`
                  ${
                    active === nav.title ? "text-sky-500" : "text-gray-800 "
                  } flex hover:text-primaryColor transition-colors justify-between gap-3 items-center py-3 cursor-pointer px-3
                  pt-6
                  `}
              >
                <div style={{ flex: "0.1" }}>{nav.icon}</div>
                <div style={{ flex: "0.8" }}>
                  <h1 className="font-semibold text-base text-start">
                    {nav.title}
                  </h1>
                </div>
                <div style={{ flex: "0.1" }}>
                  <ArrowForwardIos fontSize="small" color="inherit" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* footer */}
      <div style={{ flex: "0.1" }} className="border-t relative">
        <h1 className="px-3 pt-2 text-center text-sm font-bold">
          {userData?.name}
        </h1>
        <div className="p-3 hover:text-primaryColor transition-colors items-center cursor-pointer flex gap-3">
          <div className="w-full hover:text-primaryColor transition-colors items-center cursor-pointer flex gap-3">
            <button
              onClick={() => auth.signOut()}
              className="flex hover:opacity-70 transition-opacity items-center justify-center h-8 w-full gap-2 text-white bg-black/60 rounded"
            >
              <PowerSettingsNewIcon fontSize="small" color="inherit" />
              {menuOpen && <h2 className="text-sm font-semibold">Log out</h2>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
