import React, { ReactNode, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl } from "react-map-gl";

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
// const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; 
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoia2VtYm9pLWR1biIsImEiOiJjbTN5c2o2N3ExaXRsMmtzZmtwbHhrZDNmIn0.T5ozOkEHfYLWqqpl8cuVJg"; //! FOR DEMOSTRATION PURPOSES ONLY

const LiveLocationMap: React.FC<LiveLocationMapInterface> = ({
  children,
  currentViewPort,
}) => {
  const [viewPort, setViewPort] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    zoom: 14,
  });

  // use user's current location as default view port
  const getCurrentUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) {
          setViewPort((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        }
      },
      (error) => {
        console.error("ERROR GETTING USER'S CURRENT LOCATION ----", error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  console.log("CURRENT ACTIVE PORT +++++ ", currentViewPort);

  // formattedOrderDetails?.pickUpStationDetails ||
  useEffect(() => {
    const { latitude, longitude } = currentViewPort || viewPort;
    if (latitude && longitude) {
      setViewPort((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    } else {
      getCurrentUserLocation(); // Use the user location if none of the above is provided
    }
  }, [currentViewPort]);

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

        {children}
      </Map>
    </div>
  );
};

export default LiveLocationMap;
