import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("📱 [useProducts] Fetching from:", api.defaults.baseURL + "/products");
      try {
        const { data } = await api.get<Product[]>("/products");
        console.log("✅ [useProducts] Success! Got", data?.length, "products");
        console.log("📦 First product:", data?.[0]);
        return data;
      } catch (error: any) {
        console.error("❌ [useProducts] Error:", error?.message);
        console.error("📍 Error response:", error?.response?.data);
        console.error("📍 Error status:", error?.response?.status);
        throw error;
      }
    },
  });

  console.log("📊 [useProducts] Query state:", { isLoading: result.isLoading, isError: result.isError, dataLength: result.data?.length });

  return result;
};

export default useProducts;
