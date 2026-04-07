import Link from "next/link";
import { Search, LogOut } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="w-full max-w-md relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search videos, automations..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-md focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                 {session.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <Link href="/api/auth/signout" className="text-sm font-medium text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}