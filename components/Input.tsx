import React from "react";

interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

export const Input = (props: InputProps) => {
  return (
    <input
      className={`w-full text-black dark:text-white text-sm bg-white dark:bg-pitchblack py-2 px-6 rounded-lg outline-none transition-colors duration-200 ${props.className}`}
      placeholder={props.placeholder}
      type="text"
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};
