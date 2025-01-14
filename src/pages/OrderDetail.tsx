import React, { useState } from "react";
import {
  Breadcrumb,
  Button,
  Descriptions,
  DescriptionsProps,
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

import { useFormattedDateString } from "../hooks/DateHook";

import {
  OrderDetailsInterface,
  OrderItemType,
  TrackOrderModalInterface,
  UserInfoType,
} from "../types/Types";

import { statusColorTag } from "../utils/HelperFunctions";
import {
  OrderDetailProvider,
  useOrderDetailProvider,
} from "../context/OrderDetailContext";
import { livemapStyles, trackOrderMapStyles } from "../utils/CssProperties";
import CustomerInfoDrawer from "../components/CustomerInfoDrawer";
import CustomerLocationWrapper from "../components/mapWrappers/CustomerLocationWrapper";
import TrackOrderMapWrapper from "../components/mapWrappers/TrackOrderMapWrapper";
import { OrderMapTrackerProvider } from "../context/OrderMapTrackerContext";

const { Title } = Typography;

// Order items tableOrderItems
const OrderItems: React.FC<OrderDetailsInterface> = () => {
  const { orderDetail } = useOrderDetailProvider();

  const orderItems: OrderItemType[] = orderDetail?.orderItems?.map(
    (item: OrderItemType) => item
  );

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
      sorter: (a: any, b: any) => a?.quantity - b?.quantity,
    },

    {
      title: "Unit Price",
      key: "unitPrice",
      dataIndex: "unitPrice",
      sorter: (a: any, b: any) => a?.unitPrice - b?.unitPrice,
      render: (value: number) => <p>KES {value}</p>,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      dataIndex: "totalPrice",
      sorter: (a: any, b: any) => a?.totalPrice - b?.totalPrice,
      render: (value: number) => <p>KES {value}</p>,
    },
  ];

  return (
    <Table
      columns={orderItemsColumns}
      dataSource={orderItems}
      rowKey="productId"
    />
  );
};

const OrderDetailSection: React.FC = () => {
  const { orderDetail, customerCoordinates } = useOrderDetailProvider();

  // customer drawer states
  const [openCustomerDrawer, setCustomerDrawer] = useState(false);

  // TODO:: --- Move to provider
  // const customerCoordinates = {
  //   latitude: orderDetail?.customerDetails.address.latitude,
  //   longitude: orderDetail?.customerDetails.address.longitude,
  //   location: `${orderDetail?.customerDetails.address.name}, ${orderDetail?.customerDetails.address.county}`,
  // };

  // open customer drawer:
  const viewCustomerInfo = () => setCustomerDrawer(true);
  const closeCustomerDrawer = () => setCustomerDrawer(false);

  // track order modal state
  const [openTrackOrder, setTrackOderModal] = useState(false);
  const openTrackOrderModal = () => setTrackOderModal(true);
  const closeTrackOrderModal = () => setTrackOderModal(false);

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
              orderDetail?.deliveryDetails?.expectedDeliveryDate
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
        />

        <p>
          Total amount: <b> KES {orderDetail?.totalAmount}</b>
        </p>
      </Flex>
    </div>
  );
};

// user info Drawer
const UserDetailDrawer: React.FC<UserInfoType> = ({ open, onClose }) => {
  const { customerDetails, customerCoordinates } = useOrderDetailProvider();

  // flatten customer address
  const customerAddress = customerDetails?.address || null;
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  // const activeUserId = customerDetails?.id || 2;

  // setOpenInfoDrawer(true)
  const navigate = useNavigate();

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
            onClick={() => navigate(`/user/${customerDetails?.id}`)}
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
                <b>Full name: </b> {customerDetails?.name}
              </p>
              <p>
                <b>Email: </b> {customerDetails?.email}
              </p>
              <p>
                <b>Phone number: </b> {customerDetails?.phone}
              </p>
            </Flex>
          </Flex>

          <Divider />
          <Flex vertical gap="small">
            <Title level={5}>Address</Title>
            <Flex gap="middle" justify="space-between" align="center" wrap>
              <p>
                <b>Name: </b> {customerAddress?.name}
              </p>
              <p>
                <b>Street: </b> {customerAddress?.street}
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
            <CustomerLocationWrapper
              customerCoordinates={customerCoordinates}
            />
          </div>
        </Flex>
      </Drawer>

      <MemoizedCustomerInfoDrawer
        openInfoDrawer={openInfoDrawer}
        onCloseInfoDrawer={() => setOpenInfoDrawer(false)}
      />
    </>
  );
};

