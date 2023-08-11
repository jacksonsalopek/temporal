import { Component } from "solid-js";
import { A, useRoutes, useLocation } from "@solidjs/router";
import {
  RiSystemDashboardLine,
  RiBusinessCalendar2Line,
  RiBusinessLineChartLine,
  RiSystemSettings3Line,
  RiSystemSearchEyeLine,
} from "solid-icons/ri";
import { FaSolidTimeline } from "solid-icons/fa";
import { OcSidebarcollapse3, OcSidebarexpand3 } from "solid-icons/oc";

import { useSSD } from "@shared/ssd";
import { LayoutSlice } from "@/store/layout";
import { routes } from "./routes";
import { styled } from "solid-styled-components";

export const AppMain = styled("main")`
  height: calc(100% - 64px);
  margin: 24px;
`;

const App: Component = () => {
  const store = useSSD();

  const layoutSlice = store?.refs.layout as LayoutSlice;
  const isSidebarVisible = () => layoutSlice.isSidebarVisible();

  const location = useLocation();
  const Route = useRoutes(routes);

  const getNameFromPathname = (pathname: string) => {
    if (pathname === "/") {
      return "Dashboard";
    }
    const name = pathname.split("/")[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div class="mockup-window bg-neutral">
      <div class="navbar bg-neutral text-primary-content pl-24 -my-5">
        <div class="flex-none">
          <button
            class="btn btn-square btn-ghost drawer-button"
            title="Sidebar Expand/Collapse button"
            type="button"
            onClick={() => {
              document.getElementById("my-drawer")?.click();
              layoutSlice.toggleSidebar();
            }}
          >
            {isSidebarVisible() ? (
              <OcSidebarcollapse3
                size={24}
                class="rotate-180"
                fill="currentcolor"
              />
            ) : (
              <OcSidebarexpand3
                size={24}
                class="rotate-180"
                fill="currentcolor"
              />
            )}
          </button>
        </div>
        <div class="flex-none normal-case text-xl ml-2 font-semibold">
          {getNameFromPathname(location.pathname)}
        </div>
        <div class="navbar-center lg:flex flex-1" />
        <div class="flex-none gap-2">
          <div class="form-control">
            <div class="input-group">
              <input type="text" placeholder="Search…" class="input" />
              <button
                class="btn btn-square bg-base-100 border-none"
                title="Search button"
                type="button"
              >
                <RiSystemSearchEyeLine size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer mt-5">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <AppMain>
            <Route />
          </AppMain>
        </div>
        <div class="drawer-side">
          <label class="drawer-overlay" />
          <ul class="menu p-4 w-60 bg-base-100 text-base-content">
            <li>
              <A href="/" end={true}>
                <RiSystemDashboardLine /> Dashboard
              </A>
            </li>
            <li>
              <A href="/calendar">
                <RiBusinessCalendar2Line />
                Calendar
              </A>
            </li>
            <li>
              <A href="/timeline">
                <FaSolidTimeline fill="currentcolor" />
                Timeline
              </A>
            </li>
            <li>
              <A href="/investments">
                <RiBusinessLineChartLine />
                Investments
              </A>
            </li>
            <div class="bottom-0">
              <div class="divider" />
              <li>
                <A href="/settings">
                  <RiSystemSettings3Line /> Settings
                </A>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <style jsx global>{`
        /* Add global styles here */
        body {
          overflow: hidden;
        }
        .navbar-center {
          -webkit-app-region: drag;
          height: 32px;
        }
        #root > .mockup-window {
          overflow: hidden;
        }
        #root > .mockup-window:before {
          content: none;
        }
        #window-buttons {
          grid-template-columns: repeat(3, 1fr);
          position: absolute;
          -webkit-app-region: no-drag;
        }
      `}</style>
    </div>
  );
};

export default App;
