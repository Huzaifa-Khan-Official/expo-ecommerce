import { orderApi } from "../lib/api";
import { formatDate } from "../lib/utils";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const orders = ordersData?.orders || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-base-100/60 backdrop-blur-md p-6 rounded-2xl border border-base-200/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">Orders</h1>
          <p className="text-base-content/70 mt-1 font-medium">Manage customer orders</p>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="card bg-base-100/60 backdrop-blur-md shadow-lg border border-base-200/50 overflow-hidden">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-base-content/60">
              <div className="bg-base-200/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-xl font-bold mb-2">No orders yet</p>
              <p className="text-sm font-medium opacity-80">Orders will appear here once customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra-zebra w-full">
                <thead className="bg-base-200/40 text-base-content/80 text-sm">
                  <tr>
                    <th className="font-semibold py-4 pl-6 rounded-tl-lg">Order ID</th>
                    <th className="font-semibold py-4">Customer</th>
                    <th className="font-semibold py-4">Items</th>
                    <th className="font-semibold py-4">Total</th>
                    <th className="font-semibold py-4">Status</th>
                    <th className="font-semibold py-4 pr-6">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    return (
                      <tr key={order._id} className="hover:bg-base-200/50 transition-colors group">
                        <td className="pl-6">
                          <span className="font-bold text-primary/80 group-hover:text-primary transition-colors">#{order._id.slice(-8).toUpperCase()}</span>
                        </td>

                        <td>
                          <div className="font-bold text-base-content/90">{order.shippingAddress.fullName}</div>
                          <div className="text-xs font-medium text-base-content/50 mt-0.5">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </td>

                        <td>
                          <div className="font-bold text-base-content/90">{totalQuantity} items</div>
                          <div className="text-xs font-medium text-base-content/50 mt-0.5">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 && <span className="text-primary ml-1">+{order.orderItems.length - 1} more</span>}
                          </div>
                        </td>

                        <td>
                          <span className="font-extrabold text-base-content/90">Rs.{order.totalPrice.toFixed(2)}</span>
                        </td>

                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="select select-sm bg-base-200/50 hover:bg-base-200 focus:select-primary border-transparent hover:border-base-300 font-semibold transition-colors"
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        <td className="pr-6">
                          <span className="text-sm font-medium text-base-content/60">{formatDate(order.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default OrdersPage;
