import { lazy } from "solid-js";
import type { RouteDefinition } from "solid-app-router";

import Home from "./pages/home";

// Route definition with data:
// {
//   path: '/about',
//   component: lazy(() => import('./pages/about')),
//   data: AboutData,
// },

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/timeline",
    component: lazy(() => import("./pages/timeline")),
  },
  {
    path: "/calendar",
    component: lazy(() => import("./pages/calendar")),
  },
  {
    path: "/investments",
    component: lazy(() => import("./pages/investments")),
  },
  {
    path: "/settings",
    component: lazy(() => import("./pages/settings")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
