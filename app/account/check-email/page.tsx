import { cookies } from "next/headers";
import { REGISTRATION_EMAIL_COOKIE } from "../constants";
import ResendEmailConfirmation from "../components/resend-email-confirmation";

export default async function CheckEmailPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get(REGISTRATION_EMAIL_COOKIE)?.value;

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p>
            We have sent a confirmation email to your email address
            {email && (
              <>
                {" "}
                <strong>{email}</strong>
              </>
            )}
            . Please check your inbox and click on the confirmation link to
            complete your registration.
          </p>
          {email && (
            <div>
              <p className="mt-4">
                If you haven’t received the email, please check your spam folder
                or click the button below to resend the confirmation email.
              </p>
              <div className="mt-6">
                <ResendEmailConfirmation
                  email={email}
                  showTitleMessage={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
