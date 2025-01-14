import { Tabs, TabsProps, Typography } from "antd";
import React, { useState } from "react";
import OrderList from "./OrderList";
import CustomersList from "./CustomersList";
import { OrdersProvider } from "../context/OrdersContext";
import { OrderDetailProvider } from "../context/OrderDetailContext";

const { Title } = Typography;

const homepageTabs: TabsProps["items"] = [
  {
    key: "orders",
    label: "Orders",
    children: (
      <OrdersProvider>
        <OrderList />
      </OrdersProvider>
    ),
    icon: <i className="fa-solid fa-list"></i>,
  },
  {
    key: "customers",
    label: "Customers",
    children: (
      <OrderDetailProvider>
        <CustomersList />
      </OrderDetailProvider>
    ),
    icon: <i className="fa-solid fa-users"></i>,
  },
];

const HomePage: React.FC = () => {
  const [tabTitle, setTabTitle] = useState<"Orders" | "Customers" | any>(
    "Orders"
  );

  const onChange = (key: string) => {
    console.log(key);
    const title = key.charAt(0).toUpperCase() + key.slice(1);
    setTabTitle(title);
  };

  return (
    <div style={{ padding: "1em" }}>
      <Title level={3}>{tabTitle}</Title>
      <Tabs
        defaultActiveKey="orders"
        items={homepageTabs}
        onChange={onChange}
      />
    </div>
  );
};

export default HomePage;
