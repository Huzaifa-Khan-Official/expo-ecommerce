import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { capitalizeText, formatDate, getOrderStatusBadge } from "../lib/utils";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  // it would be better to send the last 5 items from the api, instead of slicing it here
  // but we're just keeping it simple here...
  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      name: "Total Revenue",
      value: statsLoading ? "..." : `Rs.${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-8" />,
    },
    {
      name: "Total Orders",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-8" />,
    },
    {
      name: "Total Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UsersIcon className="size-8" />,
    },
    {
      name: "Total Products",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-8" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div 
            key={stat.name} 
            className="card bg-base-100/60 backdrop-blur-md shadow-sm border border-base-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="card-body p-6 flex-row items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300 shadow-inner">
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-base-content/70">{stat.name}</div>
                <div className="text-3xl font-bold mt-1 text-base-content">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="card bg-base-100/60 backdrop-blur-md shadow-lg border border-base-200/50 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-200/50 flex justify-between items-center bg-base-100/40">
            <h2 className="text-xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              Recent Orders
            </h2>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <div className="bg-base-200/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="w-10 h-10 opacity-40" />
              </div>
              <p className="font-medium text-lg">No orders yet</p>
              <p className="text-sm opacity-70">When customers place orders, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra-zebra">
                <thead className="bg-base-200/30 text-base-content/80">
                  <tr>
                    <th className="font-semibold rounded-tl-lg">Order ID</th>
                    <th className="font-semibold">Customer</th>
                    <th className="font-semibold">Items</th>
                    <th className="font-semibold">Amount</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-base-200/50 transition-colors group cursor-default">
                      <td>
                        <span className="font-bold text-primary/80 group-hover:text-primary transition-colors">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div className="font-bold text-base-content/90">{order.shippingAddress.fullName}</div>
                          <div className="text-xs font-medium text-base-content/50 mt-0.5">
                            {order.orderItems.length} item(s)
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-sm font-medium">
                          {order.orderItems[0]?.name}
                          {order.orderItems.length > 1 && (
                            <span className="text-primary ml-1 font-semibold text-xs">
                              +{order.orderItems.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="font-bold">Rs.{order.totalPrice.toFixed(2)}</span>
                      </td>

                      <td>
                        <div className={`badge badge-sm font-semibold px-3 py-3 shadow-sm ${getOrderStatusBadge(order.status)}`}>
                          {capitalizeText(order.status)}
                        </div>
                      </td>

                      <td>
                        <span className="text-sm font-medium text-base-content/60">{formatDate(order.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
