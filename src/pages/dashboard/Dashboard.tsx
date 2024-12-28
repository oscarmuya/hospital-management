import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import db, { auth } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, addUserData } from "../../store/features/userSlice";
import { dateFormatter } from "../../constants/helpers";
import { Close, ManageAccounts, Medication } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Navigation from "./Navigation";
import Login from "../auth/Login";
import PatientForm from "./forms/PatientForm";
import DoctorForm from "./forms/DoctorForm";
import Account from "./sections/account/Account";
import AppointmentForm from "./forms/AppointmentForm";
import Appointments from "./sections/Appointments";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [active, setActive] = useState<string>("Clients");
  const [navbarOpen, setNavbarOpen] = useState(false);

  const [patientFormIsShown, setPatientFormIsShown] = useState(false);
  const [doctorFormIsShown, setDoctorFormIsShown] = useState(false);
  const [appointmentFormIsShown, setAppointmentFormIsShown] = useState(false);

  const [navContent, setNavContent] = useState([
    {
      icon: <ManageAccounts color="inherit" />,
      title: "My Details",
      action: () => setActive("My Details"),
      type: "profile",
    },
  ]);

  const tMain = [
    {
      icon: <ManageAccounts color="inherit" />,
      title: "My Details",
      action: () => setActive("My Details"),
      type: "profile",
    },
  ];

  const tDoctor = [
    {
      icon: <Medication color="inherit" />,
      title: "Upcoming Appointments",
      action: () => setActive("Upcoming Appointments"),
      type: "doctor",
    },
  ];

  const tPatient = [
    {
      icon: <Medication color="inherit" />,
      title: "My Appointments",
      action: () => setActive("My Appointments"),
      type: "patient",
    },
  ];

  const tAdmin = [
    {
      icon: <DashboardIcon color="inherit" />,
      title: "Dashboard",
      action: () => setActive("Dashboard"),
      type: "admin",
    },
  ];

  useEffect(() => {
    if (userData) {
      const r: {
        icon: JSX.Element;
        title: string;
        action: () => void;
        type: string;
      }[] = [];
      if (userData.role === "admin") {
        r.push(...tAdmin);
      } else if (userData.role === "patient") {
        setActive("My Appointments");
        r.push(...tPatient);
      } else if (userData.role === "doctor") {
        setActive("Upcoming Appointments");
        r.push(...tDoctor);
      }
      r.push(...tMain);
      setNavContent(r);
    }
  }, [userData]);

  useEffect(() => {
    let unsub1: Unsubscribe | undefined;
    let t: string | number | NodeJS.Timeout | undefined;
    const unsub = auth.onAuthStateChanged((user) => {
      if (t) clearTimeout(t);
      if (user) {
        setIsLoading(true);
        const userDoc = doc(db, `users/${auth.currentUser?.uid}`);
        t = setTimeout(() => {
          unsub1 = onSnapshot(userDoc, (snap) => {
            if (snap.id === auth.currentUser?.uid) {
              dispatch(
                addUserData({
                  ...snap.data(),
                  date: snap.data()?.date
                    ? dateFormatter(snap.data()?.date)
                    : "",
                  id: snap.id,
                })
              );
              if (snap.data()?.role !== "none") {
                setIsLoading(false);
                setIsLoggedIn(true);
              } else {
                setIsLoggedIn(false);
                setIsLoading(false);
              }
            }
          });
        }, 1500);
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });

    return () => {
      unsub();
      if (unsub1) unsub1();
      if (t) clearTimeout(t);
    };
  }, []);
  return isLoading ? (
    <div
      style={{ height: "100vh" }}
      className="flex items-center justify-center"
    >
      <CircularProgress />
    </div>
  ) : !isLoggedIn ? (
    <Login />
  ) : (
    <div className="relative full-static flex bg-gray-100 ">
      {(patientFormIsShown || doctorFormIsShown || appointmentFormIsShown) && (
        <div
          style={{ height: "100vh", width: "100vw" }}
          className="fixed flex items-center justify-center top-0 left-0 bg-black/50 z-50"
        >
          <div
            className="absolute cursor-pointer top-0 left-0 w-full h-full"
            onClick={() => setPatientFormIsShown(false)}
          ></div>
          <div className="absolute top-5 right-12">
            <button
              onClick={() => setPatientFormIsShown(false)}
              className="bg-white h-12 w-12 hover:opacity-60 transition-opacity text-black rounded-full flex items-center justify-center"
            >
              <Close color="inherit" />
            </button>
          </div>
          <div className="p-3 z-10 md:w-1/2">
            {patientFormIsShown ? (
              <PatientForm setPatientFormIsShown={setPatientFormIsShown} />
            ) : doctorFormIsShown ? (
              <DoctorForm setDoctorFormIsShown={setDoctorFormIsShown} />
            ) : (
              appointmentFormIsShown && (
                <AppointmentForm
                  setAppointmentFormIsShown={setAppointmentFormIsShown}
                />
              )
            )}
          </div>
        </div>
      )}

      <Navigation
        active={active}
        content={navContent}
        setNavbarOpen={setNavbarOpen}
        setDoctorFormIsShown={setDoctorFormIsShown}
        setPatientFormIsShown={setPatientFormIsShown}
        setAppointmentFormIsShown={setAppointmentFormIsShown}
      />
      <div
        className={`${
          navbarOpen ? "w-0-mobile overflow-hidden" : ""
        } content overflow-hidden w-full`}
      >
        {active === "My Details" && <Account />}
        {active === "My Appointments" && <Appointments id="patient_id" />}
        {active === "Upcoming Appointments" && <Appointments id="doctor_id" />}
      </div>
    </div>
  );
};

export default Dashboard;
