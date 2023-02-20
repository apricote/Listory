import React from "react";
import { SpinnerIcon } from "../icons/Spinner";

interface SpinnerProps {
  className?: string;
  iconClassName?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className = "",
  iconClassName = "h-16 w-16",
}) => (
  <div className={`flex justify-center ${className}`}>
    <SpinnerIcon
      className={`${iconClassName} text-gray-300 dark:text-gray-700 fill-green-500`}
    />
  </div>
);
