import {
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  Tabs,
  TabsProps,
} from "antd";
import React from "react";
import { useUserListProvider } from "../context/UserListContext";
import LiveLocationMap from "./LiveLocationMap";
import { livemapStyles } from "./CustomerInfoDrawer";

// user info descriptionsection
const UserInfoTab: React.FC = () => {
  const { userDetail } = useUserListProvider();
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
    <>
      <Descriptions items={profilDescriptionItems} title="User profile" />
      <Divider />
      <Descriptions items={addressItems} title="Address" />
      <Divider />
      <Descriptions items={companyItems} title="Company" size="middle" />
    </>
  );
};

// user map location
const UserLocations: React.FC = () => {
  const { userDetail } = useUserListProvider();
  //TODO ; Update to use context APi
  const userCoordinates: any = {
    latitude: userDetail?.address.geo.lat,
    longitude: userDetail?.address.geo.lng,
    location: `${userDetail?.address.suite}, ${userDetail?.address.street}`,
  };

  return (
    <div style={{width:'100%', height:'70vh'}}>
      <LiveLocationMap customerCoordinates={userCoordinates} />
    </div>
  );
};

const UserInfo: React.FC = () => {
  const { userDetail, setOpenUserInfo, openUserInfo } = useUserListProvider();

  // tab items
  const userTabItems: TabsProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      children: <UserInfoTab />,
      icon: <i className="fa-regular fa-address-card"></i>,
    },
    {
      key: "live_location",
      label: "Location",
      children: <UserLocations />,
      icon: <i className="fa-solid fa-location-dot"></i>,
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
      <Tabs defaultActiveKey="profile" items={userTabItems} />
    </Drawer>
  );
};

export default UserInfo;
