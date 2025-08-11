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
}

export default function GridLayout({
  children,
  postsCount,
  lastUpdate,
  showVerticalTexts = true,
  showProfile = false,
  currentTag,
}: GridLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header postsCount={postsCount} lastUpdate={lastUpdate} />
      
      {currentTag && (
        <div className="container mx-auto px-0">
          <div className="border-l-2 border-r-2 border-black mx-4">
            <div className="border-b-2 border-black">
              <div className="px-6 py-6 flex items-center gap-4">
                <span className="text-sm font-mono uppercase transform rotate-90 origin-center">
                  タグ
                </span>
                <div>
                  <h1 className="text-2xl font-bold mb-2">#{currentTag}</h1>
                  <p className="text-sm font-mono">
                    {postsCount} {postsCount === 1 ? 'ARTICLE' : 'ARTICLES'} FOUND
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      <Footer variant="grid" />
    </div>
  );
}
