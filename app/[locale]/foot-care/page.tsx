import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/routing';

export default function FootCarePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* HERO */}
        <section className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">Foot Care</p>
            <h1 className="text-4xl font-bold sm:text-5xl">足裏角質除去・肥厚爪ケア</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
              専門マニュアルに基づいた、タコ・魚の目・かかとのひび割れ・肥厚爪の診断と施術をご提供します
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/ai-diagnosis" className="rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg hover:shadow-xl">
                AIでかかとを診断する 🦶
              </Link>
              <a href="#symptoms" className="rounded-xl border-2 border-white/50 px-8 py-4 text-base font-bold text-white hover:bg-white/10">
                症状を確認する →
              </a>
            </div>
          </div>
        </section>

        {/* 症状別診断基準 */}
        <section id="symptoms" className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Diagnosis</p>
              <h2 className="text-3xl font-bold text-foreground">症状別の診断基準</h2>
              <p className="mt-4 text-muted-foreground">症状によって対応が異なります。判断に迷う場合は必ず医師の判断を仰いでください。</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  name: 'タコ',
                  emoji: '🟡',
                  badge: '施術可',
                  badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  cause: '皮膚への過度な圧迫が原因。皮膚が厚く硬くなり、黄色味を帯びた色になり少し盛り上がる。',
                  note: 'タコ・イボの判断に悩む場合は施術をお断りし、医師の判断を仰ぎましょう。',
                  noteColor: 'text-amber-700 bg-amber-50 border-amber-200',
                },
                {
                  name: '魚の目',
                  emoji: '🔵',
                  badge: '施術可',
                  badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  cause: '足裏の突出部・指のふち・指の間に多い。中心に「しん」があり、圧迫されると強い痛みを伴う。',
                  note: '根深く出血リスクがある場合・イボの判断に悩む場合は医師の判断を仰ぎましょう。',
                  noteColor: 'text-amber-700 bg-amber-50 border-amber-200',
                },
                {
                  name: 'イボ',
                  emoji: '🔴',
                  badge: '施術不可',
                  badgeColor: 'bg-red-100 text-red-700 border-red-200',
                  cause: 'ウイルス感染が原因で伝染力が強い。点状に硬く盛り上がる・褐色変化など症状は様々。',
                  note: '必ず医師の判断を仰いでください。施術は行いません。',
                  noteColor: 'text-red-700 bg-red-50 border-red-200',
                },
              ].map(item => (
                <div key={item.name} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-lg font-bold text-foreground">{item.name}</span>
                    <span className={`ml-auto rounded-full border px-2 py-0.5 text-xs font-bold ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{item.cause}</p>
                  <div className={`rounded-lg border p-3 text-xs leading-relaxed ${item.noteColor}`}>
                    ⚠ {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 角質除去の流れ */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Treatment Flow</p>
              <h2 className="text-3xl font-bold text-foreground">角質除去の施術の流れ</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: '角質を柔らかくする',
                  desc: 'キューティクルリムーバーをワイプに染み込ませ、硬くなった角質に浸して柔らかくする。かかとのひび割れで角質が何層にも重なっている場合は、フットパドルで事前に硬い部分を除去してからマシン工程へ。',
                },
                {
                  step: 2,
                  title: 'マシンで角質を除去する',
                  desc: '常にウェットな状態でマシンを使用。推奨回転数は1500〜3000。ビットは押し当て過ぎずチョンチョンと当てては離す（押し当て過ぎると摩擦熱で痛みが出る）。',
                },
                {
                  step: 3,
                  title: 'ビット使用順序',
                  desc: '#80（最も硬い部分・かかと中心）→ #150（かかと以外）→ #240（かかと側面・指の股を念入りに）→ #220（全体）→ #800（仕上げ・全体）',
                },
                {
                  step: 4,
                  title: '保湿・仕上げ',
                  desc: 'ネイルオイルで足裏全体に馴染ませる。クリームまたはローションで保湿して仕上げ。足用パックがある場合は保湿前に使用。',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-5 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 肥厚爪ケア */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Thickened Nail Care</p>
              <h2 className="text-3xl font-bold text-foreground">肥厚爪ケア</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-foreground">肥厚爪の原因</h3>
                <div className="space-y-3">
                  {['靴が合わない', '加齢', '深爪', '爪のケア不足'].map((cause, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                      <span className="text-sm text-foreground">{cause}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  対処はシンプルに「削る」。余分な部分を削り、正常に伸びるよう数回に分けてケアを行います。
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-foreground">来店周期の目安</h3>
                <div className="mb-4 rounded-xl bg-primary p-5 text-center text-white">
                  <p className="text-3xl font-bold">2〜3週間</p>
                  <p className="mt-1 text-sm text-white/80">に1度のペース</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  肥厚が軽減するまで定期的にケアを継続。爪が正常に伸びるよう、期間をあけて数回に分けてケアを行います。
                </p>
              </div>
            </div>

            {/* 施術ステップ */}
            <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground">肥厚爪の施術ステップ（施術者向け）</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  '手指消毒',
                  '水で爪と皮膚の間の角質（老廃物）を洗い流す。隙間がない場合はゾンデで除去',
                  'マシン・ニッパーで肥厚部分を削りながら老廃物を除去',
                  '残った爪の形を整える',
                  '爪のお手入れ',
                  'プレップで表面を拭き取る',
                  'ポリッシュタイプのベースジェルを塗布・30秒硬化',
                  'ポリッシュタイプのクリア/マットジェルを塗布・30秒硬化',
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">※ ポリッシュタイプは強度・厚み目的ではなく保護コーティングが目的です。</p>
            </div>
          </div>
        </section>

        {/* AI診断CTA */}
        <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold">AIでかかとを無料診断</h2>
            <p className="mt-4 text-lg text-white/90">写真をアップロードするだけ。専門知識に基づいたAI診断をお試しください。</p>
            <Link href="/ai-diagnosis" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-md hover:shadow-lg">
              🦶 かかとを診断する
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
