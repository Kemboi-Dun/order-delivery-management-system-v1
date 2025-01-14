import React from "react";

import { Button, ButtonProps } from "antd";

interface FilterButtonProp extends ButtonProps {
  customStyle?: React.CSSProperties;
}

const FilterButton: React.FC<FilterButtonProp> = ({
  customStyle,
  type = "default",
  children,
  ...props
}) => {
  const FilterButtonStyle: React.CSSProperties = {
    borderRadius: "4em",
    background: type === "default" ? "#212121" : "",
    border: type === "default" ? "#f2f2f2" : "",
    color: type === "default" ? "#f2f2f2" : "",
  };
  return (
    <Button
      {...props}
      type={type}
      style={{ ...FilterButtonStyle, ...customStyle }}
    >
      {children}
    </Button>
  );
};

export default FilterButton;
