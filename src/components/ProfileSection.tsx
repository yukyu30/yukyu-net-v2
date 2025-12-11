import Link from 'next/link';

export default function ProfileSection() {
  const socialLinks = [
    { name: 'X', url: 'https://x.com/yukyu30', label: 'X' },
    { name: 'BlueSky', url: 'https://bsky.app/profile/yukyu.net', label: 'BSKY' },
    { name: 'GitHub', url: 'https://github.com/yukyu30', label: 'GH' },
    { name: 'Zenn', url: 'https://zenn.dev/yu_9', label: 'ZENN' },
    { name: 'Instagram', url: 'https://instagram.com/ugo_kun_930', label: 'IG' },
    { name: 'SUZURI', url: 'https://suzuri.jp/yukyu30', label: 'SZR' },
    { name: 'Portfolio', url: 'https://foriio.com/yukyu30', label: 'FOLIO' },
    { name: 'YouTube', url: 'https://www.youtube.com/@yukyu30', label: 'YT' },
    { name: 'VRChat', url: 'https://vrchat.com/home/user/usr_c3a3cf58-fbf3-420b-9eb2-c9b69d46b5d6', label: 'VRC' },
  ];

  return (
    <div className="border-b border-green-400">
      {/* プロフィールヘッダー */}
      <div className="border-b border-green-400 px-4 py-2 bg-green-400/10">
        <span className="text-xs font-mono font-bold">&gt; USER PROFILE</span>
      </div>

      <div className="p-4">
        {/* 名前と職業 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-green-400 p-3">
            <div className="text-xs font-mono text-green-600 mb-1">NAME:</div>
            <div className="font-mono">
              yukyu
              <Link
                href="/posts/me"
                className="ml-2 text-xs text-green-600 hover:text-green-400 hover:underline"
              >
                [VIEW PROFILE]
              </Link>
            </div>
          </div>

          <div className="border border-green-400 p-3">
            <div className="text-xs font-mono text-green-600 mb-1">ROLE:</div>
            <div className="text-sm font-mono">
              GMO Pepabo / Metaverse Div. Engineering Lead / VR Expert
            </div>
          </div>
        </div>

        {/* SNSリンク */}
        <div className="border border-green-400 p-3">
          <div className="text-xs font-mono text-green-600 mb-2">LINKS:</div>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 text-xs font-mono border border-green-400 hover:bg-green-400 hover:text-black transition-colors"
              >
                [{link.label}]
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
