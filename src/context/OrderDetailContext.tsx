import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  CustomerDetailType,
  OrderDetailsInterface,
  OrderDetailType,
} from "../types/Types";
import OrderDetails from "../data/OrderDetails.json";
import pickUpStations from "../data/PickUpPoints.json";
import { useNavigate } from "react-router-dom";

interface OrderDetailContextInterface extends OrderDetailsInterface {
  //   setOrderDetail: (value: any) => void;
  customerCoordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
  //   setCustomerCoordinates: (value: any) => void;
  customerDetails: CustomerDetailType;
  customerID: string | number;
  formattedOrderDetails: any; // TODO: Create a type for this
  setCustomerId_info: (id: number | string) => void;
}

const OrderDetailContext = createContext<
  OrderDetailContextInterface | undefined
>(undefined);

interface OrderDetailProviderProps {
  children: ReactNode;
}

export const OrderDetailProvider: React.FC<OrderDetailProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const orderDetail: OrderDetailType = OrderDetails;
  //   const [orderDetail, setOrderDetail] = useState<OrderDetailType | any>(null);

  const [customerCoordinates, setCustomerCoordinates] = useState<
    { latitude: number; longitude: number; location: string } | any
  >({});

  const [customerDetails, setCustomerDetails] = useState<
    CustomerDetailType | any
  >();

  const [customerID, setCustomerID] = useState<number | string>("");

  const [formattedOrderDetails, setFormattedOrderDetails] = useState<any>();

  // update order detail and customer coordinates
  const updateOrderAndCustomerState = () => {
    if (orderDetail) {
      // set up customer coordinates
      const customerCoordinates = {
        latitude: orderDetail?.customerDetails?.address?.latitude,
        longitude: orderDetail?.customerDetails?.address?.longitude,
        location: `${orderDetail?.customerDetails?.address?.name}, ${orderDetail?.customerDetails?.address?.county}`,
      };
      setCustomerCoordinates(customerCoordinates);
      setCustomerDetails(orderDetail?.customerDetails);
      const userId: any = orderDetail?.customerDetails?.id; // Todo: Update type
      setCustomerID(userId);

      // set up location details
      const locationOrderDetails = {
        pickUpStationDetails: {
          latitude: pickUpStations[0]?.latitude,
          longitude: pickUpStations[0]?.longitude,
          name: pickUpStations[0]?.name,
          id: pickUpStations[0]?.id,
          status: pickUpStations[0]?.status,
        },
        description: {
          orderId: orderDetail?.orderId,
          status: orderDetail?.orderStatus,
        },
        deliveryDetails: {
          latitude: orderDetail?.deliveryDetails?.deliveryAddress?.latitude,
          longitude: orderDetail?.deliveryDetails?.deliveryAddress?.longitude,
          location: orderDetail?.deliveryDetails?.deliveryAddress?.name,
        },
      };

      setFormattedOrderDetails(locationOrderDetails);
    }
  };

  //   useEffect(() => {
  //       if (!OrderDetails) {
  //           navigate("/error");
  //         }
  //         setOrderDetail(OrderDetails);
  //     }, []);

  const setCustomerId_info = (customer_id: number | string) => {
    setCustomerID(customer_id);
  };

  useEffect(() => {
    if (!OrderDetails) {
      navigate("/error");
    }
    updateOrderAndCustomerState();
  }, []); //! Currently the data is static

  return (
    <OrderDetailContext.Provider
      value={{
        customerID,
        orderDetail,
        customerDetails,
        customerCoordinates,
        formattedOrderDetails,
        setCustomerId_info,
      }}
    >
      {children}
    </OrderDetailContext.Provider>
  );
};

export const useOrderDetailProvider = () => {
  const context = React.useContext(OrderDetailContext);

  if (!context) {
    throw new Error(
      "You can not use OrderDetailContext outside OrderDetailProvider!"
    );
  }

  return context;
};
