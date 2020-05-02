import { useLocation } from "react-router-dom";

export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}