const MemoizedUserInfo = React.memo<UserInfoType>(UserDetailDrawer);
const MemoizedCustomerInfoDrawer = React.memo(CustomerInfoDrawer);

// Track order Modal
const TrackOrderModal: React.FC<TrackOrderModalInterface> = ({
  openModal,
  closeModal,
}) => {
  const { orderDetail, customerCoordinates } = useOrderDetailProvider();

  return (
    <Modal
      title={
        <Flex gap="large" justify="start" align="center">
          <Space align="center" size="large">
            <p>Track order: {orderDetail?.orderId}</p>
            <Tag color="orange">{orderDetail?.orderStatus}</Tag>
          </Space>
        </Flex>
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
        <OrderMapTrackerProvider>
          <TrackOrderMapWrapper customerCoordinates={customerCoordinates} />
        </OrderMapTrackerProvider>
      </div>
    </Modal>
  );
};

const MemoizedTrackOrderModal = React.memo(TrackOrderModal);

// Order detail section
const OrderInfoSection: React.FC = () => {
  const { orderDetail } = useOrderDetailProvider();

  // order details [payment and address]
  const paymentDetails = orderDetail?.paymentDetails || null;
  const deliveryDetails = orderDetail?.deliveryDetails || null;

  const transactionId: any = () => {
    // return transaction ID info if payment method is M-PESA
    if (
      paymentDetails?.transactionId &&
      paymentDetails?.paymentMethod === "M-Pesa"
    ) {
      return {
        key: "transactionId",
        label: "Transaction ID",
        children: paymentDetails?.transactionId,
        span: 3,
      };
    }
  };

  const paymentItems: DescriptionsProps["items"] = [
    {
      key: "paymentMethod",
      label: "Payment Method",
      children: paymentDetails?.paymentMethod,
      span: 3,
    },
    transactionId(),
    {
      key: "amount",
      label: "Amount paid",
      children: paymentDetails?.amountPaid,
      span: 3,
    },
    {
      key: "paymentDate",
      label: "Payment Date",
      children: useFormattedDateString(paymentDetails?.paymentDate),
      span: 3,
    },
  ];

  const deliveryItems: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      children: deliveryDetails?.deliveryAddress?.name,
      span: 3,
    },
    {
      key: "street",
      label: "Street",
      children: deliveryDetails?.deliveryAddress?.street,
      span: 3,
    },
    {
      key: "town",
      label: "Town",
      children: deliveryDetails?.deliveryAddress?.town,
      span: 3,
    },
    {
      key: "postalCode",
      label: "Postal Code",
      children: deliveryDetails?.deliveryAddress?.postalCode,
      span: 3,
    },
    {
      key: "county",
      label: "County",
      children: `${deliveryDetails?.deliveryAddress?.county}, ${deliveryDetails?.deliveryAddress?.country}`,
      span: 3,
    },
  ];

  return (
    <>
      <Flex
        gap="middle"
        align="start"
        style={{ height: "100%", width: "100%" }}
      >
        <OrderItems orderDetail={orderDetail} />

        <div style={{ width: "40%", height: "100%", overflowY: "auto" }}>
          <Descriptions items={paymentItems} title="Payment Details" />
          <Divider />
          <Descriptions
            items={deliveryItems}
            title="Delivery Details"
            extra={
              <p style={{ textDecoration: "underline" }}>
                <b>Delivery Fee:</b> {deliveryDetails?.deliveryFee}
              </p>
            }
          />
        </div>
      </Flex>
    </>
  );
};

// order Section header
const OrderDetailHeader: React.FC = () => {
  const { orderDetail } = useOrderDetailProvider();
  // console.log("ORDER DETAIL [RE-STRUCTURED] : ---- ", orderDetail);

  const urlParams = useParams();
  const orderId = urlParams?.order_id;
  const navigate = useNavigate();

  // Order detail params
  const orderDetailBreadcrumbItems = [
    {
      title: <a href="/">Orders</a>,
    },
    {
      title: "Order detail",
    },
  ];
  return (
    <>
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

        <Tag color={statusColorTag(orderDetail?.orderStatus)}>
          {orderDetail?.orderStatus}
        </Tag>
      </Flex>
    </>
  );
};

const OrderDetail: React.FC = () => {
  return (
    <OrderDetailProvider>
      <div style={{ padding: "1em" }}>
        <OrderDetailHeader />
        <OrderDetailSection />
        <OrderInfoSection />
      </div>
    </OrderDetailProvider>
  );
};

export default OrderDetail;
