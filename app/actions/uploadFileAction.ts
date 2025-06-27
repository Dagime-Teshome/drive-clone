/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { handleFileUpload } from "@/server/fileUpload/handleFileUpload";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
export async function uploadFileAction(formData: FormData) {
  const session = await auth();
  const userId = session.userId;
  const { folderData } = await handleFileUpload(formData, userId!);
  revalidatePath(`/folder/${folderData.folder_id}`);
}

export async function uploadFileActionWithState(
  prevState: any,
  formData: FormData
) {
  try {
    await uploadFileAction(formData);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    return { success: false, error: errorMessage };
  }
}
