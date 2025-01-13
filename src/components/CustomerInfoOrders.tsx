import React from "react";
import { useFormattedDateString } from "../hooks/DateHook";
import { Button, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { statusColorTag } from "../utils/HelperFunctions";

interface CustomerInfoOrdersInterface {
  orders: any[];
}
const CustomerInfoOrders: React.FC<CustomerInfoOrdersInterface> = ({
  orders,
}) => {
  const navigate = useNavigate();

  // orders column
  const OrdersColumns = [
    {
      title: "Order ID",
      key: "orderId",
      dataIndex: "orderId",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColorTag(status)}>{status}</Tag>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      render: (value: number) => <p>KES {value}</p>,
      sorter: (a: any, b: any) => a?.amount - b?.amount,
    },
    {
      title: "Order Placed on",
      key: "date",
      dataIndex: "date",
      render: (value: any) => <p>{new Date(value).toLocaleString()}</p>,
    },
    {
      title: "Actions",
      key: "orderId",
      dataIndex: "orderId",
      render: (orderID: string) => (
        <Button type="dashed" onClick={() => navigate(`/order/${orderID}`)}>
          View Order
        </Button>
      ),
    },
  ];

  return <Table dataSource={orders} columns={OrdersColumns} rowKey="orderId" />;
};

export default CustomerInfoOrders;
