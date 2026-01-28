"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { SidebarToggle } from "@/components/layout/sidebar";
import type { User } from "@/lib/types";

interface HeaderProps {
  user: User;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ user, sidebarOpen, onSidebarToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarToggle isOpen={sidebarOpen} onToggle={onSidebarToggle} />
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">
            Barangay Health Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {user.role}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
