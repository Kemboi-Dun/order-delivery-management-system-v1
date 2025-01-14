import { Space } from "antd";
import { Footer } from "antd/es/layout/layout";
import React from "react";

// style footer
const footerStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  fontWeight: "bold",
  padding: "0.5em 0",
};
const versionStyle: React.CSSProperties = {
  fontWeight: "normal",
  fontSize: "0.8em",
};

const AppFooter = () => {
  return (
    <Footer style={footerStyle}>
      <Space size="middle">
        <p>ODMS</p>
        <p style={versionStyle}>V0.0.1</p>
      </Space>
    </Footer>
  );
};

export default AppFooter;
