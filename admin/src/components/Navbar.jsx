import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";

import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

// eslint-disable-next-line
export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
  { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
  { name: "Orders", path: "/orders", icon: <ClipboardListIcon className="size-5" /> },
  { name: "Customers", path: "/customers", icon: <UsersIcon className="size-5" /> },
];

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar w-full sticky top-0 z-50 backdrop-blur-xl bg-base-100/80 border-b border-base-200/50 shadow-sm transition-all duration-300">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost hover:bg-base-200/50" aria-label="open sidebar">
        <PanelLeftIcon className="size-5 text-base-content/80" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-2xl font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
          {NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard"}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
