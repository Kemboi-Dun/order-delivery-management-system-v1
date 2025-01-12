import { Button, Drawer, Flex, Tabs, TabsProps, Typography } from "antd";
import React from "react";
import CustomerListData from "../data/CustomerList.json";
import LiveLocationMap from "./LiveLocationMap";
import CustomerInfoOrders from "./CustomerInfoOrders";

const { Title } = Typography;

interface CustomerInfoInterface {
  openInfoDrawer: boolean;
  onCloseInfoDrawer: () => void;
  customerID: number;
}
// style live map wrapper
const livemapStyles: React.CSSProperties = {
  width: "100%",
  height: "50vh",
};

const CustomerInfoDrawer: React.FC<CustomerInfoInterface> = ({
  customerID,
  openInfoDrawer,
  onCloseInfoDrawer,
}) => {
  console.log("ACTIVE USER ID: ====== ", customerID);

  // get customer details
  const userDetails = CustomerListData?.find(
    (customer) => customer.id === customerID
  );

  // flatten customer address/location
  const customerAddress = userDetails?.location || null;

  const customerCoordinates: any = {
    ...userDetails?.location?.coordinates,
    location: `${userDetails?.location?.area}, ${userDetails?.location?.town}`,
  };

  const customerOrders = userDetails?.orders || [];

  // Map and Orders tab
  const customerInfoTabs: TabsProps["items"] = [
    {
      key: "orders",
      label: "Orders",
      children: <CustomerInfoOrders orders={customerOrders} />,
      icon: <i className="fa-solid fa-list"></i>,
    },
    {
      key: "map",
      label: "Map",
      children: (
        <div style={livemapStyles}>
          <LiveLocationMap customerCoordinates={customerCoordinates} />
        </div>
      ),
      icon: <i className="fa-solid fa-map-location-dot"></i>,
    },
  ];

  return (
    <Drawer
      title="User info"
      open={openInfoDrawer}
      onClose={onCloseInfoDrawer}
      closable
      width={700}
      destroyOnClose
    >
      <Flex gap="middle" justify="start" align="start" vertical>
        <Flex gap="small" vertical>
          <Title level={5}>User profile</Title>
          <Flex gap="large" justify="space-between" align="center" wrap>
            <p>
              <b>Full name: </b> {userDetails?.name}
            </p>
            <p>
              <b>Email: </b> {userDetails?.email}
            </p>
            <p>
              <b>Phone number: </b> {userDetails?.phone}
            </p>
            <p>
              <b>Town: </b> {customerAddress?.town}
            </p>
            <p>
              <b>Area: </b> {customerAddress?.area}
            </p>
          </Flex>
        </Flex>

        {/* <Divider /> */}

        <Tabs
          defaultActiveKey="orders"
          items={customerInfoTabs}
          style={{ width: "100%" }}
        />
      </Flex>
    </Drawer>
  );
};

export default CustomerInfoDrawer;
