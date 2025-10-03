"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  Droplets,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts/auth-context";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  href: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems: NavItem[] = [
    { icon: <Droplets className="h-5 w-5" />, label: "Map", href: "/" },
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Overview", href: "/overview" },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule", href: "/schedule" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", href: "/analytics" },
  ];

  const generalItems: NavItem[] = [
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Help", href: "/help" },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">IRRISmart</h1>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-3">MENU</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <Badge 
                    className={`ml-auto text-xs ${
                      pathname === item.href 
                        ? "bg-white text-primary" 
                        : "bg-primary text-white"
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-3">GENERAL</p>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              {user.farmName && (
                <p className="text-xs text-gray-500 truncate">{user.farmName}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

