export type CustomerDetailType = {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: AddressType;
};

export type AddressType = {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
};

export type OrderItemType = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type PaymentDetailsType = {
  paymentMethod: string;
  transactionId?: string;
  amountPaid: string;
  currencey: string;
  paymentDate: string;
};

export type ShippingDetailsType = {
  shippingMethod: string;
  shippingFee: string;
  deliveryAddress: AddressType;
  expectedDeliveryDate: string;
};

export type OrderDetailType = {
  orderId: string;
  orderDate: string;
  customerDetails: CustomerDetailType;
  orderItems: OrderItemType[];
  paymentDetails: PaymentDetailsType;
  shippingDetails: ShippingDetailsType;
  orderStatus: "Processing" | "Dispatched" | "Delivered" | "Canceled";
  totalAmount: number;
};
