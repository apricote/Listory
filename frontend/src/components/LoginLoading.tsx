import React from "react";
import { Spinner } from "./Spinner";

export const LoginLoading: React.FC = () => (
  <main className="md:flex md:justify-center p-4">
    <div className="md:shrink-0 min-w-full md:min-w-0 md:w-1/3 l:w-1/5 xl:w-1/6 max-w-screen-lg shadow-xl bg-gray-100 rounded-lg m-2">
      <div className="text-white bg-green-500 rounded-lg rounded-b-none text-center mb-4 p-6">
        <span className="font-semibold text-xl tracking-tight">Listory</span>
      </div>
      <p className="text-2xl font-extralight text-gray-700 text-center p-6">
        Logging in
      </p>
      <Spinner className="p-6" size={128} />
    </div>
  </main>
);

<div className="shadow-xl bg-gray-100 rounded p-5 m-2"></div>;
