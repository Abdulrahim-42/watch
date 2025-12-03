import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full 
        bg-[#5C4977] 
        hover:bg-[#5C4977]/90 
        text-white 
        py-3 
        rounded-lg 
        text-sm 
        font-semibold 
        transition-colors 
        duration-200 
        cursor-pointer
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
