import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/sidebar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
