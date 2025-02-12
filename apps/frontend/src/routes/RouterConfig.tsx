import { Routes, Route, Navigate } from "react-router";
import { useWallet } from "@vechain/dapp-kit-react";
import { routes } from "./routes.config";
import { RouteConfig } from "./routes.types";
import Layout from "@/Layout";

export const RouterConfig = () => {
  const { account } = useWallet();

  const renderRoute = (route: RouteConfig) => {
    const Component = route.component;

    if (route.protected && !account) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRoute(route)}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
