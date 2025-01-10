import { Suspense, lazy } from "react";
import Loader from "../assets/loader/Loader";
import { RouteObject } from "react-router-dom";

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

// routable pages
const HomePage = Loadable(lazy(() => import("../pages/HomePage")));

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
];

export default Routes;
