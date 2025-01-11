import { useMemo } from "react";

export const useOrderFilter = (value: string, data: any[]) => {
  const filteredValues = useMemo(() => {
    if (!value) return data;
    return data.map((item) => value);
  }, [value]);
  return filteredValues;
};
