import { Suspense, lazy } from "react";
import Loader from "../assets/loader/Loader";
import { RouteObject } from "react-router-dom";

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

// layout page
const AppLayout = Loadable(lazy(() => import("../layout/AppLayout")));

// routable pages
const HomePage = Loadable(lazy(() => import("../pages/HomePage")));
// const OrdersList = Loadable(lazy(() => import("../pages/OrderList")));
const OrderDetail = Loadable(lazy(() => import("../pages/OrderDetail")));

const UserList = Loadable(lazy(() => import("../pages/UserList")));

const ErrorPage = Loadable(lazy(() => import("../pages/ErrorPage")));

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      // {
      //   path: "/orders",
      //   element: <OrdersList />,
      // },
      {
        path: "/order/:order_id",
        element: <OrderDetail />,
      },
      {
        path: "/users",
        element: <UserList />,
      },
    ],
  },

  {
    path: "/error",
    element: <ErrorPage />,
  },
];

export default Routes;
