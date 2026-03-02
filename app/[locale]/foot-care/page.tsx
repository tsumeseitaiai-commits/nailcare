import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FootCarePage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 space-y-8">

          {/* ヒーロー */}
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Foot Care</p>
            <h1 className="text-3xl font-bold text-foreground">足裏角質除去・肥厚爪ケア</h1>
            <p className="mt-2 text-sm text-muted-foreground">専門知識に基づいた足裏ケアのご案内</p>
          </div>

          {/* 症状別診断 */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">症状別の診断基準</h2>
            <div className="space-y-4">
              {[
                {
                  name: 'タコ',
                  badge: '施術可',
                  badgeColor: 'bg-emerald-100 text-emerald-700',
                  desc: '皮膚が厚くなり硬くなる。黄色味を帯びた色になり少し盛り上がる。皮膚への過度な圧迫が原因。',
                  note: 'タコ・イボの判断に悩む場合は施術をお断りし医師の判断を仰ぎましょう。',
                },
                {
                  name: '魚の目',
                  badge: '施術可',
                  badgeColor: 'bg-emerald-100 text-emerald-700',
                  desc: '足裏の突出部・指のふち・指の間に多い。中心に「しん」があり圧迫で強い痛みを伴う。',
                  note: '根深く出血リスクがある場合やイボの判断に悩む場合は医師の判断を仰ぎましょう。',
                },
                {
                  name: 'イボ',
                  badge: '施術不可',
                  badgeColor: 'bg-red-100 text-red-700',
                  desc: 'ウイルス感染が原因で伝染力が強い。点状に硬く盛り上がる・褐色変化など症状は様々。',
                  note: '必ず医師の判断を仰いでください。',
                },
              ].map(item => (
                <div key={item.name} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">{item.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="mb-1 text-sm text-muted-foreground">{item.desc}</p>
                  <p className="text-xs text-amber-700">⚠ {item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 角質除去の流れ */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">角質除去の流れ</h2>
            <ol className="space-y-3">
              {[
                'キューティクルリムーバーで角質を柔らかくする。ひび割れが深い場合はフットパドルで事前に除去。',
                '常にウェット状態でマシンを使用（推奨回転数: 1500〜3000）。押し当て過ぎず、チョンチョンと当てては離す。',
                '#80→#150→#240→#220→#800の順にビットを使用して仕上げる。',
                'ネイルオイル・クリーム・ローションで保湿して完了。',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>
                  <span className="leading-relaxed text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 肥厚爪ケア */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">肥厚爪ケアについて</h2>
            <div className="mb-4 rounded-lg bg-muted/50 p-4">
              <p className="mb-1 text-sm font-semibold text-foreground">原因</p>
              <p className="text-sm text-muted-foreground">靴が合わない・加齢・深爪・爪のケア不足の4つが主な原因です。</p>
            </div>
            <div className="mb-4 rounded-lg bg-muted/50 p-4">
              <p className="mb-1 text-sm font-semibold text-foreground">来店周期の目安</p>
              <p className="text-sm text-muted-foreground">2〜3週間に1度。肥厚が軽減するまで定期的にケアを継続します。</p>
            </div>
            <p className="text-sm text-muted-foreground">余分な部分を削ることで爪が小さくなり、正常に伸びるよう数回に分けてケアを行います。</p>
          </div>

          {/* AI診断CTA */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
            <h3 className="mb-2 text-base font-bold text-foreground">AIでかかとを診断する</h3>
            <p className="mb-4 text-sm text-muted-foreground">写真をアップロードするだけで、専門知識に基づいた診断結果をお届けします。</p>
            <a href="/ja/ai-diagnosis" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">
              🦶 かかとを診断する
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
