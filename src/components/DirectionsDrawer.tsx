import { Divider, Drawer, Flex, Radio, Space } from "antd";
import React, { useEffect, useState } from "react";

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
  // const[duration, setDuration] = useState();
  // const[distance, setDistance] = useState();
  const routes = routingInfo?.routes;

  const [alternateRoute, setAlternateRoute] = useState<any>(
    routingInfo?.routes[0]
  );

  const routeWaypoints = routingInfo?.waypoints;
  const startingPoint = routeWaypoints[0]?.name;
  const destination = routeWaypoints[1]?.name;

  // Format duration to hours, minutes

  const convertDurationToHoursAndMinutes = (seconds: number) => {
    console.log("SECONDS VALUE === ", seconds);
    const minutes = seconds / 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.floor(minutes % 60);
      return `${hours} Hours, ${remainingMinutes} minutes`;
    } else {
      return `${Math.floor(minutes)} minutes`;
    }
  };

  const duration = convertDurationToHoursAndMinutes(alternateRoute?.duration); // TODO: Convert to hrs,min
  const distanceMeters = Math.floor(alternateRoute?.distance);
  const distanceKm = Math.floor(alternateRoute?.distance / 1000);

  const routeOptions = [
    { label: "Route A", value: 0 },
    { label: "Route B", value: 1 },
  ];

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
      {routes && routes.length > 1 && (
        <Radio.Group
          block
          optionType="button"
          options={routeOptions}
          defaultValue={0}
          onChange={(e) => setAlternateRoute(e.target.value)}
        />
      )}
      <Space size="small" style={{ marginTop: "0.5em" }}>
        <small>
          <b>{startingPoint}</b>
        </small>{" "}
        to{" "}
        <small>
          <b>{destination}</b>
        </small>
      </Space>
      <Divider />
      <Flex vertical gap="small" align="start">
        <Space size="small">
          <i className="fa-solid fa-clock"></i>
          <p>
            <b>{duration}</b>
          </p>
        </Space>
        <Space size="small">
          <i className="fa-solid fa-route"></i>
          <p>
            {" "}
            {distanceKm}km | {distanceMeters}m
          </p>
        </Space>
      </Flex>
    </Drawer>
  );
};

export default DirectionsDrawer;
