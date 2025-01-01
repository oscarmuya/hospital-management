import { ChevronRight, HowToReg, NoAccounts } from "@mui/icons-material";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { dateFormatter } from "../../../../constants/helpers";
import db, { auth } from "../../../../firebase/firebase";
import { userProps } from "../../../../types";

interface props {
  setActiveEmployee: React.Dispatch<
    React.SetStateAction<userProps | undefined>
  >;
  activeEmployee?: userProps;
}

const UserList = ({ setActiveEmployee, activeEmployee }: props) => {
  const [active, setActive] = useState<"active" | "inactive">("active");
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<userProps[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "users"),
      where("active", "==", active === "active")
    );

    const unsub = onSnapshot(q, (res) => {
      const t: userProps[] = [];
      res.docs.map((item) => {
        // @ts-ignore
        t.push({ id: item.id, ...item.data() });
      });
      setIsLoading(false);
      setEmployees(t);
    });

    return unsub;
  }, [active]);

  return (
    <div
      style={{ flex: "0.5" }}
      className="bg-white flex flex-col gap-2 relative p-3"
    >
      <div className="flex h-10 rounded overflow-hidden">
        <button
          onClick={() => setActive("active")}
          className={`${
            active === "active"
              ? "bg-primaryColor text-white"
              : "text-gray-800 bg-gray-100"
          } w-1/2 flex items-center transition-colors gap-2 justify-center`}
        >
          <h2 className="text-sm font-bold">ACTIVE</h2>
          <HowToReg color="inherit" fontSize="small" />
        </button>
        <button
          onClick={() => setActive("inactive")}
          className={`${
            active === "inactive"
              ? "bg-primaryColor text-white"
              : "text-gray-800 bg-gray-100"
          } w-1/2 flex items-center transition-colors gap-2 justify-center`}
        >
          <h2 className="text-sm font-bold">INACTIVE</h2>
          <NoAccounts color="inherit" fontSize="small" />
        </button>
      </div>

      {/* clients */}
      <div
        style={{ height: "90%" }}
        className={`${
          isLoading && "flex items-center justify-center"
        } bg-gray-50 flex-1 rounded`}
      >
        {" "}
        {isLoading ? (
          <div className="">
            <CircularProgress size={20} color="inherit" />
          </div>
        ) : (
          <div className="h-full scroller overflow-y-auto">
            {employees.map((employee) => (
              <button
                onClick={() =>
                  setActiveEmployee(
                    employee.id !== auth.currentUser?.uid ? employee : undefined
                  )
                }
                className={`${
                  activeEmployee?.id === employee.id && "bg-gray-100 "
                } ${
                  employee.id === auth.currentUser?.uid
                    ? "bg-orange-100 "
                    : "hover:bg-gray-100  "
                } h-24 w-full transition-all flex justify-between items-center border-b p-2 px-3`}
                key={employee.id}
              >
                <div className="flex flex-col items-start justify-evenly h-full">
                  <h1 className="font-bold">Name : {employee.name}</h1>
                  <h1 className="font-bold text-sm font-gray-800">
                    Email : {employee.email}
                  </h1>

                  <h1 className="text-xs text-gray-600 font-semibold">
                    Joined{" "}
                    {employee.date ? dateFormatter(employee.date.toDate()) : ""}
                  </h1>
                </div>
                <div className="h-full flex items-center justify-end">
                  <ChevronRight color="inherit" />
                </div>
              </button>
            ))}
            {employees.length === 0 && (
              <div className="h-full w-full flex items-center justify-center">
                <h1 className="text-sm font-bold">No {active} users!</h1>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
