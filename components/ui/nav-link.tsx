"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (pathname.startsWith(href) && href !== "/");

  const activeClasses = isActive ? "text-blue-600 font-[550]" : "text-gray-700";
  return (
    <Link
      href={href}
      className={`hover:text-blue-600 transition-colors ${activeClasses}`}
    >
      {children}
    </Link>
  );
}
