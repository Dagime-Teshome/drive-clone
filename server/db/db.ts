import { createClient } from "@/app/lib/supabase/client";
import type { File, Folder } from "@/types/supabase.types";

const supabase = createClient();

export async function getRoot() {
  const { data: folders, error } = await supabase
    .from("folders")
    .select("id")
    .eq("id", "ffffffff-ffff-ffff-ffff-ffffffffffff");
  if (error) throw new Error(`Error fetching root: ${error.message}`);
  return folders;
}

async function getAllChildFolderIds(
  id: string,
  collected: string[] = []
): Promise<string[]> {
  const { data: folders, error } = await supabase
    .from("folders")
    .select("id")
    .eq("parent_id", id);

  if (error) throw new Error(`Error fetching subfolders: ${error.message}`);

  for (const folder of folders ?? []) {
    collected.push(folder.id);
    await getAllChildFolderIds(folder.id, collected);
  }

  return collected;
}

async function getAllFilesInFolders(folderIds: string[], userId: string) {
  const { data, error } = await supabase
    .from("files")
    .select("id")
    .in("folder_id", folderIds)
    .eq("user_id", userId);

  if (error) throw new Error(`Error fetching files: ${error.message}`);

  return data?.map((file) => file.id) ?? [];
}

async function deleteFiles(fileIds: string[], userId: string) {
  if (fileIds.length === 0) return;

  const { error } = await supabase
    .from("files")
    .delete()
    .in("id", fileIds)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete files: ${error.message}`);
}

export async function deleteFile(fileId: string, userId?: string) {
  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId)
    .eq("user_id", userId!);
  if (error) throw new Error(`Failed to delete file: ${error.message}`);
}

async function deleteFolders(folderIds: string[], userId: string) {
  const { error } = await supabase
    .from("folders")
    .delete()
    .in("id", folderIds)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete folders: ${error.message}`);
}
const fetchParentFolders = async (
  currentFolderId: string,
  collectedParents: Folder[] = [],
  userId?: string | null
): Promise<Folder[]> => {
  const { data: folder, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", currentFolderId)
    .eq("user_id", userId!)
    .single();

  if (error || !folder) return collectedParents;

  collectedParents.push(folder);
  if (folder.parent_id) {
    return fetchParentFolders(folder.parent_id, collectedParents, userId);
  }

  return collectedParents;
};

export const getFilesAndFolders = async (folderId: string, userId: string) => {
  const [filesRes, foldersRes] = await Promise.all([
    supabase
      .from("files")
      .select("*")
      .eq("user_id", userId!)
      .eq("folder_id", folderId),
    supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId!)
      .eq("parent_id", folderId),
  ]);

  if (filesRes.error) throw new Error(filesRes.error.message);
  if (foldersRes.error) throw new Error(foldersRes.error.message);

  const files: File[] = filesRes.data;
  const folders: Folder[] = foldersRes.data;

  const parentFolders: Folder[] = await fetchParentFolders(
    folderId,
    [],
    userId
  );

  return {
    files,
    folders,
    parentFolders,
  };
};

export const createFolder = async (
  name: string,
  parentId: string,
  userId?: string | null
): Promise<Folder> => {
  const { data, error } = await supabase
    .from("folders")
    .insert([
      {
        name: name,
        parent_id: parentId,
        user_id: userId!,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export async function deleteFolder(folderId: string, userId?: string) {
  const allFolderIds = await getAllChildFolderIds(folderId);
  allFolderIds.push(folderId);

  const fileIds = await getAllFilesInFolders(allFolderIds, userId!);

  await deleteFiles(fileIds, userId!);
  await deleteFolders(allFolderIds, userId!);
}
export const renameFolder = async (
  folderId: string,
  newName: string,
  userId?: string | null
): Promise<Folder> => {
  const { data, error } = await supabase
    .from("folders")
    .update({ name: newName })
    .eq("id", folderId)
    .eq("user_id", userId!)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const createFile = async (file: {
  name: string;
  folder_id: string;
  user_id: string;
  size: number;
  type: string;
  url: string;
}): Promise<File> => {
  const { data, error } = await supabase
    .from("files")
    .insert([file])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const renameFile = async (
  fileId: string,
  newName: string,
  userId?: string | null
): Promise<File> => {
  const { data, error } = await supabase
    .from("files")
    .update({ name: newName })
    .eq("id", fileId)
    .eq("user_id", userId!)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export async function getRecentlyCreatedFiles(userId: string, limit = 4) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error)
    throw new Error(`Failed to fetch recently created files: ${error.message}`);

  return data ?? [];
}

export async function getDriveStats(userId: string) {
  const { data: filesData, error: filesError } = await supabase
    .from("files")
    .select("id, size", { count: "exact" })
    .eq("user_id", userId);

  if (filesError)
    throw new Error(`Failed to fetch files stats: ${filesError.message}`);

  const { count: foldersCount, error: foldersError } = await supabase
    .from("folders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (foldersError)
    throw new Error(`Failed to fetch folders stats: ${foldersError.message}`);

  const totalFileSizeBytes =
    filesData?.reduce((sum, file) => sum + (file.size || 0), 0) ?? 0;

  return {
    totalFiles: filesData?.length ?? 0,
    totalFolders: foldersCount ?? 0,
    totalStorageBytes: totalFileSizeBytes,
  };
}
