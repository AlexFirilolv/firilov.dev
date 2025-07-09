'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `text-white/80 hover:text-white transition-colors duration-300 ${
      pathname === path ? 'font-bold text-white' : ''
    }`;

  return (
    <nav className="w-full max-w-5xl mx-auto p-4 mb-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg">
      <div className="flex justify-center items-center space-x-8">
        <Link href="/" className={linkClasses('/')}>
          Calendar
        </Link>
        <Link href="/admin" className={linkClasses('/admin')}>
          Admin
        </Link>
      </div>
    </nav>
  );
}
