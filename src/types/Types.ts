import { ColumnGroupType, ColumnsType } from "antd/es/table";
import React from "react";

export type CustomerDetailType = {
  id?: number;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: AddressType;
};

export type AddressType = {
  name: string;
  street: string;
  town: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type OrderItemType = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  key?: string;
};

export type PaymentDetailsType = {
  paymentMethod: string;
  transactionId?: string;
  amountPaid: number;
  currency: string;
  paymentDate: string;
};

export type DeliveryDetailsType = {
  deliveryFee: number;
  deliveryAddress: AddressType;
  expectedDeliveryDate: string;
};

export type OrderDetailType = {
  orderId: string;
  orderDate: string;
  customerDetails: CustomerDetailType;
  orderItems: OrderItemType[];
  paymentDetails: PaymentDetailsType;
  deliveryDetails: DeliveryDetailsType;
  //   "Processing" | "Dispatched" | "Delivered" | "Canceled"
  orderStatus: string;
  totalAmount: number;
};

export type PickUpStationType = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  status: string;
};

export type CustomerCoordinates = {
  longitude: number;
  latitude: number;
  location: string;
};

export type RoutingCoordinatesTypes = {
  origin: number[];
  destination: number[];
};

export interface FilterButtonProps {
  label?: string;
  type?: "primary" | "default" | "text" | "dashed";
  onClick: () => void;
  children: React.ReactNode;
}

export type UserInfoTypes = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
};

export interface UserListProps {
  users: UserInfoTypes[];
}
