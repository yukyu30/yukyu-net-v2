'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import GlobeIcon from './GlobeIcon';

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
  const activityRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleItemClick = () => {
    setOpenMenu(null);
  };

  // アクティビティインジケーター（ランダムに点滅）
  useEffect(() => {
    if (activityRef.current) {
      const blink = () => {
        if (activityRef.current) {
          gsap.to(activityRef.current, {
            opacity: 1,
            duration: 0.1,
            onComplete: () => {
              gsap.to(activityRef.current, {
                opacity: 0.2,
                duration: 0.3,
              });
            }
          });
        }
      };

      // ランダムな間隔で点滅
      const scheduleNext = () => {
        const delay = 500 + Math.random() * 2000;
        setTimeout(() => {
          blink();
          scheduleNext();
        }, delay);
      };

      scheduleNext();
    }
  }, []);

  return (
    <nav className="border-b border-green-400 bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {/* 地球アイコン（稼働インジケーター） */}
          <div className="flex items-center mr-4 pr-4 border-r border-green-800">
            <GlobeIcon size={24} className="text-green-400" />
          </div>

          {/* TOP リンク（ドロップダウンなし） */}
          <Link
            href="/"
            className="px-5 py-2 text-base font-mono uppercase transition-colors hover:bg-green-400 hover:text-black"
          >
            Top
          </Link>

          {/* ドロップダウンメニュー */}
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => handleMenuClick(menu.label)}
                className={`px-5 py-2 text-base font-mono uppercase transition-colors ${
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

        {/* 右側: アクティビティインジケーター */}
        <div className="flex items-center gap-2">
          <div
            ref={activityRef}
            className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-20"
          />
          <span className="text-sm font-mono text-green-600 hidden sm:inline">SYS</span>
        </div>
      </div>
    </nav>
  );
}
