import { cookies } from "next/headers";
import { EmailConfirmationError } from "../../components/email-confirmation-error";
import { EmailConfirmationErrorReason } from "../../types/email-confirmation-error-reason";
import { REGISTRATION_EMAIL_COOKIE } from "../../constants";

interface ConfirmEmailPageProps {
  searchParams: Promise<{ reason: EmailConfirmationErrorReason }>;
}

export default async function ConfirmEmailPage({
  searchParams,
}: ConfirmEmailPageProps) {
  const { reason } = await searchParams;
  const cookieStore = await cookies();
  const registrationEmail = cookieStore.get(REGISTRATION_EMAIL_COOKIE)?.value;

  return (
    <EmailConfirmationError
      reason={reason}
      registrationEmail={registrationEmail}
    />
  );
}
