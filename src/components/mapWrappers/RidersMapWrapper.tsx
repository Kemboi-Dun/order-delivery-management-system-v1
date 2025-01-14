import React, { useEffect, useState } from "react";
import LiveLocationMap from "../LiveLocationMap";
import { useOrderProvider } from "../../context/OrdersContext";
import { Marker, Popup } from "react-map-gl";
import { Badge, Flex } from "antd";

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

  console.log("Rider Locations ==== ", riderLocations);

  // current location hanlder
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude & longitude) {
          setCurrentLocation((prev: any) => ({
            ...prev,
            latitude,
            longitude,
            zoom: 8,
          }));
        }
      },
      (error) => {
        console.error("Error getting current location: === ", error);
      },
      { enableHighAccuracy: true }
    );
  };

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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div style={{ width: "100%", height: "70vh" }}>
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
          <>
            <Marker
              key={index}
              latitude={location?.latitude}
              longitude={location?.longitude}
              color="black"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                // console.log(location);
                setRiderPopup(location);
              }}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            ></Marker>
            {riderPopUp && (
              <Popup
                latitude={riderPopUp?.latitude}
                longitude={riderPopUp?.longitude}
                anchor="bottom"
                onClose={() => setRiderPopup(false)}
              >
                <Flex vertical gap="small">
                  <p>{riderPopUp?.name}</p>
                  <Badge
                    status={getTagStatusColor(riderPopUp?.status)}
                    text={riderPopUp?.status}
                  />
                </Flex>
              </Popup>
            )}
          </>
        ))}
      </LiveLocationMap>
    </div>
  );
};

export default RidersMapWrapper;
