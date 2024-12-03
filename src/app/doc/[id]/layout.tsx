import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RoomProvider from "@/components/RoomProvider";

const DocLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  // Authenticate the user
  const { userId } = await auth();

  // If no user is authenticated, redirect to login
  if (!userId) {
    redirect("/sign-in");
  }

  // Use the id from params
  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;