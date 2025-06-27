"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FolderPlus, FilePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateItemDialogProps {
  onCreateFolder: (name: string) => void;
  onUploadFile: (file: File) => void;
}

export function CreateItemDialog({
  onCreateFolder,
  onUploadFile,
}: CreateItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("folder");
  const [isUploading, setIsUploading] = useState(false);

  const handleCreate = () => {
    if (!newItemName.trim()) return;
    onCreateFolder(newItemName);
    setNewItemName("");
    setIsOpen(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onUploadFile(file);
    setIsUploading(false);
    setIsOpen(false);

    // Reset file input
    event.target.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!newItemName.trim()}>
                  Create Folder
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
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
                      {isUploading ? "Uploading..." : "Click to upload file"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isUploading
                        ? "Please wait..."
                        : "Any file type supported"}
                    </p>
                  </div>
                </label>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
