import React from "react";
import { FilterButtonProps } from "../../types/Types";
import { Button } from "antd";


const FilterButtonStyle: React.CSSProperties = {
borderRadius:"4em"
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  type = "default",
  onClick,
  children
}) => {
  return (
    <Button type={type} onClick={onClick}  style={FilterButtonStyle}>
      {children}
    </Button>
  );
};

export default FilterButton;
