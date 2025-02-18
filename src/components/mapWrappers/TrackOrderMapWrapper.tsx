import React, { useCallback, useEffect, useMemo, useState } from "react";
import LiveLocationMap from "../LiveLocationMap";
import { useOrderDetailProvider } from "../../context/OrderDetailContext";
import { RoutingCoordinatesTypes } from "../../types/Types";
import OrdersService from "../../services/Services";
import { Badge, Button, Flex, Space, Tooltip } from "antd";
import { FullscreenControl, Layer, Marker, Popup, Source } from "react-map-gl";
import DirectionsDrawer from "../DirectionsDrawer";
import { useOrderMapTrackerProvider } from "../../context/OrderMapTrackerContext";
import { calculateBounds } from "../../utils/HelperFunctions";

// interface TrackOrderMapWrapperProps {
//   customerCoordinates: {
//     latitude: number;
//     longitude: number;
//     location: string;
//   };
// }

const TrackOrderMapWrapper: React.FC = () => {
  const { setActiveRoute, activeRoute } = useOrderMapTrackerProvider();

  const { formattedOrderDetails } = useOrderDetailProvider();
  const [activeViewPort, setActiveViewPort] = useState<
    { latitude: number; longitude: number; zoom: number } | any
  >();
  const [pickUpLocation, setPickUpLocation] = useState<{
    latitude: number;
    longitude: number;
    location: string;
    name: string;
    status: string;
  }>();
  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
    location: string;
  }>();

  const [pickUpLocationPopUp, setPickUpLocationPopUp] = useState(true);
  const [deliveryPopUp, setDeliveryPopUp] = useState(true);

  const [openDirectionsDrawer, setOpenDirectionsDrawer] = useState(false);
  const [routingInfo, setRoutingInfo] = useState(null);
  const [deliveryRoute, setDeliveryRoute] = useState<{
    type: string;
    coordinates: number[];
  }>();

  const [loadingRoute, setLoadingRoute] = useState(false);

  const routingCoordinates: RoutingCoordinatesTypes = useMemo(
    () => ({
      origin: [
        formattedOrderDetails?.pickUpStationDetails?.longitude,
        formattedOrderDetails?.pickUpStationDetails?.latitude,
      ],
      destination: [
        formattedOrderDetails?.deliveryDetails?.longitude,
        formattedOrderDetails?.deliveryDetails?.latitude,
      ],
    }),
    [formattedOrderDetails]
  );

  const getDeliveryRoute = useCallback(async () => {
    setLoadingRoute(true);
    try {
      const response = await OrdersService.getDeliveryRoute(routingCoordinates);

      if (response?.routes?.length) {
        // console.log("Route RESPONSE --- ", response);
        setRoutingInfo(response);
        // setDeliveryRoute(response?.routes[0].geometry);
        setActiveRoute(response?.routes[0].geometry);
        getBoundsViewPort();
        setOpenDirectionsDrawer(true);
      } else {
        console.log("Routes not found");
      }
    } catch (error) {
      console.log("Error getting routes: ---- ", error);
    } finally {
      setLoadingRoute(false);
    }
  }, [routingCoordinates]);

  useEffect(() => {
    setDeliveryRoute(activeRoute);
  }, [activeRoute]);

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

  // manage popup buttons
  const MarkerPopUpButton = () => {
    if (!routingInfo) {
      return (
        <Button
          icon={<i className="fa-solid fa-route"></i>}
          type="primary"
          onClick={() => getDeliveryRoute()}
          style={{ margin: "1em 0" }}
          size="small"
          loading={loadingRoute}
        >
          Get Route
        </Button>
      );
    } else if (routingInfo && !openDirectionsDrawer) {
      return (
        <Button
          icon={<i className="fa-solid fa-eye"></i>}
          type="dashed"
          size="small"
          onClick={() => setOpenDirectionsDrawer(true)}
        >
          View routes
        </Button>
      );
    }
  };

  // get viewort bounds
  const viewPortCoordinates = [
    { lng: routingCoordinates.origin[0], lat: routingCoordinates.origin[1] },
    {
      lng: routingCoordinates.destination[0],
      lat: routingCoordinates.destination[1],
    },
  ];

  // viewport bounds handler
  const getBoundsViewPort = () => {
    const { latitude, longitude, zoom } = calculateBounds(viewPortCoordinates);
    setActiveViewPort({ latitude, longitude, zoom });
  };

  useEffect(() => {
    const { latitude, longitude } =
      formattedOrderDetails?.pickUpStationDetails ||
      formattedOrderDetails?.deliveryDetails;

    setPickUpLocation(formattedOrderDetails?.pickUpStationDetails);
    setDeliveryLocation(formattedOrderDetails?.deliveryDetails);

    setActiveViewPort({ latitude, longitude });
  }, [formattedOrderDetails]);

  return (
    <LiveLocationMap currentViewPort={activeViewPort}>
      <FullscreenControl />

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
                  Order ID: <b>{formattedOrderDetails?.description?.orderId}</b>
                </p>

                <MarkerPopUpButton />
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

      {deliveryLocation && (
        <>
          <Marker
            latitude={deliveryLocation?.latitude}
            longitude={deliveryLocation?.longitude}
            color="green"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setDeliveryPopUp(true);
            }}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
          {deliveryPopUp && (
            <Popup
              latitude={deliveryLocation?.latitude}
              longitude={deliveryLocation?.longitude}
              onClose={() => setDeliveryPopUp(false)}
              anchor="top"
            >
              <Flex gap="small" align="center" vertical>
                <i className="fa-solid fa-arrows-to-circle"></i>
                <p>{deliveryLocation?.location}</p>
              </Flex>
            </Popup>
          )}
        </>
      )}
    </LiveLocationMap>
  );
};

export default TrackOrderMapWrapper;
