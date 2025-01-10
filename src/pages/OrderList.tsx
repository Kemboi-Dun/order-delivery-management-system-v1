import {
  Badge,
  Breadcrumb,
  Button,
  Flex,
  Input,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";

import orderList from "../data/Orders.json";
import { useFormattedDateString } from "../hooks/DateHook";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";

import get from 'lodash/get'

// Breadcrumb items
const breadCrumbItems = [
  {
    title: "Orders",
  },
  {
    title: "Pending Orders",
  },
];

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

  const [filteredInfo, setFilteredInfo] = useState({});

  const searchInput = useRef(null);

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

  const handleChange = (pagination: any, filters: any) => {
    console.log("CHANGED PARAMS : --- ", filters);
    setFilteredInfo(filters);
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
      get(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase()),
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
      dataIndex: "customer",
      key: "customer",
      filteredValue: filteredInfo?.customer || null,
      render: (value: string) => <p>{value?.name}</p>,
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
      defaultSortOrder: "descend",
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
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (value: string) => <p>{value?.name}</p>,
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
            <Button type="primary" icon={<i className="fa-solid fa-eye"></i>}>
              View order
            </Button>
            <Button
              type="text"
              icon={<i className="fa-solid fa-trash"></i>}
              style={{ color: "red" }}
            />
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center" gap="large">
        <Space wrap size="large" style={{ margin: "0.5em 0" }}>
          <Input
            type="search"
            placeholder="Search order"
            suffix={<i className="fa-solid fa-magnifying-glass"></i>}
          />
          <Button type="primary">All Orders</Button>
          <Button type="dashed">
            <Badge status="processing" text="Pending orders" />
          </Button>
          <Button type="dashed">
            <Badge status="warning" text="Dispatched orders" />
          </Button>
          <Button type="dashed">
            <Badge status="success" text="Delivered orders" />
          </Button>
          <Button type="dashed">
            <Badge status="error" text="Canceled orders (5)" />
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
        dataSource={orders}
        style={ordersTableStyle}
        onChange={handleChange}
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
