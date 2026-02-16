import Link from "next/link";

export default function Header() {
  return (
    <div className="py-4 flex justify-between">
      <div>Test</div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/movies">Movies</Link>
          </li>
          <li>
            <Link href="/watches">Watches</Link>
          </li>
          <li>
            <Link href="/signin">Sign in</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
