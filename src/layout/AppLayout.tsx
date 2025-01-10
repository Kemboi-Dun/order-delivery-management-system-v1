import { Flex, Layout } from "antd";

import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

import { Outlet } from "react-router-dom";

const { Content } = Layout;

// content/outlet style
const outletStyle: React.CSSProperties = {
  width: "100%",
  height: "87vh",
  backgroundColor: "#D3D3D3",
};

const AppLayout = () => {
  return (
    <Flex gap="middle" wrap>
      <Layout>
        <AppNavbar />
        <Content style={outletStyle}>
          <Outlet />
        </Content>
        <AppFooter />
      </Layout>
    </Flex>
  );
};

export default AppLayout;
