import React from "react";
import { useNavigate } from "react-router-dom";

export const LoginSuccess: React.FC = () => {
  useNavigate()("/", { replace: false });
  return null;
};
