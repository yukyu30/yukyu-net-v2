import Link from 'next/link';

export default function ProfileSection() {
  const socialLinks = [
    { name: 'X', url: 'https://x.com/yukyu30', label: 'X', type: 'link' },
    {
      name: 'BlueSky',
      url: 'https://bsky.app/profile/yukyu.net',
      label: 'BSKY',
      type: 'link',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/yukyu30',
      label: 'GH',
      type: 'link',
    },
    { name: 'Zenn', url: 'https://zenn.dev/yu_9', label: 'ZENN', type: 'link' },
    {
      name: 'Instagram',
      url: 'https://instagram.com/ugo_kun_930',
      label: 'IG',
      type: 'link',
    },
    {
      name: 'SUZURI',
      url: 'https://suzuri.jp/yukyu30',
      label: 'SZR',
      type: 'link',
    },
    {
      name: 'Portfolio',
      url: 'https://foriio.com/yukyu30',
      label: 'FOLIO',
      type: 'link',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@yukyu30',
      label: 'YT',
      type: 'link',
    },
    {
      name: 'VRChat',
      url: 'https://vrchat.com/home/user/usr_c3a3cf58-fbf3-420b-9eb2-c9b69d46b5d6',
      label: 'VRC',
      type: 'link',
    },
    { name: 'Empty1', url: '#', label: '/', type: 'empty' },
    { name: 'Empty2', url: '#', label: '/', type: 'empty' },
    { name: 'Empty3', url: '#', label: '/', type: 'empty' },
  ];

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
                <div className="border-b-2 border-black p-4 flex items-center">
                  <div className="text-sm font-mono">
                    GMOペパボ株式会社 メタバース推進室 エンジニアリングリード / 上級VR技術者
                  </div>
                </div>
              </div>

              {/* SNSリンクグリッド */}
              <div className="grid grid-cols-6 md:grid-cols-12">
                {socialLinks.map((link, index) => {
                  const col = index % 6;
                  const colDesktop = index % 12;
                  const isInFirstRow = index < 6;

                  if (link.type === 'empty') {
                    return (
                      <div
                        key={link.name}
                        className={`
                          relative overflow-hidden
                          bg-white
                          ${col < 5 ? 'border-r-2 border-black' : ''}
                          ${
                            col === 5 && colDesktop < 11
                              ? 'md:border-r-2 md:border-black'
                              : ''
                          }
                          ${
                            isInFirstRow
                              ? 'border-b-2 border-black md:border-b-0'
                              : ''
                          }
                        `}
                        style={{ height: '40px' }}
                      >
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <line
                            x1="0"
                            y1="100"
                            x2="100"
                            y2="0"
                            stroke="black"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        flex items-center justify-center
                        bg-white text-black
                        hover:bg-black hover:text-white transition-colors
                        text-xs font-mono font-bold
                        ${col < 5 ? 'border-r-2 border-black' : ''}
                        ${
                          col === 5 && colDesktop < 11
                            ? 'md:border-r-2 md:border-black'
                            : ''
                        }
                        ${
                          isInFirstRow
                            ? 'border-b-2 border-black md:border-b-0'
                            : ''
                        }
                      `}
                      style={{ height: '40px' }}
                      aria-label={link.label}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
