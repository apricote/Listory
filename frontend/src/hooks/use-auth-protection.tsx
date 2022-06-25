import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth";

export function useAuthProtection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const requireUser = useCallback(async () => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return { requireUser };
}
