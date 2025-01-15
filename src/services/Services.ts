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
    )}?alternatives=true&geometries=geojson&language=en&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await axios.get(directions_URI);
      if (!response.data) {
        throw new Error(
          "ROUTE COULD NOT BE FETCHED -- [SERVER RETURNED EMPTY DATA]"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("ERROR GETTING ROUTE: --- ", error?.message);
      throw error;
    }
  },
  async fetchUserList() {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";
      const response = await axios.get(url);
      if (!response.data) {
        throw new Error("Message: No data was returned");
      }

      return response.data;
    } catch (error) {
      console.error("ERROR FETCHING USERS FROM JSONplaceholder ----- ", error);
      throw error;
    }
  },
};

export default OrdersService;
