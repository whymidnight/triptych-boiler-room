import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import Casino from "src/containers/Casino/index";

export const CasinoPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="xquestingbg">
        <Casino />
      </div>
    </>
  );
};

export default CasinoPage;

