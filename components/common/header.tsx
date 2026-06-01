"use client";

import NavLink from "../ui/nav-link";
import Link from "next/link";
import { Film } from "lucide-react";
import { LOGIN_URL, REGISTER_URL } from "@/constants";
import { logoutUserAction } from "@/app/account/actions/logout-user-action";
import { User } from "@/app/account/types/user";
import { DropDownButton } from "../ui/drop-down-button";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const isAuthenticated = !!user;

  const handleLogoutClick = async () => {
    await logoutUserAction();
  };

  const linkItems = isAuthenticated
    ? [
        { label: "Home", href: "/" },
        { label: "Movies", href: "/movies" },
        { label: "Watches", href: "/watch-entries" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Log in", href: LOGIN_URL },
        { label: "Sign up", href: REGISTER_URL },
      ];

  return (
    <div className="py-4 flex justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Film className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-semibold">CineTrack</span>
      </Link>

      <nav className="flex items-center">
        <ul className="flex space-x-6 items-center">
          {linkItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <DropDownButton
              name={user.name}
              options={[
                {
                  label: "Sign out",
                  type: "button",
                  onClick: handleLogoutClick,
                },
              ]}
            />
          )}
        </ul>
      </nav>
    </div>
  );
}
