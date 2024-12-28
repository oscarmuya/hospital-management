export type userProps = {
  id: string;
  name: string;
  countryCode: string;
  date: any;
  email: string;
  phone: string;
  role: "none" | "patient" | "doctor" | "admin";
  permissions: string[];
  active: boolean;
  companyName: string;
  contactPerson: string;
};

export type appointmentProps = {
  id: string;
  name: string;
  brief_reason: string;
  countryCode: string;
  date: string;
  description: string;
  doctor_id: string;
  email: string;
  patient_id: string;
  phone: string;
  time: string;
  finished: boolean;
  cancelled: boolean;
  confirmed: boolean;
  finished_time: any;
  cancelled_time: any;
  confirmed_time: any;
};
