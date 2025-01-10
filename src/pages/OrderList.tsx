import { Breadcrumb, Typography } from "antd";
import React from "react";

// Breadcrumb items
const breadCrumbItems = [
  {
    title: "Orders",
  },
];
const OrderList = () => {

  return (
    <div style={{ padding: "1em" }}>
      <Breadcrumb items={breadCrumbItems} />
    </div>
  );
};

export default OrderList;
