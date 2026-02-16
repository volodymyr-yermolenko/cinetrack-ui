import NavLink from "./nav-link";
import Link from "next/link";
import { Film } from "lucide-react";

export default function Header() {
  return (
    <div className="py-4 flex justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Film className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-medium">CineTrack</span>
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
            <NavLink href="/watches">Watches</NavLink>
          </li>
          <li>
            <NavLink href="/signin">Sign in</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
