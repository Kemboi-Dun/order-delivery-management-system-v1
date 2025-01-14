import { createContext, ReactNode, useContext, useState } from "react";

interface OrderMapTrackerContextProps {
  activeRoute: any;
  setActiveRoute: (route: any) => void;
}

const OrderMapTrackerContext = createContext<
  OrderMapTrackerContextProps | undefined
>(undefined);

interface OrderMapTrackerProviderProps {
  children: ReactNode;
}

export const OrderMapTrackerProvider: React.FC<
  OrderMapTrackerProviderProps
> = ({ children }) => {
  const [activeRoute, setRoute] = useState();
  
  const setActiveRoute = (route: any) => {
    setRoute(route);
  };

  return (
    <OrderMapTrackerContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </OrderMapTrackerContext.Provider>
  );
};

export const useOrderMapTrackerProvider = () => {
  const context = useContext(OrderMapTrackerContext);
  if (!context) {
    throw new Error(
      "OrderMapTrackerContext can only be used inside a OrderMapTrackerProvider"
    );
  }
  return context;
};
