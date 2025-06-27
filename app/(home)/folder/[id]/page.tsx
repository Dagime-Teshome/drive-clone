import { DriveExplorer } from "./drive-explorer";
import { getFilesAndFolders } from "@/server/db/db";
import { auth } from "@clerk/nextjs/server";
import { uploadFileAction } from "@/app/actions/uploadFileAction";

export default async function GoogleDriveClone(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session.userId;
  const params = await props.params;
  const { id } = params;

  const { files, folders, parentFolders } = await getFilesAndFolders(
    id,
    userId!
  );
  const reversedParentFolders = parentFolders.reverse();
  return (
    <div>
      <DriveExplorer
        files={files}
        folders={folders}
        parentFolders={reversedParentFolders}
        currentFolderId={id}
        uploadFileAction={uploadFileAction}
      />
    </div>
  );
}
