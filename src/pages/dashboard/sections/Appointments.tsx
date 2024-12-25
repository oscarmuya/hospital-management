import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import { appointmentProps } from "../../../types";
import db from "../../../firebase/firebase";
import AppointmentTable from "../../../components/AppointmentTable";
import { useSelector } from "react-redux";
import { getUserData } from "../../../store/features/userSlice";
import AppointmentView from "./AppointmentView";

interface Props {
  id: string;
}

const Appointments = ({ id }: Props) => {
  const [data, setData] = useState<appointmentProps[]>([]);
  const [isFinding, setIsFinding] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [activeAppointment, setActiveAppointment] = useState("");
  const tableApiRef = useGridApiRef();
  const userData = useSelector(getUserData);

  useEffect(() => {
    if (userData) {
      const q = query(
        collection(db, "appointments"),
        where(id, "==", userData.id)
      );
      getDocs(q).then((res) => {
        const t: appointmentProps[] = [];
        res.docs.map((item) => {
          // @ts-ignore
          t.push({ id: item.id, ...item.data() });
        });
        setData(t);
      });
    }
  }, [userData]);

  const handleFind = () => {
    if (startDate && endDate && !isFinding) {
      setIsFinding(true);
      const q = query(
        collection(db, "appointments"),
        where("date", ">=", new Date(startDate)),
        where("date", "<=", new Date(endDate)),
        orderBy("date", "desc")
      );
      getDocs(q).then((res) => {
        const t: appointmentProps[] = [];
        res.docs.map((item) => {
          // @ts-ignore
          t.push({ id: item.id, ...item.data() });
        });
        setData(t);
        setIsFinding(false);
      });
    }
  };

  const handleExportCsv = () => {
    tableApiRef.current.exportDataAsCsv({
      fileName: "appointments",
    });
  };

  const handleExportPdf = () => {
    tableApiRef.current.exportDataAsPrint({
      fileName: "appointments",
    });
  };

  return (
    <div className="h-full p-5">
      <div className="bg-white h-full overflow-y-auto flex flex-col gap-2 relative p-3">
        {activeAppointment.length > 0 ? (
          <AppointmentView
            setActiveAppointment={setActiveAppointment}
            data={data}
            id={activeAppointment}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFind();
                }}
                className="flex flex-row py-2 h-10 gap-2"
              >
                <div className="flex flex-row items-center gap-2">
                  <h1 className="text-sm font-bold">From</h1>
                  <input
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-4w-full bg-transparent h-full"
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <h1 className="text-sm font-bold">To</h1>
                  <input
                    required
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    name="endDate"
                    id="endDate"
                    className="border text-xs focus:border-primaryColor transition-all border-gray-300 w-full rounded p-3 px-4w-full bg-transparent h-full"
                  />
                </div>
                <div className="">
                  <button className="bg-primaryColor flex items-center justify-center h-full text-white text-sm p-1 px-4 rounded">
                    {isFinding ? (
                      <CircularProgress color="inherit" size={13} />
                    ) : (
                      "Find"
                    )}
                  </button>
                </div>
              </form>

              <div className="flex gap-3 bg-transparent">
                <button
                  onClick={handleExportPdf}
                  className="h-10 px-3 hover:opacity-60 transition-opacity rounded text-white bg-black/50 flex items-center justify-center"
                >
                  <h1 className="text-sm">Print</h1>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="h-10 px-3 hover:opacity-60 transition-opacity rounded text-white bg-black/50 flex items-center justify-center"
                >
                  <h1 className="text-sm">Export CSV</h1>
                </button>
              </div>
            </div>

            <div style={{ height: "90%" }} className="">
              <AppointmentTable
                setActiveAppointment={setActiveAppointment}
                apiRef={tableApiRef}
                data={data}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;
