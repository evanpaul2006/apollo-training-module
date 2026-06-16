"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { ApolloLogo } from "@/components/shared/ApolloLogo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-apollo-dark text-white">
      <div className="p-6">
        <div className="bg-white/10 p-3 rounded-xl inline-block mb-8">
          <ApolloLogo variant="white" />
        </div>
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white font-medium border-l-4 border-apollo-light pl-3"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-apollo-light" : ""} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-auto p-6">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all w-full text-left"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-apollo-dark text-white">
        <ApolloLogo variant="white" className="scale-75 origin-left" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-white/10 text-white">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-0 w-64 bg-apollo-dark">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[260px] flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
