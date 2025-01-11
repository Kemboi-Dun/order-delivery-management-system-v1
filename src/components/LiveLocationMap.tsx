import React, { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map, Marker, NavigationControl, Popup } from "react-map-gl";
import { Flex } from "antd";

interface LiveLocationMapInterface {
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
}

// mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveLocationMap: React.FC<LiveLocationMapInterface> = ({
  customerCoordinates,
}) => {
  const [viewPort, setViewPort] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    zoom: 14,
  });

  const [userLocation, setUserLocation] = useState<
    { latitude: number; longitude: number; location: string } | any
  >(null);
  const [userPopUp, setUserPopup] = useState(true);

  useEffect(() => {
    const { latitude, longitude } = customerCoordinates;
    setUserLocation(customerCoordinates);
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
        <NavigationControl/>
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
      </Map>
    </div>
  );
};

export default LiveLocationMap;
