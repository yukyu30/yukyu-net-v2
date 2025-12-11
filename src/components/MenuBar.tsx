'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  items: { label: string; href?: string; onClick?: () => void }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'File',
    items: [
      { label: 'Index', href: '/' },
      { label: 'RSS', href: '/rss.xml' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Tags', href: '/tags' },
      { label: 'Works', href: '/works' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'About', href: '/posts/me' },
    ],
  },
];

export default function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleItemClick = () => {
    setOpenMenu(null);
  };

  return (
    <nav className="border-b border-green-400 bg-black">
      <div className="flex items-center px-2 py-1">
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onClick={() => handleMenuClick(menu.label)}
              className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
                openMenu === menu.label
                  ? 'bg-green-400 text-black'
                  : 'hover:bg-green-400 hover:text-black'
              }`}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && (
              <div className="absolute left-0 top-full z-50 min-w-32 border border-green-400 bg-black">
                {menu.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href || '#'}
                    onClick={handleItemClick}
                    className="block px-4 py-2 text-xs font-mono uppercase hover:bg-green-400 hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
