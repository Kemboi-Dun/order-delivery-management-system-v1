import { Header } from "antd/es/layout/layout";
import React from "react";

// Header styles
const headerStyle: React.CSSProperties = {
  color: "#212121",
  backgroundColor: "#f9f9f9",
};
const logoStyle: React.CSSProperties = {
  fontWeight: "bold",
};

const AppNavbar = () => {
  return (
    <Header style={headerStyle}>
      <p style={logoStyle}>Order delivery management system</p>
    </Header>
  );
};

export default AppNavbar;
