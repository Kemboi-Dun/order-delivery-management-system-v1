import React from "react";
import { useOrderProvider } from "../context/OrdersContext";

const RidersTable:React.FC = () => {
  const { riders, orders } = useOrderProvider();

  return (
    <div>
      <h1>RidersTable</h1>
      <p>TEST CONTEXT PROPS: {riders.length}</p>
      <p>TEST CONTEXT PROPS [ORDERS----]: {orders.length}</p>
    </div>
  );
};

export default RidersTable;
