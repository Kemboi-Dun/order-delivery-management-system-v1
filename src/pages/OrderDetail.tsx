import React, { useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Divider,
  Drawer,
  Flex,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

import orderList from "../data/Orders.json";
import pickUpStations from "../data/PickUpPoints.json";

import OrderDetails from "../data/OrderDetails.json";

import { useFormattedDateString } from "../hooks/DateHook";
import LiveLocationMap from "../components/LiveLocationMap";

import {
  AddressType,
  CustomerCoordinates,
  CustomerDetailType,
  OrderDetailType,
  OrderItemType,
  PickUpStationType,
} from "../types/Types";
import CustomerInfoDrawer from "../components/CustomerInfoDrawer";
import { statusColorTag } from "../utils/HelperFunctions";

// style live map wrapper
const livemapStyles: React.CSSProperties = {
  width: "100%",
  height: "38vh",
};

const trackOrderMapStyles: React.CSSProperties = {
  width: "100%",
  height: "68vh",
};

const { Title } = Typography;

interface OrderDetailsInterface {
  orderDetail: OrderDetailType;
}

// interface orderItemInterface {
//   productId: string;
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice:number;
// }

// Order items tableOrderItems
const OrderItems: React.FC<OrderDetailsInterface> = ({ orderDetail }) => {
  const orderItems: OrderItemType[] = useMemo(() => {
    return orderDetail?.orderItems.map((item: OrderItemType) => ({
      ...item,
      key: item.productId,
    }));
  }, [orderDetail]);

  if (orderItems) {
    console.log("Order Items : --- : +++ ", orderItems);
  }

  // table columns
  const orderItemsColumns = [
    {
      title: "Product ID",
      key: "productId",
      dataIndex: "productId",
    },
    {
      title: "Product Name",
      key: "productName",
      dataIndex: "productName",
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },

    {
      title: "Unit Price",
      key: "unitPrice",
      dataIndex: "unitPrice",
      sorter: (a: any, b: any) => a.unitPrice - b.unitPrice,
      render: (value: number) => <p>KES {value}</p>,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      dataIndex: "totalPrice",
      sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
      render: (value: number) => <p>KES {value}</p>,
    },
  ];

  return <Table columns={orderItemsColumns} dataSource={orderItems} />;
};

const OrderDetailSection: React.FC<OrderDetailsInterface> = ({
  orderDetail,
}) => {
  // customer drawer states
  const [openCustomerDrawer, setCustomerDrawer] = useState(false);

  const customerCoordinates = {
    latitude: orderDetail?.customerDetails.address.latitude,
    longitude: orderDetail?.customerDetails.address.longitude,
    location: `${orderDetail?.customerDetails.address.name}, ${orderDetail?.customerDetails.address.county}`,
  };

  // open customer drawer:
  const viewCustomerInfo = () => setCustomerDrawer(true);
  const closeCustomerDrawer = () => setCustomerDrawer(false);

  // track order modal state
  const [openTrackOrder, setTrackOderModal] = useState(false);

  const openTrackOrderModal = () => setTrackOderModal(true);
  const closeTrackOrderModal = () => setTrackOderModal(false);

  const orderDetails = {
    pickUpStationDetails: {
      latitude: pickUpStations[0].latitude,
      longitude: pickUpStations[0].longitude,
      name: pickUpStations[0].name,
      id: pickUpStations[0].id,
      status: pickUpStations[0].status,
    },
    description: {
      orderId: orderDetail?.orderId,
      status: orderDetail?.orderStatus,
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
            {useFormattedDateString(
              orderDetail?.deliveryDetails.expectedDeliveryDate
            )}
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
          userDetails={orderDetail?.customerDetails}
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
          orderDetails={orderDetails}
          customerCoordinates={customerCoordinates}
        />

        <p>
          Total amount: <b> KES {orderDetail?.totalAmount}</b>
        </p>
      </Flex>
    </div>
  );
};

// user info Drawer
interface UserInfoType {
  userDetails: CustomerDetailType;
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
  onClose: () => void;
  open: boolean;
}

const UserDetailDrawer: React.FC<UserInfoType> = ({
  userDetails,
  customerCoordinates,
  open,
  onClose,
}) => {
  // flatten customer address
  const customerAddress = userDetails?.address || null;
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  const activeUserId = userDetails?.id || 2;

  return (
    <>
      <Drawer
        title="User info"
        open={open}
        onClose={onClose}
        extra={
          <Button
            icon={<i className="fa-regular fa-address-card"></i>}
            type="primary"
            onClick={() => setOpenInfoDrawer(true)}
          >
            View Detailed Info
          </Button>
        }
        // closable={false}
        width={640}
        destroyOnClose
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

          <Divider />
          <Flex vertical gap="small">
            <Title level={5}>Address</Title>
            <Flex gap="middle" justify="space-between" align="center" wrap>
              <p>
                <b>Name: </b> {customerAddress.name}
              </p>
              <p>
                <b>Street: </b> {customerAddress.street}
              </p>
              <p>
                <b>Town: </b> {customerAddress?.town}
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
      <CustomerInfoDrawer
        customerID={activeUserId}
        openInfoDrawer={openInfoDrawer}
        onCloseInfoDrawer={() => setOpenInfoDrawer(false)}
      />
    </>
  );
};

const MemoizedUserInfo = React.memo<UserInfoType>(UserDetailDrawer);

interface TrackOrderModalInterface {
  openModal: boolean;
  closeModal: () => void;
  orderDetails: {
    pickUpStationDetails: PickUpStationType;
    description: {
      orderId: string;
      status: string;
    };
  };
  customerCoordinates: CustomerCoordinates;
}

// Track order Modal
const TrackOrderModal: React.FC<TrackOrderModalInterface> = ({
  orderDetails,
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
              <p>Track order: {orderDetails?.description?.orderId}</p>

              <Tag color="orange">{orderDetails?.description?.status}</Tag>
            </Space>
          </Flex>
        </>
      }
      centered
      footer={null}
      open={openModal}
      closable
      onCancel={() => closeModal()}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "80%",
        xl: "80%",
        xxl: "40%",
      }}
    >
      <div style={trackOrderMapStyles}>
        <LiveLocationMap
          customerCoordinates={customerCoordinates}
          orderDetails={orderDetails}
        />
      </div>
    </Modal>
  );
};

