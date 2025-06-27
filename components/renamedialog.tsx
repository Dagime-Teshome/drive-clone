"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RenameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newName: string) => void;
  oldName?: string;
}

export function RenameDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  oldName,
}: RenameDialogProps) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (oldName) {
      setNewName(oldName);
    }
  }, [oldName]);

  const handleConfirm = () => {
    if (!newName.trim()) return;
    onConfirm(newName.trim());
    onOpenChange(false);
    setNewName("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setNewName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={"file name"}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!newName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
