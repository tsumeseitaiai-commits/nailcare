import Image from 'next/image';
import fs from 'fs';
import path from 'path';

const SPORTS = [
  {
    key: 'judo',
    src: '/images/sports/judo.jpg',
    label: '柔道',
    title: '「掴む力」は指先から',
    desc: '道着を握る瞬間、爪が力の伝達を左右する',
    placeholder: {
      gradient: 'from-slate-700 via-slate-600 to-slate-800',
      emoji: '🥋',
      accent: 'border-slate-400/30',
    },
  },
  {
    key: 'baseball',
    src: '/images/sports/baseball.jpg',
    label: '野球',
    title: '「投球力」は爪の状態で変わる',
    desc: 'リリースの瞬間、指先の爪が伝達を担う',
    placeholder: {
      gradient: 'from-amber-800 via-stone-700 to-amber-900',
      emoji: '⚾',
      accent: 'border-amber-400/30',
    },
  },
  {
    key: 'soccer',
    src: '/images/sports/soccer.jpg',
    label: 'サッカー',
    title: '「蹴る力」は足趾から',
    desc: 'スパイクの中、足趾の爪が踏ん張りに直結する',
    placeholder: {
      gradient: 'from-green-800 via-green-700 to-emerald-900',
      emoji: '⚽',
      accent: 'border-green-400/30',
    },
  },
];

function imageExists(src: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', src);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export default function SportsGallery() {
  return (
    <section className="overflow-hidden">
      <div className="bg-white py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">SPORTS</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          あなたの競技に、直結する
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          爪と足趾の状態が、パフォーマンスを左右する瞬間
        </p>
      </div>

      <div className="grid lg:grid-cols-3">
        {SPORTS.map((sport) => {
          const hasImage = imageExists(sport.src);
          return (
            <div
              key={sport.key}
              className={`relative h-80 overflow-hidden lg:h-96 ${
                hasImage ? 'bg-slate-900' : `bg-gradient-to-br ${sport.placeholder.gradient}`
              }`}
            >
              {hasImage ? (
                <Image
                  src={sport.src}
                  alt={sport.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              ) : (
                /* Placeholder — 画像未配置の間表示 */
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`rounded-2xl border ${sport.placeholder.accent} bg-white/5 px-10 py-8 text-center backdrop-blur-sm`}>
                    <span className="text-6xl">{sport.placeholder.emoji}</span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/50">
                      Photo coming soon
                    </p>
                    <p className="mt-1 text-sm font-bold text-white/80">{sport.label}</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {sport.label}
                </span>
                <h3 className="mt-2 text-lg font-bold leading-snug text-white">{sport.title}</h3>
                <p className="mt-1 text-xs text-white/70">{sport.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
