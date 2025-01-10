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
    <div >
      <Breadcrumb items={breadCrumbItems} />
    </div>
  );
};

export default CustomersList;
