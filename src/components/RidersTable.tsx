import React from "react";
import { useOrderProvider } from "../context/OrdersContext";
import { Badge, Button, Flex, Space, Table, TableProps, Tag } from "antd";
import { useColumnSearch } from "../utils/HelperFunctions";
import DefaultButton from "./customComponents/DefaultButton";

const RidersTable: React.FC = () => {
  const { riders } = useOrderProvider();
  const { getColumnSearchProps } = useColumnSearch();

  // Rider status tag color handler
  const getTagStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "on-delivery":
        return "processing";
      case "on-break":
        return "warning";
      case "deactivated":
        return "error";
      default:
        return "default";
    }
  };

  const ridersTableColumns: TableProps["columns"] = [
    {
      title: "Full Name",
      key: "name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Contact",
      key: "contact",
      dataIndex: "contact",
      ...getColumnSearchProps("contact"),
    },
    {
      title: "Vehicle Type",
      key: "vehicleType",
      dataIndex: "vehicleType",
      filters: [
        {
          text: "Bicycle",
          value: "bicycle",
        },
        {
          text: "Motorbike",
          value: "motorbike",
        },
        {
          text: "Van",
          value: "van",
        },
        {
          text: "Truck",
          value: "trick",
        },
      ],
      onFilter: (value: any, record: any) =>
        record?.vehicleType.indexOf(value) === 0,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: [
        {
          text: "Available",
          value: "available",
        },
        {
          text: "On Delivery",
          value: "on-delivery",
        },
        {
          text: "On Break",
          value: "on-break",
        },
      ],
      onFilter: (value: any, record: any) =>
        record?.status.indexOf(value) === 0,
      render: (value: string) => (
        <Badge status={getTagStatusColor(value)} text={value} />
      ),
    },
    {
      title: "Actions",
      key: "id",
      dataIndex: "id",
      render: (value: number, record: any) => (
        <Flex vertical gap="small">
          <Button type="primary" style={{ background: "#FF8225" }}>
            Dispatch
          </Button>
          {record?.status === "deactivated" ? (
            <Button
              type="dashed"
              icon={
                <i
                  className="fa-solid fa-user-check"
                  style={{ color: "#16C47F" }}
                ></i>
              }
            >
              Activate
            </Button>
          ) : (
            <Button
              type="text"
              icon={
                <i
                  className="fa-solid fa-user-xmark"
                  style={{ color: "#FC2947" }}
                ></i>
              }
            >
              Deactivate
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={Array.isArray(riders) ? riders : []}
        rowKey="id"
        columns={ridersTableColumns}
      />
    </>
  );
};

export default RidersTable;
