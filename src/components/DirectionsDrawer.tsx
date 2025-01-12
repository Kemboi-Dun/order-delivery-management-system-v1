import { Divider, Drawer, Flex, Radio, Space } from "antd";
import React, { useEffect } from "react";

// directions  card drawer interface
interface DirectionsCardInterface {
  openDirectionsDrawer: boolean;
  setOpenDirectionsDrawer: (state: boolean) => void;
  routingInfo: any;
}

const DirectionsDrawer: React.FC<DirectionsCardInterface> = ({
  openDirectionsDrawer,
  setOpenDirectionsDrawer,
  routingInfo,
}) => {
  const routeWaypoints = routingInfo?.waypoints;
  const startingPoint = routeWaypoints[0]?.name;
  const destination = routeWaypoints[1]?.name;

  useEffect(() => {
    if (routingInfo) {
      console.log("ROUTING INFO --____--- ", routingInfo);
    }
  }, [routingInfo]);

  return (
    <Drawer
      title="Route directions"
      closable
      placement="left"
      getContainer={false}
      open={openDirectionsDrawer}
      onClose={() => setOpenDirectionsDrawer(false)}
      width={250}
      style={{ height: "300px", borderRadius: "0 0 1em 0" }}
      mask={false}
    >
      <Space>
        <Radio.Group defaultValue="route_a">
          <Radio.Button value="route_a">Route A</Radio.Button>
          <Radio.Button value="route_b">Route B</Radio.Button>
        </Radio.Group>
      </Space>
      <Space size="small" style={{ marginTop: "0.5em" }}>
        <small>{startingPoint}</small> to <small>{destination}</small>
      </Space>
      <Divider />
      <Flex vertical gap="small" align="start">
        <Space size="small">
          <i className="fa-solid fa-clock"></i>
          <p>
            <b>46 minutes, 26 seconds</b>
          </p>
        </Space>
        <Space size="small">
          <i className="fa-solid fa-route"></i>
          <p> 27.6km | 16.9mi</p>
        </Space>
      </Flex>
    </Drawer>
  );
};

export default DirectionsDrawer;
