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
    title: '利用規約',
    updated: '最終更新日：2026年3月23日',
    dir: 'ltr',
    sections: [
      {
        heading: '第1条（適用）',
        body: (
          <p>
            本規約は、爪整体AI（以下「本サービス」）が提供するすべてのサービスの利用に関し、
            本サービスとユーザーとの間の権利義務関係を定めるものです。
            本サービスをご利用いただくことで、本規約に同意したものとみなします。
          </p>
        ),
      },
      {
        heading: '第2条（定義）',
        body: (
          <ul>
            <li><strong>「本サービス」</strong>とは、爪整体AIが運営するAI爪診断・足裏診断サービスおよびそれに付随する機能を指します。</li>
            <li><strong>「ユーザー」</strong>とは、本サービスを利用するすべての方を指します。</li>
            <li><strong>「診断結果」</strong>とは、AIが提供する爪・足裏の状態に関する分析・スコア・推奨事項を指します。</li>
          </ul>
        ),
      },
      {
        heading: '第3条（アカウント）',
        body: (
          <>
            <p>
              診断履歴の保存・マイページ機能の利用にはアカウント登録が必要です。
              ユーザーは自己の責任でアカウントを管理し、第三者によるアカウントの不正利用について、
              本サービスは責任を負いません。
            </p>
            <p className="mt-2">以下に該当するユーザーは登録できません。</p>
            <ul>
              <li>過去に本規約に違反してアカウントを削除された方</li>
              <li>虚偽の情報を登録した方</li>
              <li>13歳未満の方</li>
            </ul>
          </>
        ),
      },
      {
        heading: '第4条（サービスの性質・免責事項）',
        body: (
          <>
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
          </>
        ),
      },
      {
        heading: '第5条（禁止事項）',
        body: (
          <>
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
          </>
        ),
      },
      {
        heading: '第6条（知的財産権）',
        body: (
          <>
            <p>
              本サービス上のコンテンツ（テキスト・画像・UI・AIロジック等）に関する著作権その他の知的財産権は、
              本サービスまたは正当な権利者に帰属します。
              ユーザーは、本サービスの利用に必要な範囲を超えてこれらを複製・転載・改変することはできません。
            </p>
            <p className="mt-2">
              ユーザーがアップロードした画像の著作権はユーザーに帰属します。
              ただし、ユーザーは本サービスがAI改善・研究目的で当該データを匿名化して利用することに同意するものとします。
            </p>
          </>
        ),
      },
      {
        heading: '第7条（サービスの変更・停止）',
        body: (
          <p>
            本サービスは、予告なくサービス内容の変更・停止・終了を行う場合があります。
            これによりユーザーに生じた損害について、本サービスは責任を負いません。
          </p>
        ),
      },
      {
        heading: '第8条（個人情報の取り扱い）',
        body: (
          <p>
            ユーザーの個人情報の取り扱いについては、
            <a href="./privacy" className="text-primary underline">プライバシーポリシー</a>に定めるとおりとします。
          </p>
        ),
      },
      {
        heading: '第9条（退会・アカウント削除）',
        body: (
          <>
            <p>
              ユーザーはいつでも退会することができます。
              退会に際してはお問い合わせフォームよりご連絡ください。
              退会後、保存されたデータの取り扱いはプライバシーポリシーに従います。
            </p>
            <p className="mt-2">
              ユーザーが禁止事項に違反した場合、本サービスは予告なくアカウントを停止・削除できるものとします。
            </p>
          </>
        ),
      },
      {
        heading: '第10条（準拠法・管轄裁判所）',
        body: (
          <p>
            本規約の解釈・適用は日本法に準拠します。
            本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        ),
      },
      {
        heading: '第11条（規約の変更）',
        body: (
          <p>
            本規約は予告なく変更される場合があります。
            変更後の規約は本ページに掲示した時点で効力を生じ、変更後も継続して本サービスを利用したユーザーは、
            変更後の規約に同意したものとみなします。
          </p>
        ),
      },
      {
        heading: 'お問い合わせ',
        body: (
          <p>
            本規約に関するご質問は<a href="./contact" className="text-primary underline">お問い合わせフォーム</a>よりご連絡ください。
          </p>
        ),
      },
    ],
  },

  en: {
    title: 'Terms of Service',
    updated: 'Last updated: March 23, 2026',
    dir: 'ltr',
    sections: [
      {
        heading: 'Article 1 (Application)',
        body: (
          <p>
            These Terms of Service govern the rights and obligations between the Service and its users
            regarding the use of all services provided by Nail Seitai AI (hereinafter &quot;the Service&quot;).
            By using the Service, you are deemed to have agreed to these Terms.
          </p>
        ),
      },
      {
        heading: 'Article 2 (Definitions)',
        body: (
          <ul>
            <li><strong>&quot;The Service&quot;</strong> refers to the AI nail and foot sole diagnosis service operated by Nail Seitai AI, and all associated features.</li>
            <li><strong>&quot;User&quot;</strong> refers to any person who uses the Service.</li>
            <li><strong>&quot;Diagnosis Results&quot;</strong> refers to the AI-generated analysis, scores, and recommendations regarding the condition of nails and foot soles.</li>
          </ul>
        ),
      },
      {
        heading: 'Article 3 (Accounts)',
        body: (
          <>
            <p>
              An account registration is required to save diagnosis history and use the My Page feature.
              Users are responsible for managing their own accounts. The Service is not liable for
              unauthorized use of an account by a third party.
            </p>
            <p className="mt-2">The following users may not register.</p>
            <ul>
              <li>Those who previously had their account deleted due to violation of these Terms</li>
              <li>Those who provided false information</li>
              <li>Those under 13 years of age</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'Article 4 (Nature of the Service / Disclaimer)',
        body: (
          <>
            <p className="font-semibold text-foreground">
              Diagnosis results provided by the Service are not a substitute for medical treatment or diagnosis by a physician.
            </p>
            <p className="mt-2">
              The Service is intended to provide reference information via AI. Please agree to the following before use.
            </p>
            <ul>
              <li>Diagnosis results must not be used as the basis for medical diagnosis or treatment</li>
              <li>For medical issues related to nails or feet, please consult a physician or specialist</li>
              <li>The accuracy or completeness of diagnosis results is not guaranteed</li>
              <li>The Service is not liable for any damages arising from the use of the Service</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'Article 5 (Prohibited Activities)',
        body: (
          <>
            <p>Users must not engage in the following activities.</p>
            <ul>
              <li>Acts that violate laws or public order and morals</li>
              <li>Uploading images of another person&apos;s nails or body without their consent</li>
              <li>Placing excessive load on the Service&apos;s systems</li>
              <li>Attempting to unauthorized access or tamper with the Service</li>
              <li>Unauthorized commercial use of information obtained through the Service</li>
              <li>Entering or registering false information</li>
              <li>Any other act that interferes with the operation of the Service</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'Article 6 (Intellectual Property)',
        body: (
          <>
            <p>
              Copyright and other intellectual property rights in content on the Service
              (text, images, UI, AI logic, etc.) belong to the Service or rightful owners.
              Users may not reproduce, repost, or modify such content beyond what is necessary for using the Service.
            </p>
            <p className="mt-2">
              Copyright in images uploaded by users belongs to the users.
              However, users agree that the Service may use such data in anonymized form for AI improvement and research purposes.
            </p>
          </>
        ),
      },
      {
        heading: 'Article 7 (Changes / Suspension of the Service)',
        body: (
          <p>
            The Service may change, suspend, or terminate its content without prior notice.
            The Service is not liable for any damages incurred by users as a result.
          </p>
        ),
      },
      {
        heading: 'Article 8 (Handling of Personal Information)',
        body: (
          <p>
            The handling of users&apos; personal information is as set forth in the{' '}
            <a href="./privacy" className="text-primary underline">Privacy Policy</a>.
          </p>
        ),
      },
      {
        heading: 'Article 9 (Withdrawal / Account Deletion)',
        body: (
          <>
            <p>
              Users may withdraw at any time. Please contact us via the inquiry form to withdraw.
              After withdrawal, stored data will be handled in accordance with the Privacy Policy.
            </p>
            <p className="mt-2">
              If a user violates these Terms, the Service may suspend or delete the account without prior notice.
            </p>
          </>
        ),
      },
      {
        heading: 'Article 10 (Governing Law / Jurisdiction)',
        body: (
          <p>
            These Terms shall be interpreted and applied in accordance with Japanese law.
            The Tokyo District Court shall be the exclusive court of first instance for disputes
            relating to the Service.
          </p>
        ),
      },
      {
        heading: 'Article 11 (Changes to Terms)',
        body: (
          <p>
            These Terms may be changed without prior notice. Changes take effect when posted on this page.
            Users who continue to use the Service after changes are deemed to have agreed to the revised Terms.
          </p>
        ),
      },
      {
        heading: 'Contact',
        body: (
          <p>
            For questions about these Terms, please use the <a href="./contact" className="text-primary underline">contact form</a>.
          </p>
        ),
      },
    ],
  },

  ar: {
    title: 'شروط الخدمة',
    updated: 'آخر تحديث: 23 مارس 2026',
    dir: 'rtl',
    sections: [
      {
        heading: 'المادة 1 (التطبيق)',
        body: (
          <p>
            تُحدِّد هذه الشروط الحقوقَ والالتزاماتِ بين الخدمة ومستخدميها فيما يتعلق باستخدام جميع الخدمات التي تقدمها
            Nail Seitai AI (المشار إليها فيما يلي بـ «الخدمة»).
            باستخدامك للخدمة، يُعدّ ذلك موافقةً منك على هذه الشروط.
          </p>
        ),
      },
      {
        heading: 'المادة 2 (التعريفات)',
        body: (
          <ul>
            <li><strong>«الخدمة»</strong> تشير إلى خدمة تشخيص الأظافر وباطن القدم بالذكاء الاصطناعي التي تشغّلها Nail Seitai AI وجميع الميزات المرتبطة بها.</li>
            <li><strong>«المستخدم»</strong> يشير إلى أي شخص يستخدم الخدمة.</li>
            <li><strong>«نتائج التشخيص»</strong> تشير إلى التحليلات والنتائج والتوصيات التي يُنشئها الذكاء الاصطناعي بشأن حالة الأظافر وباطن القدم.</li>
          </ul>
        ),
      },
      {
        heading: 'المادة 3 (الحسابات)',
        body: (
          <>
            <p>
              يُشترط تسجيل حساب لحفظ سجل التشخيص واستخدام ميزة صفحتي. يتحمّل المستخدمون مسؤولية إدارة حساباتهم الخاصة،
              ولا تتحمّل الخدمة أي مسؤولية عن الاستخدام غير المصرح به من قِبَل طرف ثالث.
            </p>
            <p className="mt-2">لا يحق للمستخدمين التاليين التسجيل.</p>
            <ul>
              <li>من سبق حذف حسابهم بسبب انتهاك هذه الشروط</li>
              <li>من قدّموا معلومات كاذبة</li>
              <li>من هم دون سن الثالثة عشرة</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'المادة 4 (طبيعة الخدمة / إخلاء المسؤولية)',
        body: (
          <>
            <p className="font-semibold text-foreground">
              نتائج التشخيص المقدَّمة من الخدمة ليست بديلاً عن العلاج الطبي أو التشخيص الصادر من طبيب.
            </p>
            <p className="mt-2">
              تهدف الخدمة إلى تقديم معلومات مرجعية عبر الذكاء الاصطناعي. يُرجى الموافقة على ما يلي قبل الاستخدام.
            </p>
            <ul>
              <li>يجب عدم استخدام نتائج التشخيص أساسًا للتشخيص أو العلاج الطبي</li>
              <li>للمشكلات الطبية المتعلقة بالأظافر أو القدمين، يُرجى استشارة طبيب أو متخصص</li>
              <li>لا تُضمَن دقة نتائج التشخيص أو اكتمالها</li>
              <li>لا تتحمّل الخدمة المسؤولية عن أي أضرار تنشأ عن استخدام الخدمة</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'المادة 5 (الأنشطة المحظورة)',
        body: (
          <>
            <p>يجب على المستخدمين عدم الانخراط في الأنشطة التالية.</p>
            <ul>
              <li>الأفعال التي تنتهك القوانين أو النظام العام والآداب العامة</li>
              <li>رفع صور أظافر أو جسد شخص آخر دون موافقته</li>
              <li>إلحاق حمل زائد على أنظمة الخدمة</li>
              <li>محاولة الوصول غير المصرح به أو التلاعب بالخدمة</li>
              <li>الاستخدام التجاري غير المصرح به للمعلومات المكتسبة عبر الخدمة</li>
              <li>إدخال أو تسجيل معلومات كاذبة</li>
              <li>أي فعل آخر يتعارض مع تشغيل الخدمة</li>
            </ul>
          </>
        ),
      },
      {
        heading: 'المادة 6 (الملكية الفكرية)',
        body: (
          <>
            <p>
              تعود حقوق التأليف والنشر وحقوق الملكية الفكرية الأخرى في محتوى الخدمة
              (النصوص والصور وواجهة المستخدم ومنطق الذكاء الاصطناعي وما إلى ذلك) إلى الخدمة أو أصحاب الحقوق الشرعيين.
              لا يجوز للمستخدمين استنساخ هذا المحتوى أو إعادة نشره أو تعديله بما يتجاوز ما هو ضروري لاستخدام الخدمة.
            </p>
            <p className="mt-2">
              تعود حقوق التأليف والنشر في الصور التي يرفعها المستخدمون إلى المستخدمين أنفسهم.
              غير أن المستخدمين يوافقون على أن تستخدم الخدمة هذه البيانات بصورة مجهولة الهوية لأغراض تحسين الذكاء الاصطناعي والبحث.
            </p>
          </>
        ),
      },
      {
        heading: 'المادة 7 (التغييرات / تعليق الخدمة)',
        body: (
          <p>
            قد تُغيِّر الخدمة محتواها أو تعلّقه أو تُنهيه دون إشعار مسبق.
            لا تتحمّل الخدمة المسؤولية عن أي أضرار يتكبّدها المستخدمون نتيجةً لذلك.
          </p>
        ),
      },
      {
        heading: 'المادة 8 (التعامل مع المعلومات الشخصية)',
        body: (
          <p>
            يخضع التعامل مع المعلومات الشخصية للمستخدمين لما هو منصوص عليه في{' '}
            <a href="./privacy" className="text-primary underline">سياسة الخصوصية</a>.
          </p>
        ),
      },
      {
        heading: 'المادة 9 (الانسحاب / حذف الحساب)',
        body: (
          <>
            <p>
              يمكن للمستخدمين الانسحاب في أي وقت. يُرجى التواصل معنا عبر نموذج الاستفسار للانسحاب.
              بعد الانسحاب، ستُعالَج البيانات المحفوظة وفقًا لسياسة الخصوصية.
            </p>
            <p className="mt-2">
              إذا انتهك مستخدم هذه الشروط، يحق للخدمة تعليق الحساب أو حذفه دون إشعار مسبق.
            </p>
          </>
        ),
      },
      {
        heading: 'المادة 10 (القانون الحاكم / الاختصاص القضائي)',
        body: (
          <p>
            تُفسَّر هذه الشروط وتُطبَّق وفقًا للقانون الياباني.
            يكون محكمة طوكيو المحلية الجهةَ القضائية الحصرية للنظر في النزاعات المتعلقة بالخدمة في الدرجة الأولى.
          </p>
        ),
      },
      {
        heading: 'المادة 11 (تغييرات الشروط)',
        body: (
          <p>
            قد تتغيّر هذه الشروط دون إشعار مسبق. تسري التغييرات عند نشرها على هذه الصفحة.
            يُعدّ المستخدمون الذين يواصلون استخدام الخدمة بعد التغييرات موافقين على الشروط المحدَّثة.
          </p>
        ),
      },
      {
        heading: 'التواصل معنا',
        body: (
          <p>
            للاستفسار عن هذه الشروط، يُرجى استخدام <a href="./contact" className="text-primary underline">نموذج التواصل</a>.
          </p>
        ),
      },
    ],
  },
};

export default async function TermsPage({
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
          <div
            className="rounded-xl border border-border bg-white p-8 shadow-sm"
            dir={c.dir}
          >
            <h1 className="mb-2 text-2xl font-bold text-foreground">{c.title}</h1>
            <p className="mb-8 text-sm text-muted-foreground">{c.updated}</p>

            {c.sections.map((s) => (
              <section key={s.heading} className="mb-8">
                <h2 className="mb-3 text-base font-bold text-foreground border-b border-border pb-2">
                  {s.heading}
                </h2>
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:rtl:pr-5 [&_ul]:rtl:pl-0">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
