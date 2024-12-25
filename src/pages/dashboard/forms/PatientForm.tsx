import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { countryCodes } from "../../../constants/constants";
import db, { auth } from "../../../firebase/firebase";

interface props {
  setPatientFormIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

type formProps = {
  countryCode: string;
  email: string;
  phone: string;
};

const PatientForm = ({ setPatientFormIsShown }: props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const q2 = query(collection(db, "users"), where("role", "==", "none"));

    getDocs(q2).then((res) => {
      const t: string[] = [];
      res.docs.map((item) => {
        t.push(item.data().email);
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
    console.log(data);

    const q = query(collection(db, "users"), where("email", "==", data.email));
    console.log("fetching user..");
    setSuccess(`1 of 3 : fetching user with email - ${data.email}`);

    getDocs(q).then((res) => {
      if (!res.empty) {
        if (res.docs[0].data().role !== "none") {
          setError("employee with specified email already exists");
          setSuccess("");
          setIsSubmitting(false);
        } else {
          setSuccess(`2 of 3 : found user with email - ${data.email}`);
          console.log("found user...");
          const userDoc = res.docs[0].ref;

          setSuccess(`updating patient profile...`);
          console.log("updating patient profile...");
          const batch = writeBatch(db);

          batch.update(userDoc, {
            ...data,
            role: "patient",
            active: true,
          });

          batch
            .commit()
            .then(async () => {
              await sendPasswordResetEmail(auth, data.email);
              console.log("updated patient profile...");
              setSuccess(`3 of 3 : updated patient profile`);
              setIsSubmitting(false);
              setPatientFormIsShown(false);
            })
            .catch((err) => {
              setIsSubmitting(false);
              setSuccess("");
              setError(err.message);
            });
        }
      } else {
        setError("User with email not found...");
        setSuccess("");
        setIsSubmitting(false);
      }
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
            <label className="text-xl font-semibold">Add a patient</label>
          </div>
        </div>

        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Patient name
          </label>
          <div className="relative flex gap-3">
            <div className="flex-1">
              <input
                autoComplete="off"
                required
                type="text"
                name="name"
                id="name"
                placeholder="Enter patient's name"
                className="border w-full text-xs focus:border-primaryColor transition-all border-gray-300 rounded p-3 px-4"
              />
            </div>
          </div>
        </div>

        <div className="form__control flex-1 flex flex-col gap-3">
          <label className="text-xs" htmlFor="phone">
            Phone number
          </label>
          <div className="relative flex gap-3">
            <div className="h-full flex-1">
              <select
                required
                defaultValue=""
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-4w-full bg-transparent h-full"
                name="countryCode"
                id="countryCode"
              >
                <option value="">Select country code</option>
                {countryCodes.map((code) => (
                  <option key={code.country} value={`+${code.code}`}>
                    {code.country} +{code.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <input
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

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="form__control flex-1 flex flex-col gap-3">
            <label className="text-xs" htmlFor="email">
              Patient email
            </label>
            <div className="relative">
              <span className="absolute text-gray-600 left-3 top-1/2 center__50_50">
                <AlternateEmailIcon fontSize="small" color="inherit" />
              </span>
              <select
                required
                name="email"
                id="email"
                className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-11"
              >
                <option value="">Select an email</option>
                {users.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-col gap-1 justify-center">
          <button className="bg-primaryColor primary-button p-3 px-6 border border-transparent transition-all rounded-full text-white flex items-center justify-center">
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Register Patient"
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

export default PatientForm;
