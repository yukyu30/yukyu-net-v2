'use client'

import { ReactNode, useState, useEffect } from 'react';
import MenuBar from './MenuBar';
import StatusBar from './StatusBar';
import WindowFrame from './WindowFrame';
import ProfileSection from './ProfileSection';
import BootSequence from './BootSequence';

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
  const [bootComplete, setBootComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldShowBoot, setShouldShowBoot] = useState(false);

  const windowTitle = currentTag
    ? `TAG: #${currentTag}`
    : 'DecoBoco Digital';

  // クライアントサイドでマウント完了を検知し、referrerをチェック
  useEffect(() => {
    setMounted(true);

    // referrerがyukyu.netからでない場合のみBootSequenceを表示
    const referrer = document.referrer;
    const isFromYukyuNet = referrer.includes('yukyu.net');

    if (isFromYukyuNet) {
      // yukyu.netからの遷移の場合はBootSequenceをスキップ
      setBootComplete(true);
      setShowContent(true);
    } else {
      // 外部からのアクセスの場合はBootSequenceを表示
      setShouldShowBoot(true);
    }
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    // 少し遅延してからコンテンツ表示
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ブートシーケンス（外部からのアクセス時のみ） */}
      {mounted && shouldShowBoot && !bootComplete && <BootSequence onComplete={handleBootComplete} />}

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
