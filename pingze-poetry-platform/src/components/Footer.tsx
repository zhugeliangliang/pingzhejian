export default function Footer() {
  return (
    <footer className="border-t border-ink-black/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <span className="text-lg font-bold text-ink-black tracking-wide">
            平仄间
          </span>
          <p className="text-sm text-ink-black/50 tracking-wider">
            传承诗词之美，品味格律之韵
          </p>
          <p className="text-xs text-ink-black/30">
            © 2024 平仄间. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
