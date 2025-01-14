import { Button, ConfigProvider } from "antd";
import React from "react";
import { CustomButtonProp } from "../../types/Types";

const DefaultButton: React.FC<CustomButtonProp> = ({
  customStyle,
  children,
  ...props
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
      <Button {...props} style={{ ...customStyle }}>
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default DefaultButton;
