import React, { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map, Marker, NavigationControl, Popup } from "react-map-gl";
import { Badge, Flex, Space, Tooltip } from "antd";

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

  useEffect(() => {
    const { latitude, longitude } = orderDetails
      ? orderDetails?.pickUpStationDetails
      : customerCoordinates;
    setUserLocation(customerCoordinates);
    setPickUpLocation(orderDetails?.pickUpStationDetails);

    setViewPort((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "4em" }}>
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
                </Flex>
              </Popup>
            )}
          </>
        )}
      </Map>
    </div>
  );
};

export default LiveLocationMap;
