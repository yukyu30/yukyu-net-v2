import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import VerticalText from './VerticalText';
import ProfileSection from './ProfileSection';

interface GridLayoutProps {
  children: ReactNode;
  postsCount?: number;
  lastUpdate?: string;
  showVerticalTexts?: boolean;
  showProfile?: boolean;
  currentTag?: string;
  pagination?: ReactNode;
}

export default function GridLayout({
  children,
  postsCount,
  lastUpdate,
  showVerticalTexts = true,
  showProfile = false,
  currentTag,
  pagination,
}: GridLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header postsCount={postsCount} lastUpdate={lastUpdate} />
      
      {currentTag && (
        <section className="border-b-2 border-black">
          <div className="container mx-auto px-0">
            <div className="border-l-2 border-r-2 border-black mx-4">
              <div className="flex">
                {/* 左側の縦書きタイトル */}
                <div className="border-r-2 border-black px-4 py-6 flex items-center">
                  <h2
                    className="text-sm font-mono font-bold uppercase"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    TAG
                  </h2>
                </div>
                {/* タグ内容 */}
                <div className="flex-1 px-6 py-6">
                  <h1 className="text-2xl font-bold mb-2">#{currentTag}</h1>
                  <p className="text-sm font-mono">
                    {postsCount} {postsCount === 1 ? 'ARTICLE' : 'ARTICLES'} FOUND
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {showProfile && <ProfileSection />}

      <main className="container mx-auto px-0 relative">
        {showVerticalTexts && (
          <>
            <VerticalText
              texts={["YUKYU'S DIARY", 'PERSONAL ARCHIVE']}
              position="left"
            />
            <VerticalText
              texts={['WRITTEN BY YUKYU', 'YEAR']}
              position="right"
            />
          </>
        )}

        <div className="border-l-2 border-r-2 border-black mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {children}
          </div>
        </div>
      </main>

      {pagination}
      
      <Footer variant="grid" />
    </div>
  );
}
