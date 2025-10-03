import { Sidebar } from "@/components/sidebar";
import { FullScreenMap } from "@/components/full-screen-map";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <FullScreenMap />
      </div>
    </div>
  );
}

