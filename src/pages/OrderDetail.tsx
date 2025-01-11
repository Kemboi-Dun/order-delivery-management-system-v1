import React, { useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Divider,
  Drawer,
  Flex,
  Modal,
  Space,
  Tag,
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

const trackOrderMapStyles: React.CSSProperties = {
    width: "100%",
    height: "60vh",
  };

const OrderDetailSection: React.FC<OrderDetailsInterface> = ({
  orderDetail,
}) => {
  // customer drawer states
  const [openCustomerDrawer, setCustomerDrawer] = useState(false);

  const customerCoordinates = {
    latitude: orderDetail?.shippingAddress?.latitude,
    longitude: orderDetail?.shippingAddress?.longitude,
    location: `${orderDetail?.shippingAddress?.name}, ${orderDetail?.shippingAddress?.county}`,
  };
 
  // open customer drawer:
  const viewCustomerInfo = () => setCustomerDrawer(true);
  const closeCustomerDrawer = () => setCustomerDrawer(false);

  // track order modal state
  const [openTrackOrder, setTrackOderModal] = useState(false);

  const openTrackOrderModal = () => setTrackOderModal(true);
  const closeTrackOrderModal = () => setTrackOderModal(false);
  const orderCoordinates = {
    latitude: 0,
    longitude: 0,
    description: {
      orderId: orderDetail?.orderId,
      status: orderDetail?.status,
    },
  };
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
          customerCoordinates={customerCoordinates}
        />
      </Flex>

      <Flex
        gap="middle"
        justify="space-between"
        align="center"
        style={{ margin: "1em 0" }}
      >
        <Button
          icon={<i className="fa-solid fa-location-arrow"></i>}
          type="dashed"
          onClick={openTrackOrderModal}
        >
          Track order
        </Button>
        <MemoizedTrackOrderModal
          openModal={openTrackOrder}
          closeModal={closeTrackOrderModal}
          orderCoordinates={orderCoordinates}
          customerCoordinates={customerCoordinates}
        />

        <p>
          Total amount: <b> KES {orderDetail?.total}</b>
        </p>
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
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };

  customerAddress: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  onClose: () => void;
  open: boolean;
}

const UserDetailDrawer: React.FC<UserInfoType> = ({
  userDetails,
  customerAddress,
  customerCoordinates,
  open,
  onClose,
}) => {
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
          <LiveLocationMap
            customerCoordinates={customerCoordinates}
           
          />
        </div>
      </Flex>
    </Drawer>
  );
};

const MemoizedUserInfo = React.memo<UserInfoType>(UserDetailDrawer);

interface TrackOrderModalInterface {
  openModal: boolean;
  closeModal: () => void;
  orderCoordinates: {
    longitude: number;
    latitude: number;
    description: {
      orderId: string;
      status: string;
    };
  };
  customerCoordinates: {
    longitude: number;
    latitude: number;
    location: string;
  };
}

// Track order Modal
const TrackOrderModal: React.FC<TrackOrderModalInterface> = ({
  orderCoordinates,
  customerCoordinates,
  openModal,
  closeModal,
}) => {
  return (
    <Modal
      title={
        <>
          <Flex gap="large" justify="start" align="center">
            <Space align="center" size="large">
              <p>Track order: {orderCoordinates?.description?.orderId}</p>

              <Tag color="orange">{orderCoordinates?.description?.status}</Tag>
            </Space>
            <Button icon={<i className="fa-solid fa-route"></i>} type="primary">
              Get Route
            </Button>
          </Flex>
        </>
      }
      centered
      footer={null}
      open={openModal}
      closable
      onClose={closeModal}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
    >
      <div style={trackOrderMapStyles}>
        <LiveLocationMap
          customerCoordinates={customerCoordinates}
          orderCoordinates={orderCoordinates}
        />
      </div>
    </Modal>
  );
};

const MemoizedTrackOrderModal = React.memo(TrackOrderModal);

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
