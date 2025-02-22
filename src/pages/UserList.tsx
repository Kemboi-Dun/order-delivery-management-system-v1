import React, { useState } from "react";
import { UserListFilterType } from "../types/Types";
import {
  UserListProvider,
  useUserListProvider,
} from "../context/UserListContext";
import { Button, Flex, Table } from "antd";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/customComponents/DefaultButton";
import { useColumnSearch } from "../utils/HelperFunctions";
import UserInfo from "../components/UserInfo";

// user list table
const UserListTable: React.FC = () => {
  const { getColumnSearchProps } = useColumnSearch();
  const { setUserID, setOpenUserInfo } = useUserListProvider();

  const [filteredInfo, setFilteredInfo] = useState<UserListFilterType>({});

  // Table onchange handler
  const handleChange = (pagination: any, filters: any, statusList: any) => {
    setFilteredInfo(filters);
    console.log("NULL: ==== ", pagination, statusList);
  };

  // reset filters handler

  const clearFilters = () => {
    setFilteredInfo({});
  };

  // user info drawer handler
  const handleUserInfoDrawer = (userId: number) => {
    setUserID(userId);
    setOpenUserInfo(true);
  };

  // users table columns
  const userTableColumns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      filteredValue: filteredInfo?.name || null,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      filteredValue: filteredInfo?.email || null,
      ...getColumnSearchProps("email"),
      render: (value: any, record: any) => (
        <Flex gap="small" vertical>
          <p>{value}</p>
          <small>
            <b>username:</b> {record?.username}
          </small>
        </Flex>
      ),
    },
    {
      title: "Phone number",
      key: "phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
      filteredValue: filteredInfo?.phone || null,
    },

    {
      title: "Address",
      dataIndex: ["address", "street"],
      key: "address",
      filteredValue: filteredInfo?.address || null,
      ...getColumnSearchProps(["address", "street"]),
      render: (value: any, record: any) => (
        <p>
          {value}, {record?.address?.city}
        </p>
      ),
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
      key: "company",
      filteredValue: filteredInfo?.company || null,
      ...getColumnSearchProps(["company", "name"]),
    },

    {
      title: "Actions",
      key: "id",
      dataIndex: "id",
      render: (value: number) => (
        <DefaultButton
          type="primary"
          icon={<i className="fa-solid fa-address-card"></i>}
          onClick={() => handleUserInfoDrawer(value)}
        >
          View Info
        </DefaultButton>
      ),
    },
  ];

  const { users, loading } = useUserListProvider();
  return (
    <>
      <Flex
        gap="large"
        align="center"
        justify="end"
        style={{ margin: "0.5em 0" }}
      >
        <Button
          type="primary"
          onClick={clearFilters}
          icon={<i className="fa-solid fa-filter-circle-xmark"></i>}
        >
          Clear Filters
        </Button>
      </Flex>
      <Table
        columns={userTableColumns}
        dataSource={users}
        rowKey="id"
        onChange={handleChange}
        loading={loading}
      />
    </>
  );
};

const UserList = () => {
  const navigate = useNavigate();

  return (
    <>
      <Flex gap="middle" align="center" style={{ margin: "1em 0" }}>
        <Button type="dashed" onClick={() => navigate(-1)}>
          Back
        </Button>

        <h1>Users</h1>
      </Flex>

      <UserListProvider>
        <UserListTable />
        <UserInfo />
      </UserListProvider>
    </>
  );
};

export default UserList;
