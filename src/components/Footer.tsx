interface FooterProps {
  variant?: 'grid' | 'article';
}

export default function Footer({ variant = 'grid' }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-black mt-auto">
      <div className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <div className="px-6 py-4 flex justify-between items-center">
            <span className="text-xs font-mono">
              © {year} DecoBoco Digital
            </span>
            <div className="flex gap-4">
              <span className="text-xs font-mono">
                {variant === 'grid' ? 'ARTICLE LIST VIEW' : 'ARTICLE VIEW'}
              </span>
              <span className="text-xs font-mono">|</span>
              <span className="text-xs font-mono">V1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
