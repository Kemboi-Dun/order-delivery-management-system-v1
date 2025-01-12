import axios from "axios";
import { MAPBOX_ACCESS_TOKEN } from "../utils/Constants";
import { RoutingCoordinatesTypes } from "../types/Types";

const OrdersService = {
  async getDeliveryRoute(routingCoordinates: RoutingCoordinatesTypes) {
    // Mapbox directions API
    const directions_URI = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${routingCoordinates.origin.join(
      ","
    )}; ${routingCoordinates.destination.join(
      ","
    )}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await axios.get(directions_URI);
      if (!response.data) {
        throw new Error(
          "ROUTE COULD NOT BE FETCHED -- [SERVER RETURNED EMPTY DATA]"
        );
      }

      return response.data;
    } catch (error: any) {
      console.log("ERROR GETTING ROUTE: --- ", error?.message);
      throw error;
    }
  },
};

export default OrdersService;
