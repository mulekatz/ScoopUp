import { lazy } from "react";
import { RouteConfig } from "./routes.types";

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: lazy(() => import("../components/home")),
    protected: false,
  },
  {
    path: "/map",
    component: lazy(() => import("../components/map")),
    protected: true,
  },
  {
    path: "/add-bin",
    component: lazy(() => import("../components/add-bin")),
    protected: true,
  },
  {
    path: "/profile",
    component: lazy(() => import("../components/profile")),
    protected: false,
  },
];
