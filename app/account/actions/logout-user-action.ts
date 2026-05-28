"use server";

import { ActionResult } from "@/types/action-result";
import { removeAccessTokenCookie } from "../utils/cookie-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logoutUserAction(): Promise<ActionResult> {
  await removeAccessTokenCookie();
  revalidatePath("/", "layout");
  redirect("/");
}
