import React from "react";
import "../Loader.css";

const Loader = ({ className , imgClass}) => {
  return (
    <div
      className={`flex justify-center items-center h-screen bg-transparent ${className}`}
    >
      <img
        id="logo"
        src="https://post-wave.vercel.app/assets/favicon-DMJrj3-6.png"
        alt="Loader"
        className={`w-4/5 max-w-xs md:w-2/5 lg:w-1/4 max-md:w-1/5 ${imgClass}`}
      />
    </div>
  );
};

export default Loader;
