import React, { useCallback, useEffect, useMemo, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
import { Badge, Button, Flex, Space, Tooltip } from "antd";
import OrdersService from "../services/Services";
import DirectionsDrawer from "./DirectionsDrawer";
import { RoutingCoordinatesTypes } from "../types/Types";

interface LiveLocationMapInterface {
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
  orderDetails?: {
    pickUpStationDetails: {
      id: number;
      name: string;
      longitude: number;
      latitude: number;
      status: string;
    };
    description: {
      orderId: string;
      status: string;
    };
  };
}

// mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveLocationMap: React.FC<LiveLocationMapInterface> = ({
  customerCoordinates,
  orderDetails,
}) => {
  const [viewPort, setViewPort] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    zoom: 14,
  });

  // manage customer location state
  const [userLocation, setUserLocation] = useState<
    { latitude: number; longitude: number; location: string } | any
  >(null);

  const [userPopUp, setUserPopup] = useState(true);

  // manage pick up location state
  const [pickUpLocation, setPickUpLocation] = useState<
    { latitude: number; longitude: number; location: string } | any
  >(null);
  const [pickUpLocationPopUp, setPickUpLocationPopUp] = useState(true);

  // manage route state
  const [deliveryRoute, setDeliveryRoute] = useState<
    { type: string; coordinates: number[] } | any
  >(null);

  // get routes
  // create origin and destinations for routing
  // const origin: any[] = [
  //   orderDetails?.pickUpStationDetails?.latitude,
  //   orderDetails?.pickUpStationDetails?.longitude,
  // ];
  // const destination: number[] = [
  //   customerCoordinates?.latitude,
  //   customerCoordinates?.longitude,
  // ];

  // get delivery route
  const routingCoordinates: RoutingCoordinatesTypes | any = {
    origin: [
      orderDetails?.pickUpStationDetails?.longitude,
      orderDetails?.pickUpStationDetails?.latitude,
    ],
    destination: [
      customerCoordinates?.longitude,
      customerCoordinates?.latitude,
    ],
  };
  const getDeliveryRoute = useCallback(async () => {
    try {
      const response = await OrdersService.getDeliveryRoute(routingCoordinates);

      if (response?.routes?.length) {
        console.log("RESPONSE --- ", response?.routes[0]?.geometry);
        setDeliveryRoute(response?.routes[0]?.geometry);
        setRoutingInfo(response);
        setOpenDirectionsDrawer(true);
      } else {
        console.log("Routes not found");
      }
    } catch (error) {
      console.log("Error getting routes: ---- ", error);
      throw error;
    }
  }, [routingCoordinates]);

  // route source and layer

  const deliveryRouteData = useMemo(() => {
    if (!deliveryRoute || deliveryRoute?.type !== "LineString") return null;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: deliveryRoute,
        },
      ],
    };
  }, [deliveryRoute]);

  useEffect(() => {
    const { latitude, longitude } = orderDetails
      ? orderDetails?.pickUpStationDetails
      : customerCoordinates;
    setUserLocation(customerCoordinates);
    setPickUpLocation(orderDetails?.pickUpStationDetails);
    if (latitude && longitude) {
      setViewPort((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    }
  }, [orderDetails, customerCoordinates]);

  // manage directions drawer
  const [openDirectionsDrawer, setOpenDirectionsDrawer] = useState(false);
  const [routingInfo, setRoutingInfo] = useState(null);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        {...viewPort}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(e) => setViewPort(e.viewState)}
      >
        <NavigationControl />

        {userLocation && (
          <>
            <Marker
              latitude={userLocation?.latitude}
              longitude={userLocation?.longitude}
              color="blue"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setUserPopup(true);
              }}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            />
            {userPopUp && (
              <Popup
                latitude={userLocation?.latitude}
                longitude={userLocation?.longitude}
                onClose={() => setUserPopup(false)}
                anchor="top"
              >
                <Flex gap="small" align="center">
                  <i className="fa-solid fa-street-view"></i>
                  <p>{userLocation?.location}</p>
                </Flex>
              </Popup>
            )}
          </>
        )}
        {pickUpLocation && (
          <>
            <Marker
              latitude={pickUpLocation?.latitude}
              longitude={pickUpLocation?.longitude}
              color="red"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPickUpLocationPopUp(true);
              }}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            ></Marker>

            {pickUpLocationPopUp && (
              <Popup
                latitude={pickUpLocation?.latitude}
                longitude={pickUpLocation?.longitude}
                anchor="bottom"
                onClose={() => setPickUpLocationPopUp(false)}
              >
                <Flex gap="small" align="center" vertical>
                  <Space align="center" size="small">
                    <i className="fa-solid fa-boxes-packing"></i>
                    <p>{pickUpLocation?.name}</p>
                    <Tooltip title="Status">
                      <Badge
                        status={
                          pickUpLocation?.status === "active"
                            ? "success"
                            : "error"
                        }
                        text={<small>{pickUpLocation?.status}</small>}
                      />
                    </Tooltip>
                  </Space>
                  <p>
                    Order ID: <b>{orderDetails?.description?.orderId}</b>
                  </p>
                  <Button
                    icon={<i className="fa-solid fa-route"></i>}
                    type="primary"
                    onClick={() => getDeliveryRoute()}
                    style={{ margin: "1em 0" }}
                    size="small"
                  >
                    Get Route
                  </Button>
                
                </Flex>
              </Popup>
            )}
          </>
        )}

        {deliveryRoute && (
          <>
            <Source id="delivery-route" type="geojson" data={deliveryRouteData}>
              <Layer
                id="delivery-route-line"
                type="line"
                paint={{
                  "line-color": "#3b9ddd",
                  "line-width": 5,
                }}
              />
            </Source>

            <DirectionsDrawer
              routingInfo={routingInfo}
              openDirectionsDrawer={openDirectionsDrawer}
              setOpenDirectionsDrawer={setOpenDirectionsDrawer}
            />
          </>
        )}
      </Map>
    </div>
  );
};

export default LiveLocationMap;
