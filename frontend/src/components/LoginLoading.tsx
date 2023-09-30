import React from "react";
import { Spinner } from "./ui/Spinner";

export const LoginLoading: React.FC = () => (
  <main className="sm:flex sm:justify-center p-4 dark:bg-gray-900 h-screen">
    <div className="sm:shrink-0 min-w-full sm:min-w-0 sm:w-1/2 md:w-1/3 l:w-1/5 xl:w-1/5 2xl:w-1/6 max-w-screen-lg max-h-min h-min shadow-xl bg-gray-100 dark:bg-gray-800 rounded-lg m-2">
      <div className="text-white bg-green-500 dark:bg-gray-700 rounded-lg rounded-b-none text-center mb-4 p-6">
        <span className="font-semibold text-xl tracking-tight">Listory</span>
      </div>
      <p className="text-2xl font-extralight text-gray-700 dark:text-gray-300 text-center p-6">
        Logging in
      </p>
      <Spinner className="p-6" iconClassName="h-32 w-32" />
    </div>
  </main>
);

<div className="shadow-xl bg-gray-100 rounded p-5 m-2"></div>;
