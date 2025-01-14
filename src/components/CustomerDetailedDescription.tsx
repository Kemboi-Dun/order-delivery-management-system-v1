import { Empty, Flex, Tabs, TabsProps, Typography } from "antd";
import React, { useEffect, useState } from "react";
// import { useOrderDetailProvider } from "../context/OrderDetailContext";

import CustomerListData from "../data/CustomerList.json";
import CustomerInfoOrders from "./CustomerInfoOrders";
import CustomerLocationWrapper from "./mapWrappers/CustomerLocationWrapper";

// style live map wrapper
const livemapStyles: React.CSSProperties = {
  width: "100%",
  height: "50vh",
};

const { Title } = Typography;

interface CustomerProfileProps {
  customerID: number | string;
}

const CustomerDetailedDescription: React.FC<CustomerProfileProps> = ({
  customerID,
  
}) => {
  console.log("ACTIVE USER ID: ====== ", typeof customerID);

  const [userDetails, setUserDetails] = useState<any>();

  useEffect(() => {
    // get customer details
    const userInfo = CustomerListData?.find((customer) => customer?.id === customerID); // TODO: -- Update type

    setUserDetails(userInfo);
  }, [customerID]);
  console.log("User details : ===== ", userDetails);

  // flatten customer address/location
  const customerAddress = userDetails?.location || null;

  // TODO: --- Match with the live version
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
          {/* TODO:  Update data to match */}

          <CustomerLocationWrapper customerCoordinates={customerCoordinates} />
        </div>
      ),
      icon: <i className="fa-solid fa-map-location-dot"></i>,
    },
  ];
  return (
    <div>
      {userDetails ? (
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
      ) : (
        <Flex
          vertical
          gap="large"
          justify="center"
          align="center"
          style={{ width: "100%", height: "70vh"}}
        >
          <Empty />
        </Flex>
      )}
    </div>
  );
};

export default CustomerDetailedDescription;
