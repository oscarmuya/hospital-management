import { useState } from "react";
import User from "./User";
import { userProps } from "../../../../types";
import UserList from "./UserList";

const Users = () => {
  const [activeEmployee, setActiveEmployee] = useState<userProps>();

  return (
    <div className="flex gap-5 p-5 h-full w-full">
      <UserList
        activeEmployee={activeEmployee}
        setActiveEmployee={setActiveEmployee}
      />
      <User employee={activeEmployee} />
    </div>
  );
};

export default Users;
