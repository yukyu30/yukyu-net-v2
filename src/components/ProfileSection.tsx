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
    <div className="border-b border-green-800 p-4">
      {/* プロフィール情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-mono text-green-600">NAME: </span>
          <span className="text-base font-mono">yukyu</span>
          <Link
            href="/posts/me"
            className="ml-2 text-sm text-green-600 hover:text-green-400"
          >
            [VIEW]
          </Link>
        </div>
        <div>
          <span className="text-sm font-mono text-green-600">ROLE: </span>
          <span className="text-base font-mono">GMO Pepabo / Metaverse Div. / VR Expert</span>
        </div>
      </div>

      {/* SNSリンク */}
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-green-600 hover:text-green-400 transition-colors"
          >
            [{link.label}]
          </Link>
        ))}
      </div>
    </div>
  );
}
