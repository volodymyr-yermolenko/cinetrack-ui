"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface DashboardProps {
  registrationConfirmed?: boolean;
}

export function Dashboard({ registrationConfirmed }: DashboardProps) {
  useEffect(() => {
    if (registrationConfirmed) {
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
      <h1 className="text-4xl font-bold">Welcome to Cine Track App</h1>
    </div>
  );
}
