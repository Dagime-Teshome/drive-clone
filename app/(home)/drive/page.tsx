import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { MUTATIONS, QUERIES } from "@/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  //   const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  //   if (!rootFolder) {
  //     return (
  //       <form
  //         action={async () => {
  //           "use server";
  //           const session = await auth();

  //           if (!session.userId) {
  //             return redirect("/sign-in");
  //           }

  //           const rootFolderId = await MUTATIONS.onboardUser(session.userId);

  //           return redirect(`/f/${rootFolderId}`);
  //         }}
  //       >
  //         <Button>Create new Drive</Button>
  //       </form>
  //     );
  //   }

  //   return redirect(`/f/${rootFolder.id}`);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to your Drive</h1>
      <p className="mt-4 text-neutral-500">
        This is where you can manage your files and folders.
      </p>
    </div>
  );
}
