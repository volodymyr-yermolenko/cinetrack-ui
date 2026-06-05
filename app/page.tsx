import { REGISTRATION_CONFIRMED_PARAM } from "@/constants";
import { HomeContent } from "./home-content";

interface HomePageProps {
  searchParams: Promise<{
    [REGISTRATION_CONFIRMED_PARAM]?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const registrationConfirmed = params[REGISTRATION_CONFIRMED_PARAM] === "true";

  return <HomeContent registrationConfirmed={registrationConfirmed} />;
}
