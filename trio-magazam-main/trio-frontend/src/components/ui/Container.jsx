import React from "react";

// Kiçik utility funksiyası: class-ları birləşdirmək üçün
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Container = ({ children, className }) => {
  return (
    <div className={cn("max-w-[1400px] mx-auto px-4 sm:px-6", className)}>
      {children}
    </div>
  );
};

export default Container;
