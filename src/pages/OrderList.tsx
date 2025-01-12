import {
  Badge,
  Breadcrumb,
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";

import orderList from "../data/Orders.json";
import { useFormattedDateString } from "../hooks/DateHook";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";

import get from "lodash/get";
import { useNavigate } from "react-router-dom";

// filter values

const orders: any[] = orderList;

// orders table style
const ordersTableStyle: React.CSSProperties = {
  width: "100%",
  margin: "1em 0",
};

const OrdersTable: React.FC = () => {
  const [searchedText, setSearchedText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  interface FilteredInfo {
    status?: string[];
    orderId?: string[];
    customer?: string[];
    total?: string[];
    paymentMethod?: string[];
    shippingAddress?: string[];
    // key?: string;
  }

  // Add key to order list

  const [filteredInfo, setFilteredInfo] = useState<FilteredInfo>({});

  const [filteredData, setStatusFilter] = useState<FilteredInfo[]>(orders);

  const searchInput = useRef<any>(null);

  const navigate = useNavigate();

  if (filteredData) {
    console.log("FILTERED DATA----------", filteredData);
  }

  const handleSearch = (
    selectedKeys: any[],
    confirm: any,
    dataIndex: string
  ) => {
    confirm();
    setSearchedText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // reset filters
  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchedText("");
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const handleChange = (pagination: any, filters: any, statusList: any) => {
    console.log("CHANGED PARAMS : --- ", filters);
    setFilteredInfo(filters);
    setStatusFilter(statusList);
  };

  // Handle filtering by status outside the table
  const filterByStatus = (status: string) => {
    if (status === "all") {
      setStatusFilter(orders);
    } else {
      setStatusFilter(
        orders.filter((item: any) => item?.status === status)
      );
    }
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Flex gap="small">
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="default"
            icon={<FilterFilled />}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchedText(selectedKeys[0]);
              setSearchedText(dataIndex);
            }}
          >
            Filter
          </Button>
        </Flex>

        <Flex justify="space-between" gap="middle" align="center">
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            >
              Search
            </Button>

            <Button
              type="dashed"
              onClick={() => clearFilters && handleReset(clearFilters)}
            >
              Reset
            </Button>
          </Space>
          <Button size="small" type="link" onClick={() => close()}>
            Close
          </Button>
        </Flex>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      get(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open: boolean) {
        if (open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        }
      },

      render: (text: string) => {
        searchedColumn === dataIndex ? (
          <p style={{ textDecoration: "underline" }}>{text}</p>
        ) : (
          text
        );
      },
    },
  });

  //handle delete order
  const confirmDelete: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Order deleted");
  };

  const cancelDelete: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Order not deleted");
  };

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
      key: "name",
      filteredValue: filteredInfo?.customer || null,
      ...getColumnSearchProps("customer.name"),
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
      sortOrder: "descend" as "descend" | "ascend" | undefined,
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
      key: "name",
      filteredValue: filteredInfo?.shippingAddress || null,
      ...getColumnSearchProps("shippingAddress.name"),
    },
    {
      title: "Actions",
      dataIndex: "orderId",
      key: "orderId",
      render: (value: string) => (
        <>
          <Space size="middle" wrap>
            <Button
              type="primary"
              icon={<i className="fa-solid fa-eye"></i>}
              onClick={() => navigate(`/order/${value}`)}
            >
              View order
            </Button>

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
              />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

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

  return (
    <>
      <Flex justify="space-between" align="center" gap="large">
        <Space wrap size="large" style={{ margin: "0.5em 0" }}>
          <Button
            type={activeButton === "all" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("all");
              setActiveButton("all");
              localStorage.removeItem("active_order_status");
            }}
          >
            All Orders
          </Button>
          <Button
            type={activeButton === "Processing" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Processing");
              setActiveButton("Processing");
              localStorage.setItem("active_order_status", "Processing");
            }}
          >
            <Badge status="processing" />
            <p>Pending orders</p>
          </Button>
          <Button
            type={activeButton === "Dispatched" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Dispatched");
              setActiveButton("Dispatched");
              localStorage.setItem("active_order_status", "Dispatched");
            }}
          >
            <Badge status="warning" />
            <p>Dispatched orders</p>
          </Button>
          <Button
            type={activeButton === "Delivered" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Delivered");
              setActiveButton("Delivered");
              localStorage.setItem("active_order_status", "Delivered");
            }}
          >
            <Badge status="success" />
            <p>Delivered orders</p>
          </Button>
          <Button
            type={activeButton === "Canceled" ? "primary" : "dashed"}
            onClick={() => {
              filterByStatus("Canceled");
              setActiveButton("Canceled");
              localStorage.setItem("active_order_status", "Canceled");
            }}
          >
            <Badge status="error" />
            <p>Canceled orders (5)</p>
          </Button>
        </Space>

        <Button
          icon={<i className="fa-solid fa-filter-circle-xmark"></i>}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </Flex>

      <Table<any>
        columns={ordersColumns}
        dataSource={filteredData}
        style={ordersTableStyle}
        onChange={handleChange}
        rowKey="orderId"
      />
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
