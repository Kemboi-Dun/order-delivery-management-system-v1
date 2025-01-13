import { Descriptions, DescriptionsProps, Divider, Drawer } from "antd";
import React from "react";
import { useUserListProvider } from "../context/UserListContext";

const UserInfo: React.FC = () => {
  const { userDetail, setOpenUserInfo, openUserInfo } = useUserListProvider();
  // description items
  const profilDescriptionItems: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Full name",
      children: userDetail?.name,
      span: 2,
    },
    {
      key: "email",
      label: "Email",
      children: userDetail?.email,
    },
    {
      key: "username",
      label: "Username",
      children: userDetail?.username,
    },

    {
      key: "phone",
      label: "Phone number",
      children: userDetail?.phone,
      span: 2,
    },
    {
      key: "website",
      label: "Website",
      children: userDetail?.website,
    },
  ];

  const addressItems: DescriptionsProps["items"] = [
    {
      key: "street",
      label: "Street",
      children: userDetail?.address?.street,
    },
    {
      key: "city",
      label: "city",
      children: userDetail?.address?.city,
    },
    {
      key: "suite",
      label: "Suite",
      children: userDetail?.address?.suite,
    },
    {
      key: "zipcode",
      label: "Zipcode",
      children: userDetail?.address?.zipcode,
    },
  ];

  const companyItems: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Comapny Name",
      children: userDetail?.company.name,
      span: 2,
    },
    {
      key: "bs",
      label: "Bs",
      children: userDetail?.company.bs,
     
    },
    {
      key: "catchPhrase",
      label: "Catch Phrase",
      children: userDetail?.company.catchPhrase,
      span: 3,
    },
  ];
  return (
    <Drawer
      title={<p>{userDetail?.name}</p>}
      onClose={() => setOpenUserInfo(false)}
      closable={true}
      open={openUserInfo}
      width={600}
    >
      <Descriptions items={profilDescriptionItems} title="User profile" />
      <Divider />
      <Descriptions items={addressItems} title="Address" />
      <Divider />
      <Descriptions items={companyItems} title="Company" size="middle" />
    </Drawer>
  );
};

export default UserInfo;
