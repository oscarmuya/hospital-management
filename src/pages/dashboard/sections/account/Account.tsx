import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";

const Account = () => {
  return (
    <div className="flex gap-5 p-5 h-full w-full">
      <Leftside />
      <Rightside />
    </div>
  );
};

export default Account;
