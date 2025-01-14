import { ConfigProvider, Flex, Layout } from "antd";

import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

import { Outlet } from "react-router-dom";
import { OrderDetailProvider } from "../context/OrderDetailContext";

const { Content } = Layout;

// content/outlet style
const outletStyle: React.CSSProperties = {
  maxWidth: "100%",
  width: "95%",
  margin: "auto",
  minHeight: "87vh",
  height: "100%",
  // backgroundColor: "#D3D3D3",
};

const AppLayout = () => {
  return (
    <Flex gap="middle" wrap>
      <Layout>
        <AppNavbar />
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#FF3941",
                colorPrimaryActive: "#B22A2F",
                colorPrimaryHover: "#D9363E",

                // algorithm: true,
              },
            },
          }}
        >
          <Content style={outletStyle}>
            <OrderDetailProvider>
              <Outlet />
            </OrderDetailProvider>
          </Content>
        </ConfigProvider>
        <AppFooter />
      </Layout>
    </Flex>
  );
};

export default AppLayout;
