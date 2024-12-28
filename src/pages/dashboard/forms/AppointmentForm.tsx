import db from "../../../firebase/firebase";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { userProps } from "../../../types";
import { useSelector } from "react-redux";
import { getUserData } from "../../../store/features/userSlice";

interface props {
  setAppointmentFormIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

type formProps = {
  countryCode: string;
  email: string;
  phone: string;
};

const AppointmentForm = ({ setAppointmentFormIsShown }: props) => {
  const userData = useSelector(getUserData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<userProps[]>([]);

  useEffect(() => {
    const q2 = query(collection(db, "users"), where("role", "==", "doctor"));
    getDocs(q2).then((res) => {
      const t: userProps[] = [];
      res.docs.map((item) => {
        t.push({ ...(item.data() as userProps), id: item.id });
      });
      setUsers(t);
    });
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const form = document.getElementById("contact__form");
    // @ts-ignore
    const formData = new FormData(form);
    // @ts-ignore
    const data: formProps = Object.fromEntries(formData);

    const appointmentData = {
      ...data,
      patient_id: userData?.id,
      email: userData?.email,
      name: userData?.name,
      phone: userData?.phone,
      countryCode: userData?.countryCode,
      finished: false,
      cancelled: false,
      confirmed: false,
    };

    addDoc(collection(db, "appointments"), appointmentData)
      .then(() => {
        console.log("Created an appointment");
        setSuccess("Created an appointment");
        setIsSubmitting(false);
        setAppointmentFormIsShown(false);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess("");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-full shadow bg-white p-4 md:p-6 rounded">
      <form
        onSubmit={handleSubmit}
        className="flex text-sm flex-col gap-3"
        action=""
        id="contact__form"
      >
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="form__control flex-1  flex flex-col gap-3">
            <label className="text-xl font-semibold">Book an appointment</label>
          </div>
        </div>

        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Brief reason
          </label>
          <div className="relative flex gap-3">
            <div className="flex-1">
              <input
                autoComplete="off"
                required
                type="text"
                name="brief_reason"
                id="brief_reason"
                placeholder="Brief Reason"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
          </div>
        </div>

        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Description
          </label>
          <div className="relative flex gap-3">
            <div className="flex-1">
              <textarea
                autoComplete="off"
                name="description"
                id="description"
                placeholder="Description (optional)"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="form__control flex-1 flex flex-col gap-3">
            <label className="text-xs" htmlFor="email">
              Select a doctor
            </label>
            <div className="relative">
              <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
                <AlternateEmailIcon fontSize="small" color="inherit" />
              </span>
              <select
                required
                name="doctor_id"
                id="doctor_id"
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
              >
                <option value="">Select a doctor</option>
                {users.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Date
          </label>
          <div className="relative flex gap-3">
            <div className="flex-1">
              <input
                autoComplete="off"
                required
                type="date"
                name="date"
                id="date"
                placeholder="Date"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
            <div className="flex-1">
              <input
                autoComplete="off"
                required
                type="time"
                name="time"
                id="time"
                placeholder="Time"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center flex-col gap-1 justify-center">
          <button className="bg-primaryColor primary-button p-3 px-6 border border-transparent transition-all rounded-full text-white flex items-center justify-center">
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Book appointment"
            )}
          </button>
          <h2 className="text-center text-red-500 text-xs font-bold">
            {error}
          </h2>
          <h2 className="text-center text-green-500 text-xs font-bold">
            {success}
          </h2>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
