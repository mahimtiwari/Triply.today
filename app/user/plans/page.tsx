import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PlansPage from "@/app/components/planslist";

export default async function PlansPageSSR() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/user/signup");
  }

  return <PlansPage />;
}
