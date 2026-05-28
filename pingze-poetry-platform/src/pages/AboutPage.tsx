import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import PageTransition from '../components/common/PageTransition';
import RotatingQuote from '../components/common/RotatingQuote';

const platformFeatures = [
  {
    icon: '格',
    title: '格律检测',
    description: '自动检测平仄格律，确保诗词符合传统规范。支持近体诗与词的格律校验。',
  },
  {
    icon: '模',
    title: '模板库',
    description: '提供20余种诗词格律模板，涵盖绝句、律诗、词牌等多种体裁。',
  },
  {
    icon: '创',
    title: '创作空间',
    description: '简洁优雅的创作界面，实时格律分析与押韵建议，让灵感自由流淌。',
  },
  {
    icon: '藏',
    title: '作品管理',
    description: '保存、分类、管理您的诗词作品，支持版本回溯与自动保存。',
  },
  {
    icon: '享',
    title: '分享导出',
    description: '一键生成精美诗词卡片，支持多种主题，也可导出为纯文本。',
  },
  {
    icon: '智',
    title: 'AI 辅助',
    description: '智能押韵建议与对仗提示，让创作更加得心应手。',
  },
];

const faqData = [
  {
    question: '平仄间是什么？',
    answer: '平仄间是一个专注于中华诗词创作与学习的在线平台。我们提供严格的格律检测、丰富的模板资源和优雅的创作体验，帮助诗词爱好者创作规范的古典诗词。',
  },
  {
    question: '平仄间是否免费使用？',
    answer: '目前平仄间的核心功能完全免费，包括格律检测、模板浏览、诗词创作和作品管理等。我们致力于让更多人接触和了解中华诗词文化。',
  },
  {
    question: '什么是平仄？',
    answer: '平仄是汉语声调的分类方式。在古代汉语中，声调分为平、上、去、入四声，其中平声为"平"，上、去、入三声为"仄"。在现代汉语中，一声（阴平）和二声（阳平）为平声，三声（上声）和四声（去声）为仄声。平仄交替使用，形成诗词的音律美感。',
  },
  {
    question: '如何使用格律模板？',
    answer: '在"格律模板"页面选择您感兴趣的诗体或词牌，系统会自动加载对应的格律格式。然后在创作页面按照提示逐句填写，系统会实时检测平仄是否符合要求。',
  },
  {
    question: '平仄间支持哪些诗词体裁？',
    answer: '目前支持五言绝句、七言绝句、五言律诗、七言律诗等近体诗体裁，以及水调歌头、满江红、沁园春、念奴娇等20余种常见词牌。后续将持续扩展。',
  },
];

const poetryTimeline = [
  { dynasty: '先秦', year: '前11世纪-前3世纪', event: '《诗经》《楚辞》奠定了中国诗歌的基础', description: '四言为主，开创赋比兴手法' },
  { dynasty: '汉', year: '前206-220', event: '乐府诗兴盛，五言诗成熟', description: '《古诗十九首》为代表' },
  { dynasty: '魏晋南北朝', year: '220-589', event: '七言诗出现，格律初探', description: '建安风骨，陶渊明田园诗' },
  { dynasty: '唐', year: '618-907', event: '近体诗格律完善，诗歌鼎盛', description: '李白、杜甫、王维等大家辈出' },
  { dynasty: '宋', year: '960-1279', event: '词体繁荣，达到巅峰', description: '苏轼、辛弃疾、李清照等' },
  { dynasty: '元', year: '1271-1368', event: '散曲兴起', description: '马致远、张养浩等' },
  { dynasty: '明清', year: '1368-1912', event: '诗词传承与创新', description: '纳兰性德、龚自珍等' },
];

