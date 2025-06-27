import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Folder, HardDrive } from "lucide-react";
import { getDriveStats, getRecentlyCreatedFiles } from "@/server/db/db";
import { File } from "../../../types/supabase.types";
import { auth } from "@clerk/nextjs/server";
import { formatBytes, formatRelativeTime } from "../../../util/util";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const stats = await getDriveStats(userId!);
  const recentFiles = await getRecentlyCreatedFiles(userId!, 4);

  const storageUsedGB = formatBytes(stats.totalStorageBytes);
  console.log("Storage used in GB:", stats);
  const storageTotalGB = 5;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your drive activity and storage
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsedGB}</div>
            <p className="text-xs text-muted-foreground">
              of {storageTotalGB} GB
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>Files you accessed recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFiles.map((file: File) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Link
                      href={file.url!}
                      className="flex items-center text-black hover:text-blue-400"
                      target="_blank"
                    >
                      {file.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{file.type}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatRelativeTime(file.created_at!)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
