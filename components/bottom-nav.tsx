"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, ClipboardList, History } from "lucide-react";

const tabs = [
  { href: "/", label: "Today", Icon: Pill },
  { href: "/medicines", label: "Medicines", Icon: ClipboardList },
  { href: "/history", label: "History", Icon: History },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 shadow-lg">
      <div className="flex max-w-md mx-auto">
        {tabs.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-pink-400"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-transform"
                style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
