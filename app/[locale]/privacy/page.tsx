import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-foreground">プライバシーポリシー</h1>
            <p className="mb-8 text-sm text-muted-foreground">最終更新日：2026年3月23日</p>

            <Section title="1. はじめに">
              <p>
                爪整体AI（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の適切な保護に努めます。
                本ポリシーは、本サービスが収集する情報の種類、利用目的、管理方法について説明するものです。
              </p>
            </Section>

            <Section title="2. 収集する情報">
              <Subsection title="2-1. アカウント情報">
                <p>Googleアカウントまたはメール・パスワードでログインいただく場合、以下の情報を取得します。</p>
                <ul>
                  <li>メールアドレス</li>
                  <li>表示名（Googleログインの場合）</li>
                  <li>ログイン日時</li>
                </ul>
              </Subsection>
              <Subsection title="2-2. 診断データ">
                <p>AI診断を利用した場合、以下のデータを収集・保存します。</p>
                <ul>
                  <li>アップロードされた画像（爪・足裏）</li>
                  <li>問診アンケートの回答（年齢・競技・身体状態など）</li>
                  <li>AI診断結果（スコア・所見・推奨事項）</li>
                  <li>チャット問診のメッセージログ</li>
                </ul>
                <p className="mt-2">
                  ログインしていない場合、診断データは匿名で保存され、ユーザーアカウントとは紐付けられません。
                </p>
              </Subsection>
              <Subsection title="2-3. 自動収集情報">
                <p>本サービスへのアクセスに際し、以下の情報が自動的に収集される場合があります。</p>
                <ul>
                  <li>IPアドレス</li>
                  <li>ブラウザの種類・バージョン</li>
                  <li>アクセス日時</li>
                  <li>参照元URL</li>
                </ul>
              </Subsection>
            </Section>

            <Section title="3. 情報の利用目的">
              <p>収集した情報は以下の目的のみに利用します。</p>
              <ul>
                <li>AI診断サービスの提供・改善</li>
                <li>診断履歴の管理・表示</li>
                <li>サービスの品質向上・研究開発（匿名化処理後）</li>
                <li>お問い合わせへの対応</li>
                <li>不正利用の防止</li>
              </ul>
              <p className="mt-2">
                収集した個人情報を、ユーザーの同意なく第三者に販売・提供することはありません。
              </p>
            </Section>

            <Section title="4. 画像データの取り扱い">
              <p>
                アップロードされた画像はAI診断の実行に使用され、診断結果とともにデータベースに保存されます。
                保存された画像は、サービス改善・AI学習の目的で利用される場合がありますが、その際は個人を特定できない形で処理します。
              </p>
              <p className="mt-2">
                アカウント削除を希望する場合、保存されたデータの削除をお問い合わせフォームよりご依頼いただけます。
              </p>
            </Section>

            <Section title="5. 第三者サービスの利用">
              <p>本サービスは以下の第三者サービスを利用しており、それぞれのプライバシーポリシーが適用されます。</p>
              <ul>
                <li><strong>Supabase</strong>（データベース・認証）— <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">supabase.com/privacy</a></li>
                <li><strong>Google Gemini API</strong>（AI診断）— <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">policies.google.com/privacy</a></li>
                <li><strong>Vercel</strong>（ホスティング）— <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline">vercel.com/legal/privacy-policy</a></li>
              </ul>
            </Section>

            <Section title="6. Cookie の使用">
              <p>
                本サービスはセッション管理のためにCookieを使用します。
                ブラウザの設定によりCookieを無効にすることも可能ですが、その場合ログイン状態の維持などの機能が正常に動作しない場合があります。
              </p>
            </Section>

            <Section title="7. セキュリティ">
              <p>
                個人情報の保護のため、SSL/TLS暗号化通信を採用し、データへのアクセスは認証されたシステムのみに限定しています。
                ただし、インターネット上のいかなる通信・保存方法も100%安全であるとは保証できません。
              </p>
            </Section>

            <Section title="8. 未成年者の利用">
              <p>
                本サービスは13歳未満の方の利用を想定していません。
                13歳未満のお子様が個人情報を提供していることが判明した場合、速やかに削除いたします。
              </p>
            </Section>

            <Section title="9. ポリシーの変更">
              <p>
                本ポリシーは予告なく変更される場合があります。
                重要な変更がある場合は、本ページにて更新日を明示します。
                変更後も継続して本サービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。
              </p>
            </Section>

            <Section title="10. お問い合わせ">
              <p>
                個人情報の取り扱いに関するご質問・削除依頼は、<a href="/ja/contact" className="text-primary underline">お問い合わせフォーム</a>よりご連絡ください。
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
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-1 text-sm leading-relaxed text-muted-foreground [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">{children}</div>
    </div>
  );
}
