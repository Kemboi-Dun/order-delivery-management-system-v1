import { useMemo } from "react";

export const useFormattedDateString = (dateString: string) => {
  const formattedDate = useMemo(() => {
    if (!dateString) return "";

    const formatDate = new Date(dateString);
    return `${formatDate.toDateString()}, ${formatDate.toLocaleTimeString()}`;
  }, [dateString]);
  return formattedDate;
};
