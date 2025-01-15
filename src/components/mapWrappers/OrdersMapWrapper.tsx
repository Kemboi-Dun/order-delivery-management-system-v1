import React, { memo, useEffect, useState } from "react";
import LiveLocationMap from "../LiveLocationMap";
import { useOrderProvider } from "../../context/OrdersContext";
import { Marker, Popup } from "react-map-gl";
import { Flex, Tag } from "antd";
import { boundCoordinatesTypes } from "../../types/Types";
import { calculateBounds } from "../../utils/HelperFunctions";

const OrdersMapWrapper: React.FC = () => {
  const { orders } = useOrderProvider();

  // TODO: UPDATE ALL THE TYPES

  const [currentLocation, setCurrentLocation] = useState<any>();
  const [orderPopUp, setOrderPopup] = useState<any>();

  const orderLocations = orders?.map((order: any) => ({
    orderId: order?.id,
    name: order?.name,
    status: order?.status,
    latitude: order?.shippingAddress?.latitude,
    longitude: order?.shippingAddress?.longitude,
  }));

  // find bounds coordinates
  const formattedBounds: boundCoordinatesTypes[] = orderLocations?.map(
    (location) => ({ lng: location?.longitude, lat: location?.latitude })
  );

  const getBoundsViewPort = () => {
    const { latitude, longitude, zoom } = calculateBounds(formattedBounds);
    setCurrentLocation({ latitude, longitude, zoom });
  };

  // Order status tag color handler
  const getTagStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
        break;
      case "Processing":
        return "processing";
        break;
      case "Dispatched":
        return "warning";
        break;
      case "Cancelled":
        return "error";
        break;

      default:
        return "default";
        break;
    }
  };

  useEffect(() => {
    getBoundsViewPort();
  }, []);

  interface OrderMarkerProps {
    location: {
      name: string;
      status: string;
      latitude: number;
      longitude: number;
    };
    onClick: (e: any) => void;
  }

  const OrderMarker: React.FC<OrderMarkerProps> = memo(
    ({ location, onClick }) => (
      <Marker
        latitude={location?.latitude}
        longitude={location?.longitude}
        color={location?.status === "available" ? "green" : "black"}
        onClick={onClick}
        style={{ cursor: "pointer", pointerEvents: "auto" }}
      />
    )
  );

  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <LiveLocationMap currentViewPort={currentLocation}>
        {orderLocations?.map((location) => (
          <div key={location?.orderId}>
            <OrderMarker
              location={location}
              onClick={(e) => {
                e.originalEvent.stopPropagation();

                setOrderPopup(location);
              }}
            />
          </div>
        ))}
        {orderPopUp && (
          <Popup
            latitude={orderPopUp?.latitude}
            longitude={orderPopUp?.longitude}
            anchor="bottom"
            onClose={() => setOrderPopup(false)}
          >
            <Flex vertical gap="small">
              <p style={{ fontWeight: "bold" }}>
                Order ID: {orderPopUp?.orderId}
              </p>
              <Tag color={getTagStatusColor(orderPopUp?.status)}>
                {orderPopUp?.status}
              </Tag>
            </Flex>
          </Popup>
        )}
      </LiveLocationMap>
    </div>
  );
};

export default OrdersMapWrapper;
