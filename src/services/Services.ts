import axios from "axios";
import { MAPBOX_ACCESS_TOKEN } from "../utils/Constants";

const OrdersService = {
  async getDeliveryRoute(origin: number[], destination: number[]) {
    const testDestination = [-1.2812574587130487, 36.83180403936404];
    const testOrigin = [-1.3565952, 36.7394816];

    // Mapbox directions API
    const directions_URI = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${testOrigin.join(
      ","
    )}; ${testDestination.join(
      ","
    )}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await axios.get(directions_URI);
      if (!response.data) {
        throw new Error(
          "ROUTE COULD NOT BE FETCHED -- [SERVER RETURNED EMPTY DATA]"
        );
      }

      console.log("TEST ORIGIN: _+++++ ", testOrigin);
      console.log("TEST DESTINATION __ ++++ ", testDestination);

      return response.data;
    } catch (error: any) {
      console.log("ERROR GETTING ROUTE: --- ", error?.message);
      throw error;
    }
  },
};

export default OrdersService;
