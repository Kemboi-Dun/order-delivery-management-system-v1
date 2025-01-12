import {
  Breadcrumb,
  Button,
  Flex,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useState } from "react";
import CustomerListData from "../data/CustomerList.json";
import CustomerInfoDrawer from "../components/CustomerInfoDrawer";
import { statusColorTag } from "../utils/HelperFunctions";

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
            <Tag color={statusColorTag(lastOrder?.status)}>
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
      render: (value: number, record: any) => (
        <>
          <Flex gap="small" vertical>
            <Button
              type="primary"
              icon={<i className="fa-regular fa-id-card"></i>}
              onClick={() => {
                setActiveUserId(value);
                setOpenInfoDrawer(true);
              }}
            >
              View Info
            </Button>
            <Popconfirm
              title={<p>Deactivate: {record?.name}</p>}
              description="Are you sure you want to deactivate this customer?"
              onConfirm={confirmDeactivate}
              onCancel={cancelDeactivate}
              okText="Deactivate"
              cancelText="Cancel"
            >
              <Button
                icon={<i className="fa-solid fa-user-slash"></i>}
                type="dashed"
              >
                Deactivate
              </Button>
            </Popconfirm>
          </Flex>
        </>
      ),
    },
  ];

  // View customer info
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | any>();

  //handle deactivate
  const confirmDeactivate: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("User deactivated");
  };

  const cancelDeactivate: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("User not deactivated");
  };

  return (
    <>
      <Table
        dataSource={CustomerListData}
        columns={customerTableColumns}
        rowKey="id"
      />
      <CustomerInfoDrawer
        customerID={activeUserId}
        openInfoDrawer={openInfoDrawer}
        onCloseInfoDrawer={() => setOpenInfoDrawer(false)}
      />
    </>
  );
};

export default CustomersList;
