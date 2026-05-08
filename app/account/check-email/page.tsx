import CheckEmailInfo from "../components/check-email-info";

interface CheckEmailPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const params = await searchParams;
  const email = params.email;

  return <CheckEmailInfo email={email} />;
}
