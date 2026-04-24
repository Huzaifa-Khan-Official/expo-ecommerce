import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { UserRound } from 'lucide-react';

function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-base-100/60 backdrop-blur-md p-6 rounded-2xl border border-base-200/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">Customers</h1>
          <p className="text-base-content/70 mt-1 font-medium">
            {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
          </p>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="card bg-base-100/60 backdrop-blur-md shadow-lg border border-base-200/50 overflow-hidden">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 text-base-content/60">
              <div className="bg-base-200/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👥</span>
              </div>
              <p className="text-xl font-bold mb-2">No customers yet</p>
              <p className="text-sm font-medium opacity-80">Customers will appear here once they sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra-zebra w-full">
                <thead className="bg-base-200/40 text-base-content/80 text-sm">
                  <tr>
                    <th className="font-semibold py-4 pl-6 rounded-tl-lg">Customer</th>
                    <th className="font-semibold py-4">Email</th>
                    <th className="font-semibold py-4">Addresses</th>
                    <th className="font-semibold py-4">Wishlist</th>
                    <th className="font-semibold py-4 pr-6">Joined Date</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-base-200/50 transition-colors group">
                      <td className="flex items-center gap-4 pl-6 py-4">
                        <div className="avatar placeholder">
                          <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-12 shadow-md group-hover:scale-105 transition-transform">
                            {
                              customer.imageUrl ? (
                                <img
                                  src={customer.imageUrl}
                                  alt={customer.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <UserRound className="w-full h-full pt-2" />
                              )
                            }
                          </div>
                        </div>
                        <div className="font-bold text-base-content/90 group-hover:text-primary transition-colors">{customer.name}</div>
                      </td>

                      <td className="font-medium text-base-content/80">{customer.email}</td>

                      <td>
                        <div className="badge badge-sm font-semibold px-3 py-3 shadow-sm bg-base-200/80 border-transparent">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>

                      <td>
                        <div className="badge badge-sm font-semibold px-3 py-3 shadow-sm bg-base-200/80 border-transparent">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>

                      <td className="pr-6">
                        <span className="text-sm font-medium text-base-content/60">{formatDate(customer.createdAt)}</span>
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
export default CustomersPage;
