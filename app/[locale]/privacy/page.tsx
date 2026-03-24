import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Locale = 'ja' | 'en' | 'ar';

const content: Record<Locale, {
  title: string;
  updated: string;
  dir: 'ltr' | 'rtl';
  sections: { heading: string; body: React.ReactNode }[];
}> = {
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新日：2025年1月',
    dir: 'ltr',
    sections: [
      {
        heading: '1. 事業者情報',
        body: <p>本サービス「爪整体 AI診断」（以下「本サービス」）は、HaLVision（以下「当社」）が運営します。</p>,
      },
      {
        heading: '2. 取得する情報',
        body: (
          <>
            <p className="mb-2">本サービスでは、以下の情報を取得する場合があります。</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>メールアドレスおよびパスワード（アカウント登録時）</li>
              <li>アップロードされた爪・足裏の画像</li>
              <li>診断に関するアンケート回答（年齢、性別、競技種目、身体の状態等）</li>
              <li>AI診断の結果データ</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
            </ul>
          </>
        ),
      },
      {
        heading: '3. 情報の利用目的',
        body: (
          <>
            <p className="mb-2">取得した情報は、以下の目的で利用します。</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>AI診断サービスの提供および診断精度の向上</li>
              <li>ユーザーアカウントの管理および認証</li>
              <li>診断履歴の保存・閲覧機能の提供</li>
              <li>サービスの改善・研究開発（匿名化した統計データとして利用する場合があります）</li>
              <li>不正アクセスの検知・防止</li>
            </ul>
          </>
        ),
      },
      {
        heading: '4. 第三者への提供',
        body: (
          <>
            <p>当社は、以下の場合を除き、取得した個人情報を第三者に提供しません。</p>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-muted-foreground">
              <li>ユーザー本人の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </>
        ),
      },
      {
        heading: '5. 外部サービスの利用',
        body: (
          <>
            <p className="mb-2">本サービスは以下の外部サービスを利用しており、各サービスのプライバシーポリシーが適用されます。</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>Google LLC（Google Gemini AI）</li>
              <li>Supabase Inc.（データベース・ストレージ）</li>
              <li>Vercel Inc.（ホスティング）</li>
            </ul>
          </>
        ),
      },
      {
        heading: '6. データの保管・削除',
        body: <p>取得したデータはSupabaseのサーバー（AWS）に暗号化して保管します。アカウント削除のご要望は下記お問い合わせ先までご連絡ください。ご要望から30日以内に対応いたします。</p>,
      },
      {
        heading: '7. Cookieの使用',
        body: <p>本サービスはログイン状態の維持のためにCookieを使用します。ブラウザの設定でCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。</p>,
      },
      {
        heading: '8. 未成年者の利用',
        body: <p>16歳未満の方がご利用になる場合は、保護者の同意を得た上でご利用ください。</p>,
      },
      {
        heading: '9. プライバシーポリシーの変更',
        body: <p>本ポリシーは予告なく変更する場合があります。重要な変更がある場合はサービス上でお知らせします。</p>,
      },
      {
        heading: '10. お問い合わせ',
        body: <p>個人情報の開示・訂正・削除等のご要望、またはプライバシーに関するお問い合わせは、サイト内のお問い合わせフォームよりご連絡ください。</p>,
      },
    ],
  },

  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: January 2025',
    dir: 'ltr',
    sections: [
      {
        heading: '1. About Us',
        body: <p>This service &quot;Nail Seitai AI Diagnosis&quot; (hereinafter &quot;the Service&quot;) is operated by HaLVision (hereinafter &quot;we&quot; or &quot;us&quot;).</p>,
      },
      {
        heading: '2. Information We Collect',
        body: (
          <>
            <p className="mb-2">We may collect the following information when you use the Service.</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>Email address and password (at account registration)</li>
              <li>Uploaded images of nails and foot soles</li>
              <li>Survey answers related to diagnosis (age, gender, sport, physical condition, etc.)</li>
              <li>AI diagnosis result data</li>
              <li>Access logs (IP address, browser information, etc.)</li>
            </ul>
          </>
        ),
      },
      {
        heading: '3. How We Use Your Information',
        body: (
          <>
            <p className="mb-2">Collected information is used for the following purposes.</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>Providing and improving the accuracy of the AI diagnosis service</li>
              <li>Managing and authenticating user accounts</li>
              <li>Providing diagnosis history storage and browsing features</li>
              <li>Service improvement and research (may be used as anonymized statistical data)</li>
              <li>Detecting and preventing unauthorized access</li>
            </ul>
          </>
        ),
      },
      {
        heading: '4. Sharing with Third Parties',
        body: (
          <>
            <p>We will not provide collected personal information to third parties except in the following cases.</p>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-muted-foreground">
              <li>When the user has given their consent</li>
              <li>When required by law</li>
              <li>When necessary to protect the life, body, or property of a person</li>
            </ul>
          </>
        ),
      },
      {
        heading: '5. Third-Party Services',
        body: (
          <>
            <p className="mb-2">The Service uses the following third-party services, each subject to their own privacy policies.</p>
            <ul className="ml-4 space-y-1 list-disc text-muted-foreground">
              <li>Google LLC (Google Gemini AI)</li>
              <li>Supabase Inc. (database &amp; storage)</li>
              <li>Vercel Inc. (hosting)</li>
            </ul>
          </>
        ),
      },
      {
        heading: '6. Data Storage & Deletion',
        body: <p>Collected data is stored encrypted on Supabase servers (AWS). To request account deletion, please contact us via the inquiry form. We will process your request within 30 days.</p>,
      },
      {
        heading: '7. Cookies',
        body: <p>The Service uses cookies to maintain your login state. You can disable cookies in your browser settings, but some features may become unavailable.</p>,
      },
      {
        heading: '8. Minors',
        body: <p>If you are under 16 years of age, please obtain parental consent before using the Service.</p>,
      },
      {
        heading: '9. Changes to This Policy',
        body: <p>This policy may be updated without prior notice. We will notify you of significant changes through the Service.</p>,
      },
      {
        heading: '10. Contact',
        body: <p>For requests regarding disclosure, correction, or deletion of personal information, or for privacy-related inquiries, please use the contact form on the site.</p>,
      },
    ],
  },

  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: يناير 2025',
    dir: 'rtl',
    sections: [
      {
        heading: '1. معلومات عنا',
        body: <p>تشغّل HaLVision (المشار إليها فيما يلي بـ «نحن») خدمة «Nail Seitai AI Diagnosis» (المشار إليها فيما يلي بـ «الخدمة»).</p>,
      },
      {
        heading: '2. المعلومات التي نجمعها',
        body: (
          <>
            <p className="mb-2">قد نجمع المعلومات التالية عند استخدامك للخدمة.</p>
            <ul className="mr-4 space-y-1 list-disc text-muted-foreground">
              <li>عنوان البريد الإلكتروني وكلمة المرور (عند تسجيل الحساب)</li>
              <li>الصور المرفوعة للأظافر وباطن القدم</li>
              <li>إجابات الاستبيان المتعلقة بالتشخيص (العمر، الجنس، الرياضة، الحالة البدنية، إلخ)</li>
              <li>بيانات نتائج التشخيص بالذكاء الاصطناعي</li>
              <li>سجلات الوصول (عنوان IP، معلومات المتصفح، إلخ)</li>
            </ul>
          </>
        ),
      },
      {
        heading: '3. كيفية استخدام معلوماتك',
        body: (
          <>
            <p className="mb-2">تُستخدم المعلومات المجمّعة للأغراض التالية.</p>
            <ul className="mr-4 space-y-1 list-disc text-muted-foreground">
              <li>تقديم خدمة التشخيص بالذكاء الاصطناعي وتحسين دقتها</li>
              <li>إدارة حسابات المستخدمين والمصادقة عليها</li>
              <li>توفير ميزات حفظ سجل التشخيص وعرضه</li>
              <li>تحسين الخدمة والبحث والتطوير (قد تُستخدم كبيانات إحصائية مجهولة الهوية)</li>
              <li>اكتشاف الوصول غير المصرح به ومنعه</li>
            </ul>
          </>
        ),
      },
      {
        heading: '4. المشاركة مع أطراف ثالثة',
        body: (
          <>
            <p>لن نقدّم المعلومات الشخصية المجمّعة لأطراف ثالثة إلا في الحالات التالية.</p>
            <ul className="mr-4 mt-2 space-y-1 list-disc text-muted-foreground">
              <li>عند موافقة المستخدم</li>
              <li>عند الاقتضاء القانوني</li>
              <li>عند الضرورة لحماية حياة شخص أو جسده أو ممتلكاته</li>
            </ul>
          </>
        ),
      },
      {
        heading: '5. الخدمات الخارجية',
        body: (
          <>
            <p className="mb-2">تستخدم الخدمة الخدمات الخارجية التالية، وتخضع كل منها لسياسة الخصوصية الخاصة بها.</p>
            <ul className="mr-4 space-y-1 list-disc text-muted-foreground">
              <li>Google LLC (Google Gemini AI)</li>
              <li>Supabase Inc. (قاعدة البيانات والتخزين)</li>
              <li>Vercel Inc. (الاستضافة)</li>
            </ul>
          </>
        ),
      },
      {
        heading: '6. تخزين البيانات وحذفها',
        body: <p>تُخزَّن البيانات المجمّعة مشفَّرة على خوادم Supabase (AWS). لطلب حذف الحساب، يُرجى التواصل معنا عبر نموذج الاستفسار. سنعالج طلبك في غضون 30 يومًا.</p>,
      },
      {
        heading: '7. ملفات تعريف الارتباط (Cookies)',
        body: <p>تستخدم الخدمة ملفات تعريف الارتباط للحفاظ على حالة تسجيل الدخول. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح، لكن قد تصبح بعض الميزات غير متاحة.</p>,
      },
      {
        heading: '8. القاصرون',
        body: <p>إذا كنت دون السادسة عشرة من العمر، يُرجى الحصول على موافقة وليّ الأمر قبل استخدام الخدمة.</p>,
      },
      {
        heading: '9. التغييرات على هذه السياسة',
        body: <p>قد يتم تحديث هذه السياسة دون إشعار مسبق. سنُعلمك بالتغييرات الجوهرية من خلال الخدمة.</p>,
      },
      {
        heading: '10. التواصل معنا',
        body: <p>للاستفسار عن الإفصاح أو تصحيح أو حذف المعلومات الشخصية، أو لأي استفسارات تتعلق بالخصوصية، يُرجى استخدام نموذج التواصل على الموقع.</p>,
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = (locale === 'en' || locale === 'ar') ? locale : 'ja';
  const c = content[lang];

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm" dir={c.dir}>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{c.title}</h1>
            <p className="mb-8 text-sm text-muted-foreground">{c.updated}</p>

            <div className="space-y-8 text-sm leading-relaxed text-foreground">
              {c.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="mb-3 text-lg font-bold">{s.heading}</h2>
                  <div className="text-muted-foreground">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
