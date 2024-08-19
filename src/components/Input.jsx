import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div>
      {label && (
        <label className="block mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full p-2 outline-none bg-transparent border-yellow-500  border-b-2 duration-200 ${className}`}
        // className={`w-full p-2 bg-gray-800 rounded outline-none border-b  focus:bg-gray-600 duration-200 ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
