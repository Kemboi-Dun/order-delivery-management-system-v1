import { Drawer } from "antd";
import React from "react";

// import LiveLocationMap from "./LiveLocationMap";
// import CustomerInfoOrders from "./CustomerInfoOrders";
// import { useOrderDetailProvider } from "../context/OrderDetailContext";
// import CustomerLocationWrapper from "./mapWrappers/CustomerLocationWrapper";
import CustomerDetailedDescription from "./CustomerDetailedDescription";
import { useOrderDetailProvider } from "../context/OrderDetailContext";

interface CustomerInfoInterface {
  openInfoDrawer: boolean;
  onCloseInfoDrawer: () => void;
}

const CustomerInfoDrawer: React.FC<CustomerInfoInterface> = ({
  openInfoDrawer,
  onCloseInfoDrawer,
}) => {
  const { customerID } = useOrderDetailProvider();

  return (
    <Drawer
      title="User info"
      open={openInfoDrawer}
      onClose={onCloseInfoDrawer}
      closable
      width={700}
      destroyOnClose
    >
      <CustomerDetailedDescription customerID={customerID} />
    </Drawer>
  );
};

export default CustomerInfoDrawer;
