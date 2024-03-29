import React from "react";
import { useQuery } from "../hooks/use-query";

export const LoginFailure: React.FC = () => {
  const query = useQuery();

  const source = query.get("source");
  const reason = query.get("reason");

  return (
    <div
      className="bg-yellow-100 dark:bg-gray-800 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-100 p-4 m-8"
      role="alert"
    >
      <p className="font-bold">Login Failure</p>
      <p>Something not ideal might be happening.</p>
      <p className="m-5 bg-gray-100 dark:bg-gray-700 p-5">
        <ul className="text-xs text-gray-700 dark:text-gray-300 font-mono">
          <li>Source: {source}</li>
          <li>Reason: {reason}</li>
        </ul>
      </p>
    </div>
  );
};
