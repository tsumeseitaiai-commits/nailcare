import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-foreground">利用規約</h1>
            <p className="mb-8 text-sm text-muted-foreground">最終更新日：2026年3月23日</p>

            <Section title="第1条（適用）">
              <p>
                本規約は、爪整体AI（以下「本サービス」）が提供するすべてのサービスの利用に関し、
                本サービスとユーザーとの間の権利義務関係を定めるものです。
                本サービスをご利用いただくことで、本規約に同意したものとみなします。
              </p>
            </Section>

            <Section title="第2条（定義）">
              <ul>
                <li><strong>「本サービス」</strong>とは、爪整体AIが運営するAI爪診断・足裏診断サービスおよびそれに付随する機能を指します。</li>
                <li><strong>「ユーザー」</strong>とは、本サービスを利用するすべての方を指します。</li>
                <li><strong>「診断結果」</strong>とは、AIが提供する爪・足裏の状態に関する分析・スコア・推奨事項を指します。</li>
              </ul>
            </Section>

            <Section title="第3条（アカウント）">
              <p>
                診断履歴の保存・マイページ機能の利用にはアカウント登録が必要です。
                ユーザーは自己の責任でアカウントを管理し、第三者によるアカウントの不正利用について、
                本サービスは責任を負いません。
              </p>
              <p className="mt-2">
                以下に該当するユーザーは登録できません。
              </p>
              <ul>
                <li>過去に本規約に違反してアカウントを削除された方</li>
                <li>虚偽の情報を登録した方</li>
                <li>13歳未満の方</li>
              </ul>
            </Section>

            <Section title="第4条（サービスの性質・免責事項）">
              <p className="font-semibold text-foreground">
                本サービスが提供する診断結果は、医療行為・医師による診断の代替ではありません。
              </p>
              <p className="mt-2">
                本サービスはAIによる参考情報の提供を目的としており、以下の点について同意の上ご利用ください。
              </p>
              <ul>
                <li>診断結果は医学的診断・治療の根拠として使用しないこと</li>
                <li>爪・足裏に関する医療上の問題は、医師・専門家にご相談ください</li>
                <li>診断結果の正確性・完全性を保証するものではありません</li>
                <li>本サービスの利用により生じた損害について、本サービスは責任を負いません</li>
              </ul>
            </Section>

            <Section title="第5条（禁止事項）">
              <p>ユーザーは以下の行為を行ってはなりません。</p>
              <ul>
                <li>法令または公序良俗に反する行為</li>
                <li>他者の爪・身体画像を本人の同意なくアップロードする行為</li>
                <li>本サービスのシステムに過度な負荷をかける行為</li>
                <li>本サービスを不正にアクセスまたは改ざんしようとする行為</li>
                <li>本サービスを通じて取得した情報を商業目的で無断使用する行為</li>
                <li>虚偽の情報を入力・登録する行為</li>
                <li>その他、本サービスの運営を妨害する行為</li>
              </ul>
            </Section>

            <Section title="第6条（知的財産権）">
              <p>
                本サービス上のコンテンツ（テキスト・画像・UI・AIロジック等）に関する著作権その他の知的財産権は、
                本サービスまたは正当な権利者に帰属します。
                ユーザーは、本サービスの利用に必要な範囲を超えてこれらを複製・転載・改変することはできません。
              </p>
              <p className="mt-2">
                ユーザーがアップロードした画像の著作権はユーザーに帰属します。
                ただし、ユーザーは本サービスがAI改善・研究目的で当該データを匿名化して利用することに同意するものとします。
              </p>
            </Section>

            <Section title="第7条（サービスの変更・停止）">
              <p>
                本サービスは、予告なくサービス内容の変更・停止・終了を行う場合があります。
                これによりユーザーに生じた損害について、本サービスは責任を負いません。
              </p>
            </Section>

            <Section title="第8条（個人情報の取り扱い）">
              <p>
                ユーザーの個人情報の取り扱いについては、
                <a href="/ja/privacy" className="text-primary underline">プライバシーポリシー</a>に定めるとおりとします。
              </p>
            </Section>

            <Section title="第9条（退会・アカウント削除）">
              <p>
                ユーザーはいつでも退会することができます。
                退会に際してはお問い合わせフォームよりご連絡ください。
                退会後、保存されたデータの取り扱いはプライバシーポリシーに従います。
              </p>
              <p className="mt-2">
                ユーザーが禁止事項に違反した場合、本サービスは予告なくアカウントを停止・削除できるものとします。
              </p>
            </Section>

            <Section title="第10条（準拠法・管轄裁判所）">
              <p>
                本規約の解釈・適用は日本法に準拠します。
                本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </Section>

            <Section title="第11条（規約の変更）">
              <p>
                本規約は予告なく変更される場合があります。
                変更後の規約は本ページに掲示した時点で効力を生じ、変更後も継続して本サービスを利用したユーザーは、
                変更後の規約に同意したものとみなします。
              </p>
            </Section>

            <Section title="お問い合わせ">
              <p>
                本規約に関するご質問は<a href="/ja/contact" className="text-primary underline">お問い合わせフォーム</a>よりご連絡ください。
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-base font-bold text-foreground border-b border-border pb-2">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">{children}</div>
    </section>
  );
}
