import { Divider, Drawer, Flex, Radio, RadioChangeEvent, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useOrderMapTrackerProvider } from "../context/OrderMapTrackerContext";

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

  const [alternateRoute, setAlternateRoute] = useState<any>(routes[0]);

  const routeWaypoints = routingInfo?.waypoints;
  const startingPoint = routeWaypoints[0]?.name;
  const destination = routeWaypoints[1]?.name;

  // Format duration to hours, minutes

  const convertDurationToHoursAndMinutes = (seconds: number) => {
    console.log("SECONDS VALUE === ", seconds);
    const minutes = seconds / 60;
    if (minutes >= 60) {
      const hours = Math.ceil(minutes / 60);
      const remainingMinutes = Math.ceil(minutes % 60);
      return `${hours} Hours, ${remainingMinutes} minutes`;
    } else {
      return `${Math.ceil(minutes)} minutes`;
    }
  };

  const duration = convertDurationToHoursAndMinutes(alternateRoute?.duration); // TODO: Convert to hrs,min
  const distanceMeters = Math.ceil(alternateRoute?.distance);
  const distanceKm = parseFloat((alternateRoute?.distance / 1000).toFixed(2));

  const routeOptions = [
    { label: "Route A", value: 0 },
    { label: "Route B", value: 1 },
  ];
  const { setActiveRoute } = useOrderMapTrackerProvider();

  // alternate route handler - update
  const handleAlternateRoute = (e: RadioChangeEvent) => {
    setAlternateRoute(routes[e.target.value]);
    setActiveRoute(routes[e.target.value]?.geometry);
  };

  useEffect(() => {
    if (alternateRoute) {
      console.log("CURRENT ALTERNATE ROUTE: =====", alternateRoute);
    }
  }, [alternateRoute]);
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
          onChange={(e) => handleAlternateRoute(e)}
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
          {/* <i className="fa-solid fa-clock"></i> */}
          <i className="fa-solid fa-truck-fast"></i>
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
