import { Modal } from "antd";
import React from "react";
import OrdersMapWrapper from "./mapWrappers/OrdersMapWrapper";
interface OrdersMapProps {
  open: boolean;
  setCloseModal: () => void;
}
const OrdersMapModal: React.FC<OrdersMapProps> = ({ open, setCloseModal }) => {
  return (
    <div>
      <Modal
        title="View of orders"
        closable={true}
        destroyOnClose
        open={open}
        onCancel={setCloseModal}
        footer={null}
        centered
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "80%",
          xl: "80%",
          xxl: "80%",
        }}
      >
        <OrdersMapWrapper />
      </Modal>
    </div>
  );
};

export default OrdersMapModal;
