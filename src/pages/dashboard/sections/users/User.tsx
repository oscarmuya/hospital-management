import {
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Badge } from "@mui/icons-material";
import { userProps } from "../../../../types";
import { countryCodes } from "../../../../constants/constants";
import { dateFormatter } from "../../../../constants/helpers";
import db from "../../../../firebase/firebase";
import useDebounce from "../../../../hooks/useDebounce";

interface props {
  employee?: userProps;
}

const User = ({ employee }: props) => {
  const [isActive, setIsActive] = useState(employee?.active ?? false);
  const debVal = useDebounce(isActive, 250);
  const [selectedPermissions, setSelectedPermissions] = useState(
    employee?.permissions ?? []
  );
  const debPermissions = useDebounce(selectedPermissions, 250);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [employeeName, setEmployeeName] = useState(employee?.name);
  const [employeePhone, setEmployeePhone] = useState(employee?.phone);
  const [employeeCountryCode, setEmployeeCountryCode] = useState(
    employee?.countryCode
  );

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

    const userDoc = doc(db, `users/${employee?.id}`);
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

  useEffect(() => {
    setIsActive(employee?.active ?? false);
    setSelectedPermissions(employee?.permissions ?? []);
    setEmployeeName(employee?.name);
    setEmployeeCountryCode(employee?.countryCode);
    setEmployeePhone(employee?.phone);
  }, [employee]);

  useEffect(() => {
    if (employee && !isFirstLoad) {
      const d = doc(db, `users/${employee.id}`);
      updateDoc(d, { active: isActive, permissions: debPermissions });
    }
    setIsFirstLoad(false);
  }, [debVal, debPermissions]);

  return (
    <div
      style={{ flex: "0.5" }}
      className="bg-white scroller overflow-y-auto flex flex-col relative p-3"
    >
      {employee ? (
        <>
          <div className="pb-3">
            <h2 className="font-semibold text-base">{employee?.name}</h2>
            <h5 className="text-xs text-gray-700 mt-1">
              Joined {employee ? dateFormatter(employee.date.toDate()) : ""}
            </h5>
          </div>

          <div className="border-y border-gray-100 py-3">
            <h2 className="font-semibold text-sm">User name</h2>
            <h2 className="text-xs">{employee?.name}</h2>
            <h2 className="font-semibold text-sm mt-3">User email</h2>
            <h5 className="text-xs">{employee?.email}</h5>
            <h2 className="font-semibold text-sm mt-3">Country code</h2>
            <h5 className="text-xs">{employee?.countryCode}</h5>
            <h2 className="font-semibold text-sm mt-3">Phone number</h2>
            <h5 className="text-xs">{employee?.phone}</h5>
          </div>

          <div className="">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                }
                label="Set user as active"
              />
            </FormGroup>
          </div>

          <form
            onSubmit={handleUpdateUser}
            id="update_form"
            className="flex text-sm flex-col gap-3"
            action=""
          >
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
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
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
                    value={employeeCountryCode}
                    onChange={(e) => setEmployeeCountryCode(e.target.value)}
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
                    value={employeePhone}
                    onChange={(e) => setEmployeePhone(e.target.value)}
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

            <div className="flex flex-col gap-1 items-center w-full p-3 justify-center">
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
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-sm font-semibold">Select a user to display</h2>
        </div>
      )}
    </div>
  );
};

export default User;
