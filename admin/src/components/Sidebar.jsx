import { useUser } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible z-50">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay backdrop-blur-sm bg-base-300/30"></label>

      <div className="flex min-h-full flex-col items-start bg-base-100/95 backdrop-blur-xl border-r border-base-200/50 shadow-lg is-drawer-close:w-16 is-drawer-open:w-64 transition-all duration-300">
        <div className="p-4 w-full border-b border-base-200/50 mb-2">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <ShoppingBagIcon className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-xl font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent is-drawer-close:hidden">Admin</span>
          </div>
        </div>

        <ul className="menu w-full grow flex flex-col gap-2 px-3">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`is-drawer-close:tooltip is-drawer-close:tooltip-right py-3 transition-all duration-300 rounded-xl
                    ${isActive 
                      ? "bg-linear-to-r from-primary/15 to-primary/10 text-primary font-semibold shadow-sm border border-primary/20" 
                      : "hover:bg-primary/10 hover:to-primary/5 text-base-content/80 hover:text-base-content"
                    }
                  `}
                >
                  <span className={`${isActive ? "text-primary" : "opacity-70"}`}>{item.icon}</span>
                  <span className="is-drawer-close:hidden">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-4 w-full border-t border-base-200/50 mt-auto bg-base-100/50">
          <div className="flex items-center gap-3 hover:bg-base-200/50 p-2 rounded-xl transition-colors cursor-pointer">
            <div className="avatar shrink-0 ring ring-primary/20 ring-offset-base-100 ring-offset-2 rounded-full">
              <img src={user?.imageUrl} alt={user?.name} className="w-10 h-10 rounded-full" />
            </div>

            <div className="flex-1 min-w-0 is-drawer-close:hidden">
              <p className="text-sm font-bold truncate text-base-content/90">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs opacity-70 truncate font-medium">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
