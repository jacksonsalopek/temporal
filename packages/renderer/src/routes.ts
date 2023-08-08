import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

// Route definition with data:
// {
//   path: '/about',
//   component: lazy(() => import('./pages/about')),
//   data: AboutData,
// },

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./dashboard/dashboard.page")),
  },
  {
    path: "/timeline",
    component: lazy(() => import("./timeline/timeline.page")),
  },
  {
    path: "/calendar",
    component: lazy(() => import("./calendar/calendar.page")),
  },
  {
    path: "/investments",
    component: lazy(() => import("./investments/investments.page")),
  },
  {
    path: "/settings",
    component: lazy(() => import("./settings/settings.page")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