const MemoizedTrackOrderModal = React.memo(TrackOrderModal);

// Order detail section
const OrderInfoSection: React.FC<OrderDetailsInterface> = ({ orderDetail }) => {
  const paymentDetails = orderDetail?.paymentDetails || null;
  const deliveryDetails = orderDetail?.deliveryDetails || null;

  return (
    <Flex gap="middle" align="start" style={{ height: "100%", width: "100%" }}>
      <OrderItems orderDetail={orderDetail} />

      <div style={{ width: "40%", height: "100%", overflowY: "auto" }}>
        <Flex vertical gap="small">
          <Title level={4}>Payment details</Title>
          <p>
            <b>Payment method:</b> {paymentDetails?.paymentMethod}
          </p>
          {paymentDetails?.transactionId && (
            <p>
              <b>Transaction ID:</b> {paymentDetails?.transactionId}
            </p>
          )}
          <p>
            <b>Amount paid:</b> {paymentDetails?.currency}{" "}
            {paymentDetails?.amountPaid}
          </p>
          <p>
            <b>Payment Date :</b>{" "}
            {useFormattedDateString(paymentDetails?.paymentDate)}
          </p>
          <Divider />
          <Flex gap="large" align="center" justify="space-between">
            <Title level={4}>Delivery details</Title>

            <p style={{ textDecoration: "underline" }}>
              <b>Delivery Fee:</b> {deliveryDetails?.deliveryFee}
            </p>
          </Flex>

          <Flex gap="middle" justify="space-between" align="center" wrap>
            <p>
              <b>Name: </b> {deliveryDetails?.deliveryAddress.name}
            </p>
            <p>
              <b>Street: </b> {deliveryDetails?.deliveryAddress.street}
            </p>
            <p>
              <b>Town: </b> {deliveryDetails?.deliveryAddress?.town}
            </p>
            <p>
              <b>Postal Code: </b>{" "}
              {deliveryDetails?.deliveryAddress?.postalCode}
            </p>
            <p>
              <b>County: </b> {deliveryDetails?.deliveryAddress?.county},
              {deliveryDetails?.deliveryAddress?.country}{" "}
            </p>
          </Flex>
        </Flex>
      </div>
    </Flex>
  );
};

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
  // const orderDetail = useMemo(() => {
  //   return orderList.find((order) => order.orderId === orderId);
  // }, [orderId]);

  console.log("ORDER DETAIL [RE-STRUCTURED] : ---- ", OrderDetails);

  return (
    <div style={{ padding: "1em" }}>
      <Breadcrumb items={orderDetailBreadcrumbItems} />
      <Button
        type="dashed"
        onClick={() => navigate("/")}
        icon={<i className="fa-solid fa-arrow-left"></i>}
        style={{ margin: "1em 0" }}
      >
        Back
      </Button>
      <Flex align="center" gap="large">
        <h1>Order ID: {orderId}</h1>

        <Tag color={statusColorTag(OrderDetails?.orderStatus)}>
          {OrderDetails?.orderStatus}
        </Tag>
      </Flex>

      <OrderDetailSection orderDetail={OrderDetails} />

      <OrderInfoSection orderDetail={OrderDetails} />
    </div>
  );
};

export default OrderDetail;
