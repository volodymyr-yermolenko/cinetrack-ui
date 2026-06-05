"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Dashboard } from "./dashboard/components/dashboard";
import { useRouter } from "next/navigation";

interface HomeContentProps {
  registrationConfirmed?: boolean;
}

export function HomeContent({ registrationConfirmed }: HomeContentProps) {
  const router = useRouter();

  useEffect(() => {
    if (registrationConfirmed) {
      router.replace("/");
      requestAnimationFrame(() => {
        toast.success(
          "Your email has been confirmed! Welcome to Cine Track Application.",
          { duration: 5000 },
        );
      });
    }
  }, [registrationConfirmed]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}
