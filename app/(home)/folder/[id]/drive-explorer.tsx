"use client";

import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File as dbFile, Folder as dbFolder } from "@/types/supabase.types";
import { FileRow, FolderRow } from "./folder-file-row";
import { ChevronRight, FilePlus, Folder, FolderPlus, Plus } from "lucide-react";
import { createFolder, renameFile } from "@/server/db/db";
import { useRouter } from "next/navigation";
import { bytesToMB, formatFileSize } from "@/util/util";

import Link from "next/link";
import { uploadFileActionWithState } from "@/app/actions/uploadFileAction";
import { RenameDialog } from "@/components/renamedialog";
import { renameFolder, deleteFolder, deleteFile } from "@/server/db/db";
import { DeleteConfirmationDialog } from "@/components/confirmdeleteDialog";

export function DriveExplorer(props: {
  files: dbFile[];
  folders: dbFolder[];
  parentFolders: dbFolder[];
  currentFolderId: string;
  uploadFileAction: (FormData: FormData) => void;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<dbFolder | dbFile>();
  const [newFolderName, setNewFolderName] = useState("");
  const [folderItem, setFolderItem] = useState<dbFolder | undefined>();
  const [fileItem, setFileItem] = useState<dbFile | undefined>();
  const [newName, setNewName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("folder");
  const [deleteItemType, setDeleteItemType] = useState<"file" | "folder">(
    "folder"
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const MAX_FILE_SIZE_MB = 20;

  const [uploadState, uploadAction, isUploading] = useActionState(
    uploadFileActionWithState,
    { success: false, error: null }
  );

  useEffect(() => {
    if (uploadState.success) {
      setIsCreateDialogOpen(false);
      setFile(null);
    }
  }, [uploadState]);

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    try {
      setNewFolderName("");
      await createFolder(newFolderName, props.currentFolderId, user?.id);
      setIsCreateDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileSizeInMB = bytesToMB(file.size);
    console.log(fileSizeInMB);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      setError(`File is too large. Max allowed is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    setFile(file);
    setError("");
  };

  const cancelUpload = () => {
    setFile(null);
    setError("");
    setIsCreateDialogOpen(false);
  };

  const changeName = async (newName: string) => {
    if (folderItem?.parent_id) {
      await renameFolder(folderItem!.id, newName, user?.id);
      setNewName("");
      setRenameDialogOpen(false);
      setFolderItem(undefined);
    } else if (fileItem?.type) {
      await renameFile(fileItem!.id, newName, user?.id);
      setNewName("");
      setRenameDialogOpen(false);
      setFileItem(undefined);
    }
    router.refresh();
  };

  const handleFolderRename = async (folder: dbFolder) => {
    setNewName(folder.name);
    setRenameDialogOpen(true);
    setFolderItem(folder);
  };

  const handleFileRename = async (file: dbFile) => {
    setNewName(file.name);
    setRenameDialogOpen(true);
    setFileItem(file);
  };

  const handleFolderDelete = (folder: dbFolder) => {
    setDeletingItem(folder);
    setDeleteDialogOpen(true);
    setDeleteItemType("folder");
  };
  const handleFileDelete = (file: dbFile) => {
    setDeletingItem(file);
    setDeleteDialogOpen(true);
    setDeleteItemType("file");
  };

  const DeleteFileFolder = async () => {
    if (deleteItemType === "folder") {
      await deleteFolder(deletingItem!.id, user?.id);
    } else if (deleteItemType === "file") {
      await deleteFile(deletingItem!.id, user?.id);
    }
    router.refresh();
    setDeleteDialogOpen(false);
    setDeletingItem(undefined);
  };

  return (
    <div className="flex-1 space-y-6 p-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">My Drive</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {props.files.length + props.folders.length} items
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={newItemType === "folder" ? "default" : "outline"}
                  onClick={() => setNewItemType("folder")}
                  className="flex-1 gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Folder
                </Button>
                <Button
                  variant={newItemType === "file" ? "default" : "outline"}
                  onClick={() => setNewItemType("file")}
                  className="flex-1 gap-2"
                >
                  <FilePlus className="h-4 w-4" />
                  Upload File
                </Button>
              </div>

              {newItemType === "folder" ? (
                <>
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!newFolderName.trim()}
                    >
                      Create Folder
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <form action={uploadAction}>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        name="file"
                        disabled={isUploading}
                      />
                      <input
                        type="hidden"
                        name="folderId"
                        value={props.currentFolderId}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="p-3 bg-primary rounded-full">
                          <FilePlus className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {isUploading && "Uploading..."}
                            {file &&
                              !isUploading &&
                              "Press Submit to Start upload"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isUploading
                              ? "Please wait..."
                              : "Any file type supported up to 20MB"}
                            {file && (
                              <span className="block mt-2">
                                Selected file: {file.name} (
                                {formatFileSize(file.size)})
                              </span>
                            )}
                            {error && (
                              <span className="text-red-500 block mt-2">
                                {error}
                              </span>
                            )}
                          </p>
                        </div>
                      </label>

                      <div className="mt-4 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          type="submit"
                          disabled={!file || isUploading}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => cancelUpload()}
                          className="w-full"
                          type="button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <Link
          href={`/folder/ffffffff-ffff-ffff-ffff-ffffffffffff`}
          className="text-black-300 hover:text-blue-500"
        >
          Root
        </Link>
        {props.parentFolders.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="mx-2 text-black-500" size={16} />
            <Link
              href={`/folder/${folder.id}`}
              className="text-black-300 hover:text-blue-500"
            >
              {folder.name}
            </Link>
          </div>
        ))}
      </div>

      <Card>
        <div className="divide-y">
          {props.files.length === 0 && props.folders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No files or folders</h3>
              <p className="text-sm">
                Create your first folder or upload a file to get started
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 border-b bg-muted/30 font-medium text-sm text-muted-foreground">
                <div className="w-5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">Name</div>
                <div className="hidden sm:block w-24 text-right">Size</div>
                <div className="hidden md:block w-28 text-right">Modified</div>
                <div className="w-24 text-right">Actions</div>
              </div>
              {props.folders.map((folder) => (
                <FolderRow
                  key={folder.id}
                  folder={folder}
                  rename={handleFolderRename}
                  delete={handleFolderDelete}
                />
              ))}
              {props.files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  rename={handleFileRename}
                  delete={handleFileDelete}
                />
              ))}
            </>
          )}
        </div>
      </Card>
      <RenameDialog
        isOpen={renameDialogOpen}
        oldName={newName}
        onOpenChange={setRenameDialogOpen}
        onConfirm={(newName: string) => {
          changeName(newName);
        }}
      />
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deletingItem!}
        onConfirm={() => {
          DeleteFileFolder();
        }}
        type={deleteItemType}
      />
    </div>
  );
}
