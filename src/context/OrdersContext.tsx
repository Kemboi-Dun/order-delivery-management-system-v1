import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import OrderList from "../data/Orders.json";

interface OrdersContextType {
  orders: any[];
  riders: any[];
  // openRidersModal:boolean;
  // setOpenRidersModal:()=> void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: FC<OrdersProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [riders] = useState<any[]>([]);

  useEffect(() => {
    if (OrderList?.length) {
      setOrders(OrderList);
    }
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, riders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrderProvider = () => {
  const context = React.useContext(OrdersContext);
  if (!context) {
    throw new Error("OrdersContext must be used within an OrdersProvider!");
  }
  return context;
};
