import React, { memo, useEffect, useState } from "react";
import LiveLocationMap from "../LiveLocationMap";
import { useOrderProvider } from "../../context/OrdersContext";
import { Marker, Popup } from "react-map-gl";
import { Badge, Button, Flex, notification } from "antd";
import { boundCoordinatesTypes } from "../../types/Types";
import { calculateBounds } from "../../utils/HelperFunctions";

const RidersMapWrapper: React.FC = () => {
  const { riders } = useOrderProvider();

  // TODO: UPDATE ALL THE TYPES

  const [currentLocation, setCurrentLocation] = useState<any>();
  const [riderPopUp, setRiderPopup] = useState<any>();

  const riderLocations = riders?.map((rider: any) => ({
    name: rider?.name,
    status: rider?.status,
    latitude: rider?.location?.latitude,
    longitude: rider?.location?.longitude,
  }));

  // find bounds coordinates
  const formattedBounds: boundCoordinatesTypes[] = riderLocations?.map(
    (location) => ({ lng: location?.longitude, lat: location?.latitude })
  );
  // console.log("Rider Locations [Bounds] ==== ", formattedBounds);

  const getBoundsViewPort = () => {
    const { latitude, longitude, zoom } = calculateBounds(formattedBounds);
    setCurrentLocation({ latitude, longitude, zoom });
  };

  // current location hanlder
  // const getCurrentLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       if (latitude & longitude) {
  //         setCurrentLocation((prev: any) => ({
  //           ...prev,
  //           latitude,
  //           longitude,
  //           zoom: 8,
  //         }));
  //       }
  //     },
  //     (error) => {
  //       console.error("Error getting current location: === ", error);
  //     },
  //     { enableHighAccuracy: true }
  //   );
  // };

  // geojson formatting handler
  //   const riderGeoJsonData = {
  //     type: "FeatureCollection",
  //     features: riderLocations.map((location: any) => ({
  //       type: "Feature",
  //       geometry: {
  //         type: "point",
  //         coordinates: [location?.longitude, location?.latitude],
  //       },
  //       properties: {
  //         name: location?.name,
  //       },
  //     })),
  //   };

  // Rider status tag color handler
  const getTagStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "on-delivery":
        return "processing";
      case "on-break":
        return "warning";
      case "deactivated":
        return "error";
      default:
        return "default";
    }
  };
  const [api, contextHolder] = notification.useNotification();

  // handle rider assignment
  const handleRiderAssignment = () => {
    api["info"]({
      message: "Request sent",
      description: " Awaiting confirmation from rider.",
    });
  };

  useEffect(() => {
    // if (riderLocations) {
    //   getBoundsViewPort();
    // } else {
    //   getCurrentLocation();
    // }
    getBoundsViewPort();
  }, []);


interface RiderMarkerProps {
  location: {
    name: string;
    status: string;
    latitude: number;
    longitude: number;
  };
  onClick: (e: any) => void;
}

const RiderMarker: React.FC<RiderMarkerProps> = memo(({ location, onClick }) => (
  <Marker
    latitude={location?.latitude}
    longitude={location?.longitude}
    color={location?.status === "available" ? "green" : "black"}
    onClick={onClick}
    style={{ cursor: "pointer", pointerEvents: "auto" }}
  />
));


  return (
    <div style={{ width: "100%", height: "70vh" }}>
      {contextHolder}
      <LiveLocationMap currentViewPort={currentLocation}>
        {/* <Source
        id="rider-locations-wrapper"
        type="geojson"
        data={riderGeoJsonData}
      >
        <Layer
          id="rider-locations-layer"
          type="circle"
          paint={{
            "circle-color": "#ff0000",
            "circle-radius": 6,
          }}
        />
      </Source> */}

        {riderLocations?.map((location, index) => (
          <div key={index}>
         <RiderMarker location={location} onClick={(e) => {
    e.originalEvent.stopPropagation();
    // console.log(location);
    setRiderPopup(location);
  }}/>
        
          </div>
        ))}
            {riderPopUp && (
              <Popup
                latitude={riderPopUp?.latitude}
                longitude={riderPopUp?.longitude}
                anchor="bottom"
                onClose={() => setRiderPopup(false)}
              >
                <Flex vertical gap="small">
                  <p style={{ fontWeight: "bold" }}>{riderPopUp?.name}</p>
                  <Badge
                    status={getTagStatusColor(riderPopUp?.status)}
                    text={riderPopUp?.status}
                  />
                  {riderPopUp?.status === "available" && (
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleRiderAssignment}
                    >
                      Assign
                    </Button>
                  )}
                </Flex>
              </Popup>
            )}
      </LiveLocationMap>
    </div>
  );
};

export default RidersMapWrapper;
