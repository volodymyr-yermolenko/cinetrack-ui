import LoginForm from "../components/login-form";

interface LoginPageProps {
  searchParams: Promise<{ returnUrl?: string; isAuthError?: boolean }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnUrl, isAuthError } = await searchParams;

  return <LoginForm returnUrl={returnUrl} isAuthError={isAuthError} />;
}
