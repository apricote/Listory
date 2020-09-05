import { useCallback, useEffect, useState } from "react";

type UseAsync = <T>(
  asyncFunction: () => Promise<T>,
  initialValue: T
) => {
  pending: boolean;
  value: T;
  error: Error | null;
  reload: () => Promise<void>;
};

export const useAsync: UseAsync = <T extends any>(
  asyncFunction: () => Promise<T>,
  initialValue: T
) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setPending(true);
    setValue(initialValue);
    setError(null);
    return asyncFunction()
      .then((response) => setValue(response))
      .catch((err) => setError(err))
      .finally(() => setPending(false));
  }, [asyncFunction, initialValue]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    execute();
  }, [execute]);

  return { reload: execute, pending, value, error };
};
