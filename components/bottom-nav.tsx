"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, ClipboardList, History, Sparkles } from "lucide-react";

const tabs = [
  { href: "/", label: "Today", Icon: Pill },
  { href: "/medicines", label: "Meds", Icon: ClipboardList },
  { href: "/history", label: "History", Icon: History },
  { href: "/fun", label: "Fun", Icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-purple-100">
      <div className="flex max-w-md mx-auto py-1">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isFun = href === "/fun";
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2"
            >
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                  isActive
                    ? isFun
                      ? "bg-pink-100 text-[#FF7EB6]"
                      : "bg-purple-100 text-[#7C5CFF]"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span
                  className={`text-xs font-semibold transition-all font-display ${
                    isActive
                      ? isFun
                        ? "text-[#FF7EB6]"
                        : "text-[#7C5CFF]"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
