import React, { ReactNode, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl } from "react-map-gl";
import { notification } from "antd";

interface LiveLocationMapInterface {
  currentViewPort: {
    latitude: number;
    longitude: number;
  };
  children: ReactNode;
  // orderDetails?: {
  //   pickUpStationDetails: {
  //     id: number;
  //     name: string;
  //     longitude: number;
  //     latitude: number;
  //     status: string;
  //   };
  //   description: {
  //     orderId: string;
  //     status: string;
  //   };
  // };
}

// mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveLocationMap: React.FC<LiveLocationMapInterface> = ({
  children,
  currentViewPort,
}) => {
  const [viewPort, setViewPort] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    zoom: 12.8,
    // zoom: 9,
  });

  const [api, contextHolder] = notification.useNotification();
  const handleLocationError = () => {
    api["error"]({
      message: "Location error",
      description: " Unable to retrieve your location.",
    });
  };
  // use user's current location as default view port
  const getCurrentUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) {
          setViewPort({ latitude, longitude, zoom: 12.5 });
        }
      },
      (error) => {
        console.error("ERROR GETTING USER'S CURRENT LOCATION ----", error);

        handleLocationError();
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  // console.log("CURRENT ACTIVE PORT +++++ ", currentViewPort);

  // useEffect(() => {
  //   const { latitude, longitude } = currentViewPort || viewPort;
  //   if (latitude && longitude) {
  //     setViewPort((prev) => ({
  //       ...prev,
  //       latitude,
  //       longitude,
  //     }));
  //   } else {
  //     getCurrentUserLocation(); // Use the user location if none of the above is provided
  //   }
  // }, [currentViewPort]);

  useEffect(() => {
    if ((currentViewPort?.longitude, currentViewPort?.latitude)) {
      setViewPort((prev) => ({ ...prev, ...currentViewPort }));
    } else {
      getCurrentUserLocation();
    }
  }, [currentViewPort]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {contextHolder}
      <Map
        {...viewPort}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(e) => setViewPort(e.viewState)}
      >
        <NavigationControl />
        {children}
      </Map>
    </div>
  );
};

export default LiveLocationMap;
