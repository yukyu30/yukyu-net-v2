import Link from 'next/link'

export default function ProfileSection() {
  const socialLinks = [
    { name: 'X', url: 'https://x.com/yukyu30', label: 'X' },
    { name: 'BlueSky', url: 'https://bsky.app/profile/yukyu.net', label: 'BSKY' },
    { name: 'GitHub', url: 'https://github.com/yukyu30', label: 'GH' },
    { name: 'Zenn', url: 'https://zenn.dev/yu_9', label: 'ZENN' },
    { name: 'Instagram', url: 'https://instagram.com/ugo_kun_930', label: 'IG' },
    { name: 'SUZURI', url: 'https://suzuri.jp/yukyu30', label: 'SZR' },
    { name: 'Portfolio', url: 'https://foriio.com/yukyu30', label: 'FOLIO' },
    { name: 'Blog', url: 'https://yukyu.net', label: 'BLOG' },
    { name: 'LinkedIn', url: '#', label: 'IN' },
    { name: 'YouTube', url: '#', label: 'YT' },
    { name: 'Threads', url: '#', label: 'THR' },
    { name: 'Note', url: '#', label: 'NOTE' },
  ]

  return (
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
                PROFILE
              </h2>
            </div>

            {/* プロフィール内容 */}
            <div className="flex-1">
              {/* 名前と職業 */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* 名前 */}
                <div className="border-r-0 md:border-r-2 border-b-2 border-black">
                  <div className="border-b-2 border-black px-4 py-2">
                    <div className="text-xs font-mono font-bold">名前</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-mono">yukyu</div>
                  </div>
                </div>
                
                {/* 職業 */}
                <div className="border-b-2 border-black">
                  <div className="border-b-2 border-black px-4 py-2">
                    <div className="text-xs font-mono font-bold">所属/役職</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-mono">
                      GMOペパボ株式会社 メタバース推進室 エンジニアリングリード
                    </div>
                  </div>
                </div>
              </div>
              
              {/* SNSリンクグリッド */}
              <div className="grid grid-cols-6 md:grid-cols-12 bg-black">
                {socialLinks.map((link, index) => {
                  const col = index % 6
                  const colDesktop = index % 12
                  const isInFirstRow = index < 6
                  
                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        py-2 px-2 flex items-center justify-center
                        bg-black text-white
                        hover:bg-white hover:text-black transition-colors
                        text-xs font-mono font-bold
                        ${col < 5 ? 'border-r border-white' : ''}
                        ${col === 5 && colDesktop < 11 ? 'md:border-r md:border-white' : ''}
                        ${isInFirstRow ? 'border-b border-white md:border-b-0' : ''}
                      `}
                      aria-label={link.label}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}