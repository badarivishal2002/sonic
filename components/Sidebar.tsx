/**
 * Sidebar Component
 * Persistent navigation sidebar for the application
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/notes', label: '📝 Notes', icon: '📝' },
    { href: '/create', label: '➕ Create Note', icon: '➕' },
    { href: '/chat', label: '💬 Chat', icon: '💬' },
  ];

  const isActive = (href: string) => {
    if (href === '/notes') {
      return pathname === '/notes' || pathname.startsWith('/notes/');
    }
    return pathname === href;
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Sonic KI</h1>
        <p className="text-sm text-gray-400 mt-1">Voice-first notes</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
