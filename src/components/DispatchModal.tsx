import { ConfigProvider, Modal, Tabs, TabsProps } from "antd";
import React from "react";
import RidersTable from "./RidersTable";
import RidersMapWrapper from "./mapWrappers/RidersMapWrapper";
// import RidersTable from "./RidersTable";

interface DispatchTableProps {
  open: boolean;
  setCloseModal: () => void;
}

const DispatchModal: React.FC<DispatchTableProps> = ({
  open,
  setCloseModal,
}) => {
  // tab items
  const riderModalTabs: TabsProps["items"] = [
    {
      label: "Riders",
      key: "riders",
      children: <RidersTable />,
      icon: <i className="fa-solid fa-people-group"></i>,
    },
    {
      label: "Map",
      key: "riders_map",
      children: <RidersMapWrapper />,
      icon: <i className="fa-solid fa-magnifying-glass-location"></i>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#155E95",
            colorPrimaryHover: "#6A80B9",
          },
        },
      }}
    >
      <Modal
        title="Assign a rider"
        closable={true}
        destroyOnClose
        open={open}
        onCancel={setCloseModal}
        footer={null}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "70%",
          xl: "50%",
          xxl: "60%",
        }}
      >
        <Tabs items={riderModalTabs} defaultActiveKey="riders" />
      </Modal>
    </ConfigProvider>
  );
};

export default DispatchModal;
