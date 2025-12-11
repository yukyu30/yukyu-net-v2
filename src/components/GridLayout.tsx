'use client'

import { ReactNode, useState, useEffect } from 'react';
import MenuBar from './MenuBar';
import StatusBar from './StatusBar';
import WindowFrame from './WindowFrame';
import ProfileSection from './ProfileSection';
import FolderOpen from './FolderOpen';

interface GridLayoutProps {
  children: ReactNode;
  postsCount?: number;
  lastUpdate?: string;
  showProfile?: boolean;
  currentTag?: string;
  pagination?: ReactNode;
}

export default function GridLayout({
  children,
  postsCount,
  lastUpdate,
  showProfile = false,
  currentTag,
  pagination,
}: GridLayoutProps) {
  const [folderOpened, setFolderOpened] = useState<boolean | null>(null);
  const [showContent, setShowContent] = useState(false);

  const windowTitle = currentTag
    ? `TAG: #${currentTag}`
    : 'DecoBoco Digital';

  // 初回のみフォルダアニメーションを表示
  useEffect(() => {
    const hasSeenFolder = sessionStorage.getItem('folderOpened');
    if (hasSeenFolder) {
      setFolderOpened(true);
      setShowContent(true);
    } else {
      setFolderOpened(false);
    }
  }, []);

  const handleFolderComplete = () => {
    sessionStorage.setItem('folderOpened', 'true');
    setFolderOpened(true);
    // 少し遅延してからコンテンツ表示
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* フォルダオープンアニメーション */}
      {folderOpened === false && <FolderOpen onComplete={handleFolderComplete} />}

      {/* メニューバー */}
      <MenuBar />

      {/* メインウィンドウ */}
      <main className="flex-1 p-4">
        <WindowFrame title={windowTitle}>
          {/* タグ情報 */}
          {currentTag && (
            <div className="px-4 py-3">
              <p className="text-sm font-mono text-green-600">
                {postsCount} {postsCount === 1 ? 'ARTICLE' : 'ARTICLES'} FOUND
              </p>
            </div>
          )}

          {/* プロフィール */}
          {showProfile && <ProfileSection />}

          {/* 記事グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {showContent && children}
          </div>

          {/* ページネーション */}
          {pagination && (
            <div className="border-t border-green-400">
              {pagination}
            </div>
          )}
        </WindowFrame>
      </main>

      {/* ステータスバー */}
      <StatusBar
        postsCount={postsCount}
        lastUpdate={lastUpdate}
        status={currentTag ? `VIEWING TAG: #${currentTag}` : 'READY'}
      />
    </div>
  );
}
