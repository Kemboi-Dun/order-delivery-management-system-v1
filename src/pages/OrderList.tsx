import {
  Badge,
  Button,
  Dropdown,
  Flex,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";

import orderList from "../data/Orders.json";

import { useNavigate } from "react-router-dom";
import FilterButton from "../components/customComponents/FilterButton";

import { useColumnSearch } from "../utils/HelperFunctions";
import DispatchModal from "../components/DispatchModal";
import DefaultButton from "../components/customComponents/DefaultButton";
import OrdersMapModal from "../components/OrdersMapModal";

// filter values

const orders: any[] = Array.isArray(orderList) ? orderList : [];

// orders table style
const ordersTableStyle: React.CSSProperties = {
  width: "100%",
  margin: "1em 0",
};

const OrdersTable: React.FC = () => {
  interface FilteredInfo {
    status?: string[];
    orderId?: string[];
    customer?: string[];
    total?: string[];
    paymentMethod?: string[];
    shippingAddress?: string[];
    // key?: string;
  }

  const { getColumnSearchProps } = useColumnSearch();

  // Add key to order list

  const [filteredInfo, setFilteredInfo] = useState<FilteredInfo>({});

  const [filteredData, setStatusFilter] = useState<FilteredInfo[]>(orders);

  const navigate = useNavigate();

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const handleChange = (pagination: any, filters: any, statusList: any) => {
    // console.log("CHANGED PARAMS : --- ", filters);
    console.log("NULL: ==== ", pagination, statusList);
    setFilteredInfo(filters);
    // setStatusFilter(statusList);
  };

  // Handle filtering by status outside the table
  const filterByStatus = (status: string) => {
    if (status === "all") {
      setStatusFilter(orders);
    } else {
      setStatusFilter(orders.filter((item: any) => item?.status === status));
    }
  };

  //handle delete order
  const confirmDelete: PopconfirmProps["onConfirm"] = () => {
    // console.log(e);
    message.success("Order deleted");
  };

  const cancelDelete: PopconfirmProps["onCancel"] = () => {
    // console.log(e);
    message.error("Order not deleted");
  };

  // Rider modal handler
  const [openRiderModal, setOpenRiderModal] = useState(false);
  const [openOrdersMap, setOpenOrdersMap] = useState(false);

  const OpenRiderModal = () => setOpenRiderModal(true);
  const CloseRiderModal = () => setOpenRiderModal(false);

  const OpenOrdersModal = () => setOpenOrdersMap(true);
  const CloseOrdersModal = () => setOpenOrdersMap(false);

  // Orders table columns
  const ordersColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      filteredValue: filteredInfo?.orderId || null,
      ...getColumnSearchProps("orderId"),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer",
      // render: (value: string) => <p>{value?.name}</p>,
      filteredValue: filteredInfo?.customer || null,
      ...getColumnSearchProps(["customer", "name"]),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (statusVal: any) => {
        let statusColor:
          | "default"
          | "warning"
          | "processing"
          | "success"
          | "error"
          | undefined = "default";
        switch (statusVal) {
          case "Dispatched":
            statusColor = "warning";
            break;
          case "Processing":
            statusColor = "processing";
            break;
          case "Delivered":
            statusColor = "success";
            break;
          case "Canceled":
            statusColor = "error";
            break;

          default:
            break;
        }
        return <Badge status={statusColor} text={statusVal} />;
      },
      filters: [
        {
          text: "Processing",
          value: "Processing",
        },
        {
          text: "Dispatched",
          value: "Dispatched",
        },
        {
          text: "Delivered",
          value: "Delivered",
        },
        {
          text: "Canceled",
          value: "Canceled",
        },
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
      filteredValue: filteredInfo?.status || null,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      // sortOrder: "descend" as "descend" | "ascend" | undefined,
      sorter: (a: any, b: any) => a.total - b.total,
      render: (value: any) => <p>KES {value}</p>,
      filteredValue: filteredInfo?.total || null,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filteredValue: filteredInfo?.paymentMethod || null,
      filters: [
        {
          text: "Mpesa",
          value: "Mpesa",
        },
        {
          text: "Cash on Delivery",
          value: "Cash on Delivery",
        },
      ],

      onFilter: (value: any, record: any) =>
        record.paymentMethod.indexOf(value) === 0,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (value: string) => <p>{new Date(value).toLocaleString()}</p>,
    },
    {
      title: "Shipping Address",
      dataIndex: ["shippingAddress", "name"],
      key: "shippingAddress",
      filteredValue: filteredInfo?.shippingAddress || null,
      ...getColumnSearchProps(["shippingAddress", "name"]),
    },
    {
      title: "Actions",
      dataIndex: "orderId",
      key: "orderId",
      render: (value: string) => (
        <>
          <Space size="large">
            <Button
              type="primary"
              icon={<i className="fa-solid fa-eye"></i>}
              onClick={() => navigate(`/order/${value}`)}
            >
              View order
            </Button>

            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "action_button",
                    label: (
                      <Button
                        type="text"
                        icon={<i className="fa-solid fa-user-tag"></i>}
                        onClick={OpenRiderModal}
                      >
                        Assign Rider
                      </Button>
                    ),
                  },
                  {
                    key: "delete",
                    label: (
                      <Popconfirm
                        title={<p>Delete order : {value}</p>}
                        description="Are you sure you want to delete this order?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <Button
                          type="text"
                          icon={<i className="fa-solid fa-trash"></i>}
                          style={{ color: "red" }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    ),
                  },
                ],
              }}
            >
              <Button
                icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
                type="text"
              ></Button>
            </Dropdown>
          </Space>
        </>
      ),
    },
  ];

  // handle row actions

  const [activeButton, setActiveButton] = useState("all");

  useEffect(() => {
    //check the curret active status and store in the local storage
    // TODO: Use api filter directly
    if (localStorage.length && localStorage.getItem("active_order_status")) {
      const activeFilterStatus: any = localStorage.getItem(
        "active_order_status"
      );
      setActiveButton(activeFilterStatus);
      filterByStatus(activeFilterStatus);
    } else {
      setStatusFilter(orders);
      setActiveButton("all");
    }
  }, []);

  // get the number of orders for each status
  const getOrdersByStatus = (status: string) =>
    useMemo(() => {
      clearFilters();
      if (status === "all") {
        return orders.length;
      } else {
        const filteredOrders = orders?.filter(
          (order: any) => order?.status === status
        );
        return filteredOrders.length;
      }
    }, [filteredData]);

  return (
    <>
      <Flex justify="space-between" align="center" gap="large">
        <Space wrap size="large" style={{ margin: "0.5em 0" }}>
          <FilterButton
            type={activeButton === "all" ? "primary" : "default"}
            onClick={() => {
              filterByStatus("all");
              setActiveButton("all");
              localStorage.removeItem("active_order_status");
            }}
          >
            All Orders ({getOrdersByStatus("all")})
          </FilterButton>
          <FilterButton
            type={activeButton === "Processing" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Processing");
              setActiveButton("Processing");
              localStorage.setItem("active_order_status", "Processing");
            }}
          >
            <Badge status="processing" />
            <p>Pending orders ({getOrdersByStatus("Processing")})</p>
          </FilterButton>
          <FilterButton
            type={activeButton === "Dispatched" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Dispatched");
              setActiveButton("Dispatched");
              localStorage.setItem("active_order_status", "Dispatched");
            }}
          >
            <Badge status="warning" />
            <p>Dispatched orders ({getOrdersByStatus("Dispatched")})</p>
          </FilterButton>
          <FilterButton
            type={activeButton === "Delivered" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Delivered");
              setActiveButton("Delivered");
              localStorage.setItem("active_order_status", "Delivered");
            }}
          >
            <Badge status="success" />
            <p>Delivered orders ({getOrdersByStatus("Delivered")})</p>
          </FilterButton>
          <FilterButton
            type={activeButton === "Canceled" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Canceled");
              setActiveButton("Canceled");
              localStorage.setItem("active_order_status", "Canceled");
            }}
          >
            <Badge status="error" />
            <p>Canceled orders ({getOrdersByStatus("Canceled")})</p>
          </FilterButton>
        </Space>
        <Space size="small">
          <DefaultButton
            type="primary"
            icon={<i className="fa-solid fa-map-location"></i>}
            onClick={OpenOrdersModal}
          >
            View locations
          </DefaultButton>

          <Button
            icon={<i className="fa-solid fa-filter-circle-xmark"></i>}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Space>
      </Flex>

      <Table
        columns={ordersColumns}
        dataSource={Array.isArray(filteredData) ? filteredData : []}
        style={ordersTableStyle}
        onChange={handleChange}
        rowKey="orderId"
      />
      <DispatchModal open={openRiderModal} setCloseModal={CloseRiderModal} />
      <OrdersMapModal open={openOrdersMap} setCloseModal={CloseOrdersModal} />
    </>
  );
};

const OrderList = () => {
  return (
    <div>
      {/* <Breadcrumb items={breadCrumbItems} /> */}
      <OrdersTable />
    </div>
  );
};

export default OrderList;
