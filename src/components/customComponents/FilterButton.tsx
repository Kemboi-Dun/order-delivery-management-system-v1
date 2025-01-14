import React from "react";
import { FilterButtonProps } from "../../types/Types";
import { Button } from "antd";

const FilterButton: React.FC<FilterButtonProps> = ({
  type = "default",
  onClick,
  children,
}) => {
  const FilterButtonStyle: React.CSSProperties = {
    borderRadius: "4em",
    background: type === "default" ? "#212121" : "",
    border: type === "default" ? "#f2f2f2" : "",
    color: type === "default" ? "#f2f2f2" : "",
  };
  return (
    <Button type={type} onClick={onClick} style={FilterButtonStyle}>
      {children}
    </Button>
  );
};

export default FilterButton;
