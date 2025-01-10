import { Breadcrumb } from "antd";
import React from "react";

// Breadcrumb items
const breadCrumbItems = [
  {
    title: "Customers",
  },
];

const CustomersList = () => {
  return (
    <div style={{ padding: "1em" }}>
      <Breadcrumb items={breadCrumbItems} />
    </div>
  );
};

export default CustomersList;
