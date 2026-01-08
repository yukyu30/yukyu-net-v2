'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobeIcon from './GlobeIcon';
import { HeartbeatIndicator } from './HeartbeatIndicator';
import Search from './Search';
import type { StatusResponse } from '@/types/status';

interface MenuItem {
  label: string;
  items: { label: string; href?: string; onClick?: () => void }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'File',
    items: [
      { label: 'RSS', href: '/rss.xml' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Tags', href: '/tags' },
      { label: 'Works', href: '/works' },
      { label: 'Graph', href: '/graph' },
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
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleItemClick = () => {
    setOpenMenu(null);
  };

  // ステータスを取得
  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch {
        // エラーは無視（オフライン表示になる）
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return (
    <nav className="border-b border-green-400 bg-black">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center">
          {/* 地球アイコン（稼働インジケーター） */}
          <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4 pr-2 sm:pr-4 border-r border-green-800">
            <GlobeIcon size={20} className="text-green-400 sm:hidden" />
            <GlobeIcon size={24} className="text-green-400 hidden sm:block" />
            <span className="text-sm font-mono text-green-600 hidden sm:inline">ONLINE</span>
          </div>

          {/* TOP リンク（ドロップダウンなし） */}
          <Link
            href="/"
            className="px-2 sm:px-4 py-2 text-sm sm:text-base font-mono uppercase transition-colors hover:bg-green-400 hover:text-black"
          >
            Top
          </Link>

          {/* ドロップダウンメニュー */}
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => handleMenuClick(menu.label)}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-mono uppercase transition-colors ${
                  openMenu === menu.label
                    ? 'bg-green-400 text-black'
                    : 'hover:bg-green-400 hover:text-black'
                }`}
              >
                {menu.label}
              </button>
              {openMenu === menu.label && (
                <div className="absolute left-0 top-full z-50 min-w-40 border border-green-400 bg-black">
                  {menu.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href || '#'}
                      onClick={handleItemClick}
                      className="block px-5 py-3 text-base font-mono uppercase hover:bg-green-400 hover:text-black transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 右側: 検索 + 生存ステータスインジケーター */}
        <div className="flex items-center gap-2">
          <Search />
          <Link href="/status" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <HeartbeatIndicator isAlive={status?.is_alive ?? null} isLoading={isLoading} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
