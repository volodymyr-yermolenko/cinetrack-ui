"use server";

import { removeAccessTokenCookie } from "../utils/cookie-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logoutUserAction(
  redirectToMainPage: boolean = true,
): Promise<void> {
  await removeAccessTokenCookie();
  revalidatePath("/", "layout");
  if (redirectToMainPage) {
    redirect("/");
  }
}
