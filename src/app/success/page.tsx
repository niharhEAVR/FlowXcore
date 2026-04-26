"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const refresh = async () => {
      await new Promise((res) => setTimeout(res, 1500));

      try {
        const result = await authClient.customer.state();
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      } catch (err) {
        console.error(err);
      }
    };

    refresh();
  }, [queryClient]);

  return (
    <>
      <h1>Payment Successful 🎉</h1>
      <Button onClick={() => router.push("/workflows")}>
        Go to Dashboard
      </Button>
    </>
  );
}