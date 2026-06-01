"use server";

import { apiClient } from "@/lib/api-client";
import { User } from "../types/user";

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>("/auth/current-user", "Failed to fetch a user");
}
