import { Button, ConfigProvider } from "antd";
import React from "react";
import { DefaultButtonProps } from "../../types/Types";

const DefaultButton: React.FC<DefaultButtonProps> = ({
  icon,
  type = "primary",
  onClick,
  children,
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#155E95",
            colorPrimaryHover: "#6A80B9",
          },
        },
      }}
    >
      <Button type={type} onClick={onClick} icon={icon}>
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default DefaultButton;
