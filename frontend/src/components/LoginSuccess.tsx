import React from "react";
import { Navigate } from "react-router-dom";

export const LoginSuccess: React.FC = () => {
  return <Navigate to="/" replace />;
};
