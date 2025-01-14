import React, { ReactNode, useState } from "react";
import { useOrderProvider } from "../context/OrdersContext";
import {
  Badge,
  Button,
  Flex,
  message,
  notification,
  Popconfirm,
  PopconfirmProps,
  Table,
  TableProps,
} from "antd";
import { useColumnSearch } from "../utils/HelperFunctions";

const RidersTable: React.FC = () => {
  const { riders } = useOrderProvider();
  const { getColumnSearchProps } = useColumnSearch();

  const [api, contextHolder] = notification.useNotification();

  // dispatch handler
  const openDispatchHandler = () => {
    api["info"]({
      message: "Request sent",
      description: " Awaiting confirmation from rider.",
    });
  };

  const [popUpMessage, setPopUpMessage] = useState<{
    text: string;
    description: string;
    icon: ReactNode;
  }>({
    text: "",
    description: "",
    icon: <></>,
  });

  // activation handler
  const handleRiderActivation = (rider: string) => {
    setPopUpMessage({
      text: "Confirm Rider Activation",
      description: `Activate ${rider}`,
      icon: (
        <i
          className="fa-solid fa-user-check"
          style={{ color: "#16C47F", marginRight: "0.4em" }}
        ></i>
      ),
    });
  };
  // rider deactivation handler
  const handleRiderDeactivation = (rider: string) => {
    setPopUpMessage({
      text: "Confirm Rider Deactivation",
      description: `Deactivate ${rider}`,
      icon: (
        <i
          className="fa-solid fa-user-xmark"
          style={{ color: "#FC2947", marginRight: "0.4em" }}
        ></i>
      ),
    });
  };

  const confirmRiderStatus: PopconfirmProps["onConfirm"] = () => {
    message.info("Rider status updated");
  };

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
      render: (_: number, record: any) => (
        <Flex vertical gap="small">
          <Button
            type="primary"
            style={{ background: "#FF8225" }}
            onClick={openDispatchHandler}
          >
            Dispatch
          </Button>
          <Popconfirm
            placement="leftBottom"
            title={popUpMessage?.text}
            description={popUpMessage?.description}
            okText="Confirm"
            cancelText="Cancel"
            icon={popUpMessage?.icon}
            onConfirm={confirmRiderStatus}
          >
            {record?.status === "deactivated" ? (
              <Button
                type="dashed"
                icon={
                  <i
                    className="fa-solid fa-user-check"
                    style={{ color: "#16C47F" }}
                  ></i>
                }
                onClick={() => handleRiderActivation(record?.name)}
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
                onClick={() => handleRiderDeactivation(record?.name)}
              >
                Deactivate
              </Button>
            )}
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        dataSource={Array.isArray(riders) ? riders : []}
        rowKey="id"
        columns={ridersTableColumns}
      />
    </>
  );
};

export default RidersTable;
