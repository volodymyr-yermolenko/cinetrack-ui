import { cookies } from "next/headers";
import CheckEmailInfo from "../components/check-email-info";
import { REGISTRATION_EMAIL_COOKIE } from "../constants";

export default async function CheckEmailPage() {
  const cookieStore = await cookies();
  const registrationEmail = cookieStore.get(REGISTRATION_EMAIL_COOKIE)?.value;

  return <CheckEmailInfo email={registrationEmail} />;
}
