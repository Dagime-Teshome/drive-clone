import Link from "next/link";
import { File as dbFile, Folder as dbFolder } from "@/types/supabase.types";
import { Folder, File, Edit2, Trash2 } from "lucide-react";
import { formatFileSize, formatRelativeTime } from "@/util/util";
import { Button } from "@/components/ui/button";

export function FolderRow(props: {
  folder: dbFolder;
  rename: (folder: dbFolder) => void;
  delete: (folder: dbFolder) => void;
}) {
  const { folder } = props;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        <Folder className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate cursor-pointer hover:underline">
          <Link
            href={`/folder/${folder.id}`}
            className="flex items-center text-black  hover:text-blue-400"
          >
            {folder.name}
          </Link>
        </p>
      </div>

      <div className="hidden sm:block text-sm text-muted-foreground w-24 text-right">
        {"—"}
      </div>

      <div className="hidden md:block text-sm text-muted-foreground w-28 text-right">
        {folder.created_at ? formatRelativeTime(folder.created_at) : "—"}
      </div>

      <div className="flex items-center gap-1 w-24 justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => props.rename(folder)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => props.delete(folder)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function FileRow(props: {
  file: dbFile;
  rename: (file: dbFile) => void;
  delete: (file: dbFile) => void;
}) {
  const { file } = props;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        <File className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate cursor-pointer hover:underline">
          <Link
            href={file.url!}
            className="flex items-center text-black hover:text-blue-400"
            target="_blank"
          >
            {file.name}
          </Link>
        </p>
      </div>

      <div className="hidden sm:block text-sm text-muted-foreground w-24 text-right">
        {formatFileSize(file.size!) || "—"}
      </div>

      <div className="hidden md:block text-sm text-muted-foreground w-28 text-right">
        {formatRelativeTime(file.created_at!)}
      </div>

      <div className="flex items-center gap-1 w-24 justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            props.rename(file);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => props.delete(file)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
