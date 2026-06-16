"use client";

import { ApolloLogo } from "@/components/shared/ApolloLogo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/learn" className="hover:opacity-80 transition-opacity">
          <ApolloLogo />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200">
            Learner
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-text-secondary hover:text-text-primary">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
