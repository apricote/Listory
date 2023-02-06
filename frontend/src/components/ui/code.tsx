import React, { PropsWithChildren } from "react";

export const Code: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <code className="tracking-wide font-mono bg-gray-200 dark:bg-gray-600 rounded-md px-1">
      {children}
    </code>
  );
};
