import React, { useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Divider,
  Drawer,
  Flex,
  Space,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import orderList from "../data/Orders.json";
import { useFormattedDateString } from "../hooks/DateHook";
import LiveLocationMap from "../components/LiveLocationMap";

const { Title } = Typography;
interface OrderDetailsInterface {
  orderDetail: any;
}

// style live map wrapper
const livemapStyles: React.CSSProperties = {
  width: "100%",
  height: "38vh",
};

const OrderDetailSection: React.FC<OrderDetailsInterface> = ({
  orderDetail,
}) => {
  // customer drawer states
  const [openCustomerDrawer, setCustomerDrawer] = useState(false);

  // open customer drawer:
  const viewCustomerInfo = () => setCustomerDrawer(true);
  const closeCustomerDrawer = () => setCustomerDrawer(false);

  return (
    <div>
      <Flex gap="large" align="center" justify="space-between">
        <Space>
          <p>
            <b>Order placed on: </b>{" "}
            {useFormattedDateString(orderDetail?.orderDate)}
          </p>{" "}
          |{" "}
          <p>
            <b>Expected Delivery date: </b>
            {useFormattedDateString(orderDetail?.deliveryTime)}
          </p>
        </Space>

        <Button
          type="primary"
          icon={<i className="fa-solid fa-user"></i>}
          onClick={viewCustomerInfo}
        >
          View customer info
        </Button>
        <MemoizedUserInfo
          userDetails={orderDetail?.customer}
          customerAddress={orderDetail?.shippingAddress}
          onClose={closeCustomerDrawer}
          open={openCustomerDrawer}
        />
      </Flex>
    </div>
  );
};

// user info Drawer
interface UserInfoType {
  userDetails: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  customerAddress: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
  open: boolean;
}

const UserDetailDrawer: React.FC<UserInfoType> = ({
  userDetails,
  customerAddress,
  open,
  onClose,
}) => {
  const customerCoordinates = {
    latitude: customerAddress?.latitude,
    longitude: customerAddress?.longitude,
    location: `${customerAddress?.name}, ${customerAddress?.county}`,
  };

  return (
    <Drawer
      title="User info"
      open={open}
      onClose={onClose}
      extra={
        <Button
          icon={<i className="fa-regular fa-address-card"></i>}
          type="primary"
        >
          View Detailed Info
        </Button>
      }
      closable={false}
      width={640}
    >
      <Flex gap="middle" justify="start" align="start" vertical>
        <Flex gap="small" vertical>
          <Title level={5}>User profile</Title>
          <Flex gap="middle" justify="space-between" align="center" wrap>
            <p>
              <b>Full name: </b> {userDetails?.name}
            </p>
            <p>
              <b>Email: </b> {userDetails?.email}
            </p>
            <p>
              <b>Phone number: </b> {userDetails?.phone}
            </p>
          </Flex>
        </Flex>
        {/* <hr style={{width:'100%'}}/> */}
        <Divider />
        <Flex vertical gap="small">
          <Title level={5}>Address</Title>
          <Flex gap="middle" justify="space-between" align="center" wrap>
            <p>
              <b>Name: </b> {customerAddress?.name}
            </p>
            <p>
              <b>Address 1: </b> {customerAddress?.addressLine1}
            </p>
            <p>
              <b>Address 2: </b> {customerAddress?.addressLine2}
            </p>
            <p>
              <b>City: </b> {customerAddress?.city}
            </p>
            <p>
              <b>Postal Code: </b> {customerAddress?.postalCode}
            </p>
            <p>
              <b>County: </b> {customerAddress?.county},
              {customerAddress?.country}{" "}
            </p>
          </Flex>
        </Flex>
        <div style={livemapStyles}>
          <LiveLocationMap customerCoordinates={customerCoordinates} />
        </div>
      </Flex>
    </Drawer>
  );
};

const MemoizedUserInfo = React.memo(UserDetailDrawer);

const OrderDetail = () => {
  const urlParams = useParams();
  const orderId = urlParams?.order_id;
  const navigate = useNavigate();

  const orderDetailBreadcrumbItems = [
    {
      title: <a href="/">Orders</a>,
    },
    {
      title: "Order detail",
    },
  ];

  // get order from order list
  const orderDetail = useMemo(() => {
    return orderList.find((order) => order.orderId === orderId);
  }, [orderId]);

  return (
    <div style={{ padding: "1em" }}>
      <Breadcrumb items={orderDetailBreadcrumbItems} />
      <Button
        type="dashed"
        onClick={() => navigate(-1)}
        icon={<i className="fa-solid fa-arrow-left"></i>}
        style={{ margin: "1em 0" }}
      >
        Back
      </Button>

      <Title level={3}>Order ID: {orderId}</Title>

      <OrderDetailSection orderDetail={orderDetail} />
    </div>
  );
};

export default OrderDetail;
