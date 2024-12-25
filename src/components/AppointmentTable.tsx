import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { appointmentProps } from "../types";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { exactDateFormatter } from "../constants/helpers";

interface tableInterface {
  data: appointmentProps[];
  apiRef: React.MutableRefObject<GridApiCommunity>;
  setActiveAppointment: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentTable = ({
  data,
  apiRef,
  setActiveAppointment,
}: tableInterface) => {
  const [columnDefs] = useState<GridColDef[]>([
    {
      field: "",
      headerName: "",
      width: 100,
      cellClassName: "border-r",
      renderCell(params) {
        return (
          <div className="flex h-full items-center justify-center">
            <button
              onClick={() => {
                setActiveAppointment(params.row.id);
              }}
              style={{ pointerEvents: "all" }}
              className="bg-sky-500 hover:opacity-60 transition-all  px-3 p-2 h-6 relative flex items-center justify-center rounded"
            >
              <span className="text-xs text-white">View</span>
            </button>
          </div>
        );
      },
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "name",
      headerName: "Patient name",
      cellClassName: "border-r border-l",
      headerClassName: "border-r border-l bg-gray-50",
    },
    {
      field: "brief_reason",
      headerName: "Reason",
      sortable: true,
      cellClassName: "border-r",
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      sortable: true,
      cellClassName: "border-r",
      renderCell(params) {
        return (
          <div className="">
            <h1>
              {exactDateFormatter(new Date(params.value))} at {params.row.time}
            </h1>
          </div>
        );
      },
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      sortable: false,
      cellClassName: "border-r",
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "doctor_id",
      headerName: "Doctor ID",
      width: 140,
      sortable: true,
      cellClassName: "border-r",
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "email",
      headerName: "Email",
      width: 140,
      sortable: true,
      cellClassName: "border-r",
      headerClassName: "border-r bg-gray-50",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 200,
      sortable: true,
      renderCell(params) {
        return (
          <div className="">
            <h1>
              {params.row.countryCode} {params.value}
            </h1>
          </div>
        );
      },
      cellClassName: "border-r",
      headerClassName: "border-r bg-gray-50",
    },
  ]);

  return (
    <div className="bg-white h-full">
      <DataGrid
        className="scroller"
        style={{ height: "100%" }}
        apiRef={apiRef}
        rows={data}
        columns={columnDefs}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        checkboxSelection
        pageSizeOptions={[10, 30, 50, 100, Math.max(data.length, 150)]}
        pagination={true}
      />
    </div>
  );
};

export default AppointmentTable;
