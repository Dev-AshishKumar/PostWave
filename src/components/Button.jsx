import React from "react";

export default function Button({
  children,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      className={`w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