const famousQuotes = [
  { text: '文章千古事，得失寸心知。', author: '杜甫', title: '偶题' },
  { text: '为人性僻耽佳句，语不惊人死不休。', author: '杜甫', title: '江上值水如海势聊短述' },
  { text: '吟安一个字，捻断数茎须。', author: '卢延让', title: '苦吟' },
];

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-ink-black tracking-wider mb-4">
              关于平仄间
            </h1>
            <div className="w-16 h-0.5 bg-cinnabar/40 mx-auto mb-4" />
            <p className="text-base text-ink-black/60 leading-relaxed max-w-xl mx-auto tracking-wide">
              平仄间是一个专注于中华诗词创作与学习的平台。我们相信，诗词不仅是文字的艺术，更是情感的寄托与文化的传承。
            </p>
          </div>

          <Card variant="raised" className="p-8 bg-gradient-to-br from-white/60 to-rice-paper">
            <h2 className="text-lg font-medium text-ink-black mb-4 tracking-wider cinnabar-accent pl-4">
              我们的理念
            </h2>
            <p className="text-sm text-ink-black/60 leading-relaxed mb-4">
              在传统与创新之间寻找平衡，让古诗词的格律之美在现代技术中焕发新的生机。我们希望通过严谨的格律检测与丰富的模板资源，帮助每一位诗词爱好者创作出规范而优美的作品。
            </p>
            <p className="text-sm text-ink-black/60 leading-relaxed">
              平仄间的名字取自"平仄之间"，寓意在声律的起伏中探寻诗词之美。每一首诗词都是平与仄的和谐交响，是我们对中华传统文化的致敬与传承。
            </p>
          </Card>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.2em] text-cinnabar/60 uppercase">核心功能</span>
            <h2 className="text-2xl font-bold text-ink-black tracking-wider mt-2 mb-2">
              功能特性
            </h2>
            <div className="w-10 h-0.5 bg-cinnabar/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformFeatures.map((feature) => (
              <Card
                key={feature.title}
                variant="raised"
                className="p-5 group hover:border-cinnabar/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-cinnabar/10 text-cinnabar flex items-center justify-center text-lg font-bold group-hover:bg-cinnabar/20 transition-colors">
                    {feature.icon}
                  </span>
                  <h3 className="text-sm font-medium text-ink-black tracking-wider">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-ink-black/50 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.2em] text-indigo-blue/60 uppercase">发展历程</span>
            <h2 className="text-2xl font-bold text-ink-black tracking-wider mt-2 mb-2">
              中华诗词发展简史
            </h2>
            <div className="w-10 h-0.5 bg-indigo-blue/30 mx-auto" />
            <p className="text-xs text-ink-black/40 mt-3 max-w-md mx-auto">
              了解诗词形式的演变，更好地理解格律的由来与意义
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cinnabar/30 via-indigo-blue/20 to-transparent" />

            <div className="space-y-6">
              {poetryTimeline.map((item) => (
                <div
                  key={item.dynasty}
                  className="relative flex items-start gap-6 pl-14 group"
                >
                  <div className="absolute left-4 top-1.5 w-5 h-5 rounded-full bg-rice-paper border-2 border-cinnabar/30 group-hover:border-cinnabar transition-colors flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cinnabar/40 group-hover:bg-cinnabar transition-colors" />
                  </div>

                  <Card className="flex-1 p-4 group-hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-cinnabar tracking-wider">
                        {item.dynasty}
                      </span>
                      <span className="text-xs text-ink-black/30">{item.year}</span>
                    </div>
                    <p className="text-sm font-medium text-ink-black/70 mb-1">
                      {item.event}
                    </p>
                    <p className="text-xs text-ink-black/40">{item.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.2em] text-ink-black/30 uppercase">千古名句</span>
            <h2 className="text-2xl font-bold text-ink-black tracking-wider mt-2 mb-2">
              诗人说诗
            </h2>
            <div className="w-10 h-0.5 bg-ink-black/10 mx-auto" />
          </div>

          <RotatingQuote quotes={famousQuotes} interval={5000} />
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.2em] text-cinnabar/60 uppercase">常见问题</span>
            <h2 className="text-2xl font-bold text-ink-black tracking-wider mt-2 mb-2">
              常见问题
            </h2>
            <div className="w-10 h-0.5 bg-cinnabar/30 mx-auto" />
          </div>

          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <div
                key={i}
                className="border border-ink-black/8 rounded-sm overflow-hidden bg-white/40"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium text-ink-black/70 tracking-wider">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-ink-black/30 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-xs text-ink-black/50 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.2em] text-indigo-blue/60 uppercase">致谢</span>
            <h2 className="text-2xl font-bold text-ink-black tracking-wider mt-2 mb-2">
              致谢
            </h2>
            <div className="w-10 h-0.5 bg-indigo-blue/30 mx-auto" />
          </div>

          <Card className="p-6 bg-indigo-blue/5 border-indigo-blue/10">
            <p className="text-sm text-ink-black/60 leading-relaxed mb-4">
              平仄间的平仄检测算法参考了《平水韵》《词林正韵》等传统韵书，以及多位诗词研究学者的研究成果。感谢所有为中华诗词文化传承做出贡献的前辈学者。
            </p>
            <p className="text-sm text-ink-black/60 leading-relaxed mb-4">
              同时感谢每一位使用者的反馈与建议，是你们的热爱让平仄间不断进步。
            </p>
            <div className="pt-4 border-t border-indigo-blue/10">
              <p className="text-xs text-indigo-blue/50 tracking-wider italic">
                "诗者，志之所之也。在心为志，发言为诗。" ——《毛诗序》
              </p>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="p-6 bg-gradient-to-r from-cinnabar/5 to-indigo-blue/5 border-cinnabar/10">
            <h2 className="text-lg font-medium text-ink-black mb-4 tracking-wider">
              联系我们
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cinnabar/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-ink-black/60">contact@pingze-jian.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cinnabar/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-sm text-ink-black/60">github.com/pingze-jian</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/create">
                <Button variant="primary" size="md">
                  开始创作
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="secondary" size="md">
                  浏览模板
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </PageTransition>
  );
}
