import { cookies } from "next/headers";
import { EmailConfirmationErrorReason } from "../../types/email-confirmation-error-reason";
import { REGISTRATION_EMAIL_COOKIE } from "../../constants";
import ResendEmailConfirmation from "../../components/resend-email-confirmation";

interface ConfirmEmailErrorPageProps {
  searchParams: Promise<{ reason?: EmailConfirmationErrorReason }>;
}

export default async function ConfirmEmailErrorPage({
  searchParams,
}: ConfirmEmailErrorPageProps) {
  const { reason } = await searchParams;
  const cookieStore = await cookies();
  const registrationEmail = cookieStore.get(REGISTRATION_EMAIL_COOKIE)?.value;

  let content;

  switch (reason) {
    case EmailConfirmationErrorReason.InvalidToken:
      content =
        "This confirmation link is invalid. You might have already confirmed your email address or the token is incorrect.";
      break;
    case EmailConfirmationErrorReason.TokenExpired:
      content = (
        <div>
          <p className="text-gray-700 mt-4">
            Confirmation token has expired. This can happen if you received the
            confirmation email a while ago and didn’t click the link in time.
            You can request a new confirmation email to be sent to your email
            address <strong>{registrationEmail}</strong>.
          </p>
          <div className="mt-6">
            <ResendEmailConfirmation
              email={registrationEmail!}
              showTitleMessage={false}
            />
          </div>
        </div>
      );
      break;
    default:
      content = "This confirmation link is invalid or incomplete.";
  }

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Email Confirmation Error</h1>
          {content}
        </div>
      </div>
    </div>
  );
}
