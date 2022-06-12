import React from "react";

const Image = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "25px", height: "25px", cursor: "pointer" }}
      fill="none"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
};

export default Image;
