import { Breadcrumb, Button, Flex, Space, Table, Tag } from "antd";
import React from "react";
import CustomerListData from "../data/CustomerList.json";

// customer data
// const customerData = ;

const CustomersList = () => {
  // customer list columns
  const customerTableColumns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Location",
      key: "area",
      dataIndex: ["location", "area"],
    },
    {
      title: "Town",
      key: "town",
      dataIndex: ["location", "town"],
    },
    {
      title: "Last Order",
      key: "lastOrder",
      render: (text: any, record: any) => {
        const lastOrder = record.orders[0];
        return lastOrder ? (
          <>
            <p>Order ID: {lastOrder?.orderId}</p>
            <Tag color={orderStatusTag(lastOrder?.status)}>
              {lastOrder?.status}
            </Tag>
            <p>Amount: KES {lastOrder?.amount}</p>
          </>
        ) : (
          <p>
            <p>No Orders</p>
          </p>
        );
      },
    },
    {
      // title:"Actions",
      key: "id",
      dataIndex: "id",
      render: (value: number) => (
        <Flex gap="small" vertical>
          <Button
            type="primary"
            icon={<i className="fa-regular fa-id-card"></i>}
          >
            View Info
          </Button>
          <Button
            icon={<i className="fa-solid fa-user-slash"></i>}
            type="dashed"
          >
            Deactivate
          </Button>
        </Flex>
      ),
    },
  ];
  // handle order status tag color
  const orderStatusTag = (status: string) => {
    switch (status) {
      case "Dispatched":
        return "volcano";
        break;
      case "Pending":
        return "purple";
        break;
      case "Cancelled":
        return "red";
        break;
      case "Delivered":
        return "green";
        break;
      default:
        return "default";
        break;
    }
  };

  return (
    <Table
      dataSource={CustomerListData}
      columns={customerTableColumns}
      rowKey="id"
    />
  );
};

export default CustomersList;
