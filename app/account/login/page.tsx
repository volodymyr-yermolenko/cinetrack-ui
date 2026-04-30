import LoginForm from "../components/login";

interface LoginPageProps {
  params: Promise<{ returnUrl?: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { returnUrl } = await params;

  return <LoginForm returnUrl={returnUrl} />;
}
