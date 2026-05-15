import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const result = await authClient.customer.state();
      if (!result.data || "error" in result.data) {
        throw new Error("Failed to fetch customer state");
      }
      return result.data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } =
    useSubscription();

  const hasActiveSubscription =
    !!customerState?.activeSubscriptions?.length;

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
