import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRoot } from "../../../server/db/db";

export default async function DrivePage() {
  const session = await auth();
  const [root] = await getRoot();

  console.log(root);
  if (!session.userId) {
    return redirect("/sign-in");
  }

  return redirect(`/folder/${root.id}`);
}
