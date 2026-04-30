import NavLink from "../ui/nav-link";
import Link from "next/link";
import { Film } from "lucide-react";
import { LOGIN_URL } from "@/constants/authentication";

export default function Header() {
  return (
    <div className="py-4 flex justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Film className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-semibold">CineTrack</span>
      </Link>

      <nav className="flex items-center">
        <ul className="flex space-x-6">
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/movies">Movies</NavLink>
          </li>
          <li>
            <NavLink href="/watch-entries">Watches</NavLink>
          </li>
          <li>
            <NavLink href={LOGIN_URL}>Sign in</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
