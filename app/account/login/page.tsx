import LoginForm from "../components/login";

interface LoginFormProps {
  params: Promise<{ returnUrl?: string }>;
}

export default async function LoginPage({ params }: LoginFormProps) {
  const { returnUrl } = await params;

  return <LoginForm returnUrl={returnUrl} />;
}
