import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <TopHeader />
        {children}
      </div>
    </div>
  );
}

