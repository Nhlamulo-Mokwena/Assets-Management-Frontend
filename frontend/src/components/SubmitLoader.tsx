import React from "react";
import { ClipLoader } from "react-spinners";

const SubmitLoader = ({ loading }: { loading: boolean }) => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader size={40} color="black" loading={loading} />
    </div>
  );
};

export default SubmitLoader;
