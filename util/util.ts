export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
export function bytesToMB(bytes: number, decimals = 2): number {
  const mb = bytes / (1024 * 1024);
  return parseFloat(mb.toFixed(decimals));
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return " just now";
  if (minutes < 60) return ` ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return ` ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return ` ${days} day${days !== 1 ? "s" : ""} ago`;
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)} ${units[i]}`;
}
