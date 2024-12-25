import { ChevronLeft } from "@mui/icons-material";
import { exactDateFormatter } from "../../../constants/helpers";
import { appointmentProps } from "../../../types";

interface Params {
  id: string;
  data: appointmentProps[];
  setActiveAppointment: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentView = ({ id, data, setActiveAppointment }: Params) => {
  const item = data.find((p) => p.id === id);

  return (
    <>
      <div className="p-3">
        <button
          onClick={() => setActiveAppointment("")}
          className="flex items-center justify-center gap-2"
        >
          <span className="rounded-full h-10 w-10 shadow border flex items-center justify-center">
            <ChevronLeft />
          </span>
          <span>back</span>
        </button>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold capitalize">
            Patient : {item?.name}
          </h1>

          <h1 className="text-2xl font-semibold capitalize">
            {item?.brief_reason}
          </h1>

          <div className="">
            <h4 className="font-semibold">Description</h4>
            <h3>{item?.description}</h3>
          </div>

          <h3 className="text-sm font-semibold">
            {exactDateFormatter(new Date(item?.date ?? ""))} at {item?.time}
          </h3>
        </div>
      </div>
    </>
  );
};

export default AppointmentView;
