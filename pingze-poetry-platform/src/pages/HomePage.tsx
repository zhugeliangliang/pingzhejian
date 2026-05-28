import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card } from '../components/ui';
import VerticalText from '../components/common/VerticalText';
import RotatingQuote from '../components/common/RotatingQuote';
import PageTransition from '../components/common/PageTransition';

const featureData = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="9" y1="10" x2="23" y2="10" />
        <line x1="9" y1="15" x2="20" y2="15" />
        <line x1="9" y1="20" x2="17" y2="20" />
        <circle cx="24" cy="22" r="5" strokeDasharray="2 2" />
        <path d="M22.5 22l1 1 2-2" />
      </svg>
    ),
    title: '格律校验',
    description: '严格的平仄格律检测，助您创作规范诗词',
    color: 'text-cinnabar',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 4h20v24H6z" />
        <line x1="10" y1="9" x2="22" y2="9" />
        <line x1="10" y1="13" x2="22" y2="13" />
        <line x1="10" y1="17" x2="18" y2="17" />
        <line x1="10" y1="21" x2="15" y2="21" />
      </svg>
    ),
    title: '模板库',
    description: '丰富的诗词模板，从绝句到律诗，从词到曲',
    color: 'text-indigo-blue',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 6h16l4 4v16a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" />
        <polyline points="24,6 24,10 20,10" />
        <line x1="10" y1="16" x2="22" y2="16" />
        <line x1="10" y1="20" x2="18" y2="20" />
      </svg>
    ),
    title: '作品集',
    description: '保存与管理您的创作，记录诗词成长的每一步',
    color: 'text-ink-black',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="12" />
        <path d="M12 12c1.5-2 4-3 6.5-2.5s4.5 2.5 5 5" />
        <circle cx="12" cy="18" r="2" />
        <circle cx="20" cy="14" r="2" />
      </svg>
    ),
    title: 'AI 辅助',
    description: '智能押韵建议与对仗提示，让创作更加得心应手',
    color: 'text-cinnabar',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 4l3 7h7l-5.5 4.5 2 7L16 18l-6.5 4.5 2-7L6 11h7z" />
      </svg>
    ),
    title: '分享导出',
    description: '一键生成精美诗词卡片，支持多种主题与格式',
    color: 'text-indigo-blue',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 28c7.2 0 13-5.8 13-13S23.2 2 16 2 3 7.8 3 15s5.8 13 13 13z" />
        <path d="M10 15l4 4 8-8" />
      </svg>
    ),
    title: '版本管理',
    description: '自动保存与版本回溯，不错过任何灵感闪现',
    color: 'text-ink-black',
  },
];

const featuredPoems = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    lines: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    lines: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
  },
  {
    title: '春望',
    author: '杜甫',
    dynasty: '唐',
    lines: ['国破山河在，', '城春草木深。', '感时花溅泪，', '恨别鸟惊心。', '烽火连三月，', '家书抵万金。', '白头搔更短，', '浑欲不胜簪。'],
  },
];

const famousQuotes = [
  { text: '大江东去，浪淘尽，千古风流人物。', author: '苏轼', title: '念奴娇·赤壁怀古' },
  { text: '人生自古谁无死，留取丹心照汗青。', author: '文天祥', title: '过零丁洋' },
  { text: '问君能有几多愁，恰似一江春水向东流。', author: '李煜', title: '虞美人' },
  { text: '但愿人长久，千里共婵娟。', author: '苏轼', title: '水调歌头' },
  { text: '山重水复疑无路，柳暗花明又一村。', author: '陆游', title: '游山西村' },
  { text: '春风得意马蹄疾，一日看尽长安花。', author: '孟郊', title: '登科后' },
];

