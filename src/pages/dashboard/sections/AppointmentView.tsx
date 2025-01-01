import { Close } from "@mui/icons-material";
import { exactDateFormatter } from "../../../constants/helpers";
import { appointmentProps } from "../../../types";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import db from "../../../firebase/firebase";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

interface Params {
  id: string;
  type: string;
  data: appointmentProps[];
  setActiveAppointment: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentView = ({ id, data, setActiveAppointment, type }: Params) => {
  const item = data.find((p) => p.id === id);
  const [finished, setFinished] = useState(item?.finished);
  const [confirmed, setConfirmed] = useState(item?.confirmed);
  const [cancelled, setCancelled] = useState(item?.cancelled);
  const [isLoading, setIsLoading] = useState(false);

  const markAppointment = (type: "finished" | "cancelled" | "confirmed") => {
    if (isLoading) return;
    setIsLoading(true);
    const this_doc = doc(db, `appointments/${id}`);

    updateDoc(this_doc, {
      [type]: true,
      [`${type}_time`]: serverTimestamp(),
    }).then(() => {
      if (type === "finished") setFinished(true);
      else if (type === "cancelled") setCancelled(true);
      else if (type === "confirmed") setConfirmed(true);
      setIsLoading(false);
    });
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="fixed flex items-center justify-center top-0 left-0 bg-black/50 z-50"
    >
      <div
        className="absolute cursor-pointer top-0 left-0 w-full h-full"
        onClick={() => setActiveAppointment("")}
      ></div>
      <div className="absolute top-5 right-12">
        <button
          onClick={() => setActiveAppointment("")}
          className="bg-white h-12 w-12 hover:opacity-60 transition-opacity text-black rounded-full flex items-center justify-center"
        >
          <Close color="inherit" />
        </button>
      </div>
      <div className="p-3 z-10 md:w-1/2">
        <div className="w-full shadow bg-white p-4 md:p-6 rounded">
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex w-full flex-col gap-3">
              <div className="">
                <h1 className="text-sm font-semibold">Patient name</h1>
                <h1 className="text-sm capitalize">{item?.name}</h1>
              </div>

              <div className="">
                <h1 className="text-sm font-semibold">Brief reason</h1>
                <h1 className="text-sm">{item?.brief_reason}</h1>
              </div>

              <div className="">
                <h4 className="font-semibold text-sm">Description</h4>
                <h3 className="text-sm">{item?.description}</h3>
              </div>

              <div className="">
                <h4 className="font-semibold text-sm">Date</h4>
                <h3 className="text-sm">
                  {exactDateFormatter(new Date(item?.date ?? ""))} at{" "}
                  {item?.time}
                </h3>
              </div>

              <div className="border-t flex justify-between items-center w-full pt-4">
                {!confirmed && type === "doctor_id" ? (
                  <button
                    onClick={() => markAppointment("confirmed")}
                    className="rounded w-48 h-12 text-white flex items-center justify-center bg-green-500"
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        Confirm Appointment
                      </span>
                    )}
                  </button>
                ) : (
                  <>
                    {item?.confirmed_time && type === "patient_id" && (
                      <h3 className="text-sm font-semibold">
                        Confirmed at{" "}
                        {exactDateFormatter(item.confirmed_time.toDate())}
                      </h3>
                    )}
                    {!cancelled &&
                      type === "doctor_id" &&
                      (finished && !cancelled && item ? (
                        item.finished_time && (
                          <h3 className="text-sm font-semibold">
                            Completed at{" "}
                            {exactDateFormatter(item.finished_time.toDate())}
                          </h3>
                        )
                      ) : (
                        <button
                          onClick={() => markAppointment("finished")}
                          className="rounded w-48 h-12 text-white flex items-center justify-center bg-sky-500"
                        >
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              Mark as completed
                            </span>
                          )}
                        </button>
                      ))}

                    {!finished &&
                      (cancelled && item ? (
                        item.cancelled_time && (
                          <h3 className="text-sm font-semibold">
                            Cancelled at{" "}
                            {exactDateFormatter(item.cancelled_time.toDate())}
                          </h3>
                        )
                      ) : (
                        <button
                          onClick={() => markAppointment("cancelled")}
                          className="rounded w-48 h-12 text-white flex items-center justify-center bg-red-500"
                        >
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              Cancel Appointment
                            </span>
                          )}
                        </button>
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentView;
