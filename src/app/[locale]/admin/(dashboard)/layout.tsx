import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient>
      <div className="p-4 md:p-6">{children}</div>
    </AdminLayoutClient>
  );
}
