import React, { useEffect, useState } from "react";
import LiveLocationMap from "../LiveLocationMap";
import { Marker, Popup } from "react-map-gl";
import { Flex } from "antd";

interface CustomerLocationMapWrapper {
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
}

const CustomerLocationWrapper: React.FC<CustomerLocationMapWrapper> = ({
  customerCoordinates,
}) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    location: string;
  }>();

  const [userPopUp, setUserPopup] = useState(true);

  useEffect(() => {
    setUserLocation(customerCoordinates);
  }, [customerCoordinates]);

  return (
    <LiveLocationMap currentViewPort={customerCoordinates}>
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
    </LiveLocationMap>
  );
};

export default CustomerLocationWrapper;