function InkDecoration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute pointer-events-none opacity-[0.04] ${className}`}
      viewBox="0 0 200 200"
      fill="currentColor"
    >
      <circle cx="100" cy="100" r="80" />
      <circle cx="60" cy="60" r="40" />
      <circle cx="150" cy="130" r="30" />
    </svg>
  );
}

function StaggeredCard({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const heroParallax = scrollY * 0.3;
  const heroOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        {/* Ink wash background decorations */}
        <InkDecoration className="w-96 h-96 -top-20 -right-20 text-ink-black" />
        <InkDecoration className="w-64 h-64 top-1/3 -left-16 text-indigo-blue" />
        <InkDecoration className="w-48 h-48 bottom-20 right-10 text-cinnabar" />

        {/* Hero Section */}
        <section
          className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20"
          style={{ transform: `translateY(${heroParallax}px)`, opacity: heroOpacity }}
        >
          {/* Decorative top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-cinnabar/40 to-transparent" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Main hero content */}
            <div className="text-center lg:text-left flex-1">
              <div className="inline-block mb-4">
                <span className="text-xs tracking-[0.3em] text-cinnabar/70 uppercase border border-cinnabar/20 px-3 py-1 rounded-sm">
                  中华诗词创作平台
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-ink-black tracking-[0.2em] mb-6">
                平仄间
              </h1>

              <p className="text-xl md:text-2xl text-ink-black/50 mb-3 tracking-[0.15em]">
                在平仄之间，寻找诗词之美
              </p>

              <p className="text-base text-ink-black/40 mb-10 max-w-lg leading-relaxed tracking-wide">
                格律严谨，意境深远。无论是五言绝句还是七言律诗，
                在这里您可以自由创作，感受中华诗词的独特魅力。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/create">
                  <Button variant="primary" size="lg" className="min-w-[140px]">
                    开始创作
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="secondary" size="lg" className="min-w-[140px]">
                    浏览模板
                  </Button>
                </Link>
              </div>

              {/* Scroll indicator */}
              <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-ink-black/30 tracking-wider">向下探索</span>
                <svg className="w-5 h-5 text-ink-black/30" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Vertical text decoration */}
            <div className="hidden lg:flex flex-col items-center gap-4 opacity-60">
              <VerticalText className="text-3xl text-ink-black/30 font-bold">
                平仄之间觅诗韵
              </VerticalText>
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-cinnabar/30" />
              <VerticalText className="text-lg text-ink-black/20">
                笔墨丹青写春秋
              </VerticalText>
            </div>
          </div>
        </section>

        {/* Rotating Quote Section */}
        <section
          id="quotes"
          className="py-16 px-6 border-t border-b border-ink-black/5 bg-white/30"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs tracking-[0.2em] text-ink-black/30 uppercase">千古名句</span>
            </div>
            <RotatingQuote quotes={famousQuotes} interval={5000} />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <StaggeredCard>
              <div className="text-center mb-14">
                <span className="text-xs tracking-[0.2em] text-cinnabar/60 uppercase">核心功能</span>
                <h2 className="text-3xl md:text-4xl font-bold text-ink-black tracking-wider mt-3 mb-4">
                  功能特性
                </h2>
                <div className="w-12 h-0.5 bg-cinnabar/40 mx-auto" />
                <p className="text-base text-ink-black/40 mt-4 max-w-xl mx-auto tracking-wide">
                  融合传统格律与现代技术，为您的诗词创作提供全方位支持
                </p>
              </div>
            </StaggeredCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureData.map((feature, i) => (
                <StaggeredCard key={feature.title} delay={i * 100}>
                  <Card variant="raised" className="p-6 h-full group hover:border-cinnabar/20 transition-colors duration-300">
                    <div className={`${feature.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-ink-black mb-2 tracking-wider">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-ink-black/50 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </StaggeredCard>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Poems Section */}
        <section id="poems" className="py-20 px-6 bg-white/30 border-t border-ink-black/5">
          <div className="max-w-6xl mx-auto">
            <StaggeredCard>
              <div className="text-center mb-14">
                <span className="text-xs tracking-[0.2em] text-indigo-blue/60 uppercase">经典赏析</span>
                <h2 className="text-3xl md:text-4xl font-bold text-ink-black tracking-wider mt-3 mb-4">
                  经典名篇
                </h2>
                <div className="w-12 h-0.5 bg-indigo-blue/40 mx-auto" />
                <p className="text-base text-ink-black/40 mt-4 max-w-xl mx-auto tracking-wide">
                  品读千古流传的诗词佳作，感受中华文化的深厚底蕴
                </p>
              </div>
            </StaggeredCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPoems.map((poem, i) => (
                <StaggeredCard key={poem.title} delay={i * 150}>
                  <Card className="p-6 bg-rice-paper border-ink-black/8 group hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs px-2 py-0.5 border border-cinnabar/30 text-cinnabar rounded-sm">
                        {poem.dynasty}
                      </span>
                      <span className="text-xs text-ink-black/40">{poem.author}</span>
                    </div>
                    <h3 className="text-xl font-medium text-ink-black tracking-wider mb-4">
                      {poem.title}
                    </h3>
                    <div className="space-y-1">
                      {poem.lines.map((line, j) => (
                        <p
                          key={j}
                          className="text-sm text-ink-black/60 leading-loose tracking-widest group-hover:text-ink-black/70 transition-colors"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </Card>
                </StaggeredCard>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/templates">
                <Button variant="secondary" size="md">
                  查看更多模板
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-blue/5 via-transparent to-cinnabar/5" />
          <InkDecoration className="w-80 h-80 -top-10 -left-10 text-cinnabar" />

          <StaggeredCard>
            <div className="relative max-w-2xl mx-auto text-center">
              <span className="text-5xl md:text-6xl mb-6 block">🖊️</span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink-black tracking-wider mb-4">
                开始您的创作之旅
              </h2>
              <p className="text-base text-ink-black/50 mb-8 leading-relaxed tracking-wide max-w-lg mx-auto">
                无论是初学格律的新手，还是经验丰富的诗人，
                平仄间都将陪伴您的每一次创作。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create">
                  <Button variant="primary" size="lg">
                    立即创作
                  </Button>
                </Link>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-3 text-base tracking-wider text-ink-black/60 hover:text-cinnabar transition-colors"
                >
                  了解更多 →
                </button>
              </div>
            </div>
          </StaggeredCard>
        </section>

        {/* Quick navigation dots */}
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-30">
          {[
            { id: 'quotes', label: '名句' },
            { id: 'features', label: '功能' },
            { id: 'poems', label: '经典' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex items-center justify-end"
              title={item.label}
            >
              <span className="absolute right-6 px-2 py-1 text-xs bg-ink-black/80 text-rice-paper rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
              <span className="w-2 h-2 rounded-full bg-ink-black/20 group-hover:bg-cinnabar transition-colors" />
            </button>
          ))}
        </nav>
      </div>
    </PageTransition>
  );
}
