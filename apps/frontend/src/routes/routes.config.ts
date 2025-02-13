import { lazy } from "react";
import { RouteConfig } from "./routes.types";

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: lazy(() => import("../features/home")),
    protected: false,
  },
/*   {
    path: "/map",
    component: lazy(() => import("../features/map")),
    protected: true,
  },
  {
    path: "/add-bin",
    component: lazy(() => import("../features/addBin")),
    protected: true,
  }, */
  {
    path: "/profile",
    component: lazy(() => import("../features/profile")),
    protected: false,
  },
];
