import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import VerticalText from './VerticalText'

interface GridLayoutProps {
  children: ReactNode
  postsCount?: number
  lastUpdate?: string
  showVerticalTexts?: boolean
}

export default function GridLayout({ 
  children, 
  postsCount, 
  lastUpdate,
  showVerticalTexts = true 
}: GridLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header postsCount={postsCount} lastUpdate={lastUpdate} />
      
      <main className="container mx-auto px-0 relative">
        {showVerticalTexts && (
          <>
            <VerticalText 
              texts={["YUKYU'S DIARY", "PERSONAL ARCHIVE"]}
              position="left"
            />
            <VerticalText 
              texts={["WRITTEN BY YUKYU", "YEAR"]}
              position="right"
            />
          </>
        )}
        
        <div className="border-l-2 border-r-2 border-b-2 border-black mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {children}
          </div>
        </div>
      </main>
      
      <Footer variant="grid" />
    </div>
  )
}