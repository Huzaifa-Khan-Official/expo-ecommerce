import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const { isInWishlist, toggleWishlist, isAddingToWishlist, addingToWishlistId, isRemovingFromWishlist, removingFromWishlistId } =
    useWishlist();

  const { isAddingToCart, addingToCartId, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
        },
      }
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const isWishlistLoading = (isAddingToWishlist && addingToWishlistId === product._id) || (isRemovingFromWishlist && removingFromWishlistId === product._id);
    const isCartLoading = isAddingToCart && addingToCartId === product._id;

    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-4 border border-background-light shadow-sm"
        style={{ width: "48%" }}
        activeOpacity={0.8}
        onPress={() => router.push(`/product/${product._id}`)}
      >
        <View className="relative">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-48 bg-background-light"
            resizeMode="cover"
          />

          <TouchableOpacity
            className="absolute top-3 right-3 bg-white/50 backdrop-blur-md p-2 rounded-full shadow-sm"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={isWishlistLoading}
          >
            {isWishlistLoading ? (
              <ActivityIndicator size="small" color="#5c7f67" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={22}
                color={isInWishlist(product._id) ? "#d40b00ff" : "#4B5563"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <Text className="text-primary font-semibold text-xs mb-1 uppercase tracking-wider">{product.category}</Text>
          <Text className="text-text-primary font-bold text-sm mb-2" numberOfLines={2}>
            {product.name}
          </Text>

          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="text-text-primary text-xs font-bold ml-1">
              {product.averageRating.toFixed(1)}
            </Text>
            <Text className="text-text-tertiary text-xs ml-1">({product.totalReviews})</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-text-primary font-extrabold text-lg">Rs.{product.price.toFixed(2)}</Text>

            <TouchableOpacity
              className="bg-primary rounded-full w-9 h-9 items-center justify-center shadow-sm"
              activeOpacity={0.7}
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isCartLoading}
            >
              {isCartLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="add" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="bg-surface rounded-3xl overflow-hidden mb-4 border border-background-light" style={{ width: "48%" }}>
            <View className="w-full h-48 bg-background-light animate-pulse" />
            <View className="p-4">
              <View className="h-3 w-1/3 bg-background-light rounded-full mb-2 animate-pulse" />
              <View className="h-4 w-full bg-background-light rounded-full mb-1 animate-pulse" />
              <View className="h-4 w-2/3 bg-background-light rounded-full mb-4 animate-pulse" />
              <View className="flex-row items-center justify-between mt-2">
                <View className="h-5 w-1/3 bg-background-light rounded-full animate-pulse" />
                <View className="h-9 w-9 bg-background-light rounded-full animate-pulse" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-text-primary font-semibold mt-4">Failed to load products</Text>
        <Text className="text-text-secondary text-sm mt-2">Please try again later</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
    />
  );
};

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="text-text-primary font-semibold mt-4">No products found</Text>
      <Text className="text-text-secondary text-sm mt-2">Try adjusting your filters</Text>
    </View>
  );
}
