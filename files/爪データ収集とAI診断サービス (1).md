# **AI画像診断を用いた爪疾患スクリーニングおよびパーソナライズドケア支援システムの構築に関する包括的研究報告**

## **1\. 序論：全身疾患のバイオマーカーとしての爪と人工知能の融合**

皮膚の付属器である爪は、指先を保護し指の運動機能を補助する物理的な役割を果たすだけでなく、患者の全身的な健康状態、栄養状態、および潜在的な病理を示す極めて重要なバイオマーカーとして機能する。爪の形態的、色彩的、および構造的な変化や異常は、単純な物理的損傷や局所的な真菌感染にとどまらず、糖尿病、乾癬、貧血、心血管系疾患、さらには悪性黒色腫（末端黒子型黒色腫）などの重大な全身性疾患や腫瘍性疾患の初期兆候を反映していることが臨床的に広く認知されている1。しかしながら、これら爪疾患の初期症状は極めて微細であり、一般患者による自己判断が困難であるだけでなく、皮膚科専門医であっても視診のみによる確定診断には限界が伴うのが実情である。

このような医学的および社会的な背景から、深層学習（ディープラーニング）をはじめとする人工知能（AI）技術を活用し、スマートフォンやデジタルカメラで撮影された画像から非侵襲的かつ自動的に爪疾患を分類・診断するシステムの開発が急務となっている。近年、AIを用いたシステムは、画像内の微細な色調変化やテクスチャの異常を定量的に分析することで、末端黒子型黒色腫の識別、乾癬の重症度スコアリングの自動化、爪郭毛細血管顕微鏡検査（カピラロスコピー）を通じた結合組織疾患の診断補助など、多岐にわたる領域で顕著な成果を上げている3。さらに、AIはリモートケア、治療のモニタリング、そして患者に対する個別の治療計画と教育を提供するツールとしての可能性を秘めている3。

本報告書は、爪の画像をAIで診断し、巻き爪（陥入爪）、深爪、爪白癬などの症状を検出した上で、適切な治療法や日常的な予防ケアのアドバイスを提供する包括的なデジタルヘルスサービスの構築に向けた網羅的な研究報告である。システムを実用化するために不可欠となる爪の画像と症状データの収集戦略、主要なオープンソースデータセットの比較とライセンス評価、最先端の深層学習アーキテクチャの選定、および日本皮膚科学会等の臨床ガイドラインに基づく医学的根拠を伴ったケアアドバイスの体系化について、多角的な視点から詳細な分析と洞察を提供する。

## **2\. 爪疾患画像データセットの網羅的解析と調達戦略**

AIモデル、特に畳み込みニューラルネットワーク（CNN）やVision Transformer（ViT）の汎化性能と診断精度は、モデルの学習に用いるデータセットの量、質、および多様性に直接的に依存する。高精度な診断システムを構築するためには、様々な症状、進行度、照明条件、撮影角度、およびスキンタイプ（肌の色）を含む大規模なデータセットが不可欠である。オープンソースとして公開されている主要なデータセット群を分析した結果、学術的なベンチマークとしては極めて優秀なデータソースが複数存在する一方で、商用サービスの構築においてはライセンス条項、特に営利目的利用の可否に関する制限が最大の障壁となることが明らかになった。

### **主要な公開データセットの特性とライセンスの比較**

現在、Kaggle、Figshare、GitHubなどの主要なデータ共有プラットフォームにおいて、複数の研究機関や個人が爪疾患画像データセットを公開している。これらのデータセットは、含まれる疾患クラス、画像解像度、注釈（アノテーション）の粒度、および法的な利用許諾の面で明確な差異を有している。以下の表は、本研究で調査した主要なオープンソースデータセットの特性を要約したものである。

| データセット名・提供者 | プラットフォーム | 画像数規模 | 対象とする主な疾患・カテゴリ | ライセンス条項 | 商用利用の可否 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Model Onychomycosis Datasets (S. S. Han) | Figshare | 約49,567枚 | 爪白癬、爪甲ジストロフィー、爪甲剥離症、黒色爪、正常、その他（陥入爪・深爪等含む） | CC BY 4.0 | 可能 |
| Virtual E Dataset (S. S. Han) | Figshare | 3,317枚 | 上記と同様の6クラス（Webクローリング画像から抽出） | CC BY 4.0 | 可能 |
| Nail Disease Detection Dataset (N. Gurav) | Kaggle | 3,835枚 | 悪性黒色腫、健康な爪、爪甲鈎彎症、ブルーフィンガー、ばち指、陥凹（Pitting） | CC BY-NC-SA 4.0 | 不可（非営利のみ） |
| Nail Disease Image Classification Dataset (J. Rasanjana) | Kaggle | 不明 | 各種爪疾患（真菌感染症、爪囲炎、乾癬など） | CC BY-NC-ND 4.0 | 不可（非営利のみ） |
| Nails Segmentation Dataset (A. Akdogan) | GitHub | 小規模 | セグメンテーション用（800x800ピクセルにリサイズ済） | 不明 | 要確認 |
| Lim / Han Clinical Nail Datasets | 臨床研究 | 6,673枚 | 爪白癬、正常爪、爪下出血、爪囲炎、爪下線維腫、陥入爪、ピンサーネイル等 | 非公開（一部Figshare） | 該当部分のみ可能 |

Kaggle上でNikhil Gurav氏によって公開されている「Nail Disease Detection Dataset」は、3,835枚のJPEG画像を含み、6つのクラス（Acral Lentiginous Melanoma: 末端黒子型黒色腫、Healthy Nail: 正常な爪、Onychogryphosis: 爪甲鈎彎症、Blue Finger: チアノーゼや血流障害を示すブルーフィンガー、Clubbing: ばち指、Pitting: 乾癬などに特有の点状陥凹）に分類されている4。このデータセットは医療画像分析、初期検出ツールの開発、分類モデルの訓練と評価、および医学生や研究者向けの教育リソースとして最適化されている4。しかしながら、このデータセットのライセンスは「CC BY-NC-SA 4.0（クリエイティブ・コモンズ 表示 \- 非営利 \- 継承 4.0 国際）」に設定されており、営利目的の診断・アドバイスサービスに直接組み込んで利用することは法的に禁じられている4。

同様に、Joseph Rasanjana氏が提供する「Nail Disease Image Classification Dataset」は、真菌感染症、爪囲炎、乾癬を含む様々な爪疾患を対象とした包括的な画像コレクションであるが、ライセンスが「CC BY-NC-ND 4.0（クリエイティブ・コモンズ 表示 \- 非営利 \- 改変禁止 4.0 国際）」に指定されているため、商用利用が制限されているだけでなく、データセットの改変（例えば、独自の画像補正や合成データの生成など）をも行うことができないという厳しい制約がある7。さらに、Antoni Grecki氏によるImageNetを利用した転移学習プロジェクトにおいても、カンジダ性真菌感染症、表在性白色真菌症、非感染性病変、乾癬、黒色腫などを区別する堅牢な分類器の開発が目標とされているが、これらKaggle発のプロジェクト群は総じて商用サービスへの適用にはライセンスの壁が立ちはだかっている10。

### **商用サービス構築におけるオープンデータ戦略とFigshareデータセットの優位性**

上述の非営利ライセンスの制約を踏まえると、商用前提のサービスにおいて直接的に利用可能なデータ基盤として、Seung Seog Han氏らによってFigshare上で公開されている「Model Onychomycosis」関連データセット群が極めて高い戦略的価値を持つ。この研究プロジェクトは、Faster R-CNN（Region-based Convolutional Neural Network）を用いて生成された49,567枚の爪画像（JPGサムネイル）からなる巨大な訓練データセット（グループA1およびA2）を提供している11。

このデータセットの構成を詳細に分析すると、A1データセットは韓国のアサン医療センターにおいて収集された臨床画像から構成され、画像所見およびカルテレビューによる臨床診断に基づいて分類された49,567枚の画像を含んでいる12。A2データセットは、純粋に臨床診断のみで検証された3,741枚の画像を含む12。さらに、検証用データセットとして提供されているグループB1、B2、C、Dは、インジェ大学、ハリム大学、ソウル国立大学などの複数医療機関から提供された計1,358枚の高解像度画像を含み、真菌培養試験やKOH（水酸化カリウム）直接鏡検、あるいは薬剤（抗真菌薬やトリアムシノロンアセトニド局所注射）への反応性といった厳格な医学的根拠に基づいて診断が裏付けられている12。

このデータセットが本サービスにおいて決定的な重要性を持つ理由は、ライセンスが「CC BY 4.0（クリエイティブ・コモンズ 表示 4.0 国際）」で提供されており、原著作者の適切なクレジット表記さえ行えば、営利目的での利用、再配布、および改変が法的に許容されている点にある12。データセットのカテゴリは、主として爪白癬（Onychomycosis）、爪甲ジストロフィー（Nail dystrophy）、爪甲剥離症（Onycholysis）、黒色爪（Melanonychia）、正常な爪（Normal）に分類されているが、本サービスの主要なターゲットである巻き爪や深爪に関連する症状は「その他（Others）」のカテゴリに包含されている12。具体的には、「その他」のカテゴリ内に、爪下出血、慢性・急性爪囲炎、爪下線維腫、陥入爪（Ingrown nail）、ピンサーネイル（Pincer nail）、爪囲疣贅などの多様な疾患が含まれており13、これらの画像を抽出・再分類することで、独自の巻き爪・深爪検出モデルを構築するための強固な初期データ基盤とすることが可能である。

### **半教師あり学習とデータクローリングの実践的アプローチ**

ユーザーが構想する「爪の画像と症状をできるだけデータとして保存し、集める」という要件に対して、Hanらのプロジェクトにおける「Virtual E Dataset」の構築手法は、今後の自社データパイプライン構築に向けた極めて有益な青写真を提供する。このデータセットは、半教師あり学習（Semisupervised learning）のパフォーマンスを評価する目的で特別に作成された12。

研究チームは、GoogleやBingなどの検索エンジンを利用し、「tinea（白癬）」「onychomycosis（爪白癬）」「nail dystrophy（爪甲ジストロフィー）」「onycholysis（爪甲剥離症）」「melanonychia（黒色爪）」といったキーワードを英語、韓国語、日本語の3ヶ国語で検索し、初期段階で15,844枚のウェブ画像をダウンロードした12。その後、低解像度の画像を除外し、Faster R-CNNを活用して画像内から爪の領域のみを高精度に抽出することで、3,317枚のノイズの少ない爪データセットを構築した12。最終的に、これらの画像はResNet-152とVGG-19を組み合わせたCNNモデル（アンサンブル出力）によって自動的に6つのカテゴリ（爪白癬760枚、爪甲ジストロフィー1,316枚、爪甲剥離症363枚、黒色爪185枚、正常424枚、その他269枚）に分類されている12。

商用サービスを立ち上げる初期段階において、患者からの自社独自の画像データが十分に蓄積されるまでの間、この「ウェブクローリングを用いた画像収集」→「R-CNNによる不要な背景の自動トリミング」→「既存の高精度モデルによる初期ラベル付け（疑似ラベリング）」という一連のパイプラインを構築することは、モデルの精度を素早く実用水準まで引き上げるための最も効果的なデータ戦略となる。

## **3\. データ拡張と合成データの生成による多様性の担保**

特定の爪疾患（例えば典型的な爪白癬や黒色腫）については既存のデータセットに十分なサンプルが存在するが、「深爪」や初期段階の「巻き爪」のような、医学的疾患というよりも物理的な状態に近いサンプルの分布は不均衡になりがちである。機械学習において、特定のクラスのデータ数が極端に少ない状態（クラスインバランス）は、モデルの過学習を引き起こし、実世界での未知のデータに対する汎化性能を著しく低下させる要因となる1。これを克服するための先進的な技術として、データ拡張（Data Augmentation）と生成AI技術の導入が必須となる。

### **強力なデータ拡張手法の適用**

既存の研究においては、Hanら（2018年）の研究結果を再現し、さらに強力なデータ拡張手法を適用することでモデルの精度が大幅に向上することが実証されている14。具体的には、画像の一部を矩形にマスクして情報を欠落させる「Cutout（カットアウト）」や、複数の画像とそのラベルをブレンドして新たな学習サンプルを生成する「Mixout（ミックスアウト）」あるいは「Mixup（ミックスアップ）」といった高度な拡張手法を適用することにより、ニューラルネットワークが特定のピクセルパターンに過剰に依存することを防ぎ、より本質的な病変の特徴を学習することが可能となる14。さらに、画像の回転、反転、スケーリング、コントラストや明度の調整といった基本的な幾何学的・色彩的拡張を系統的に適用することで、様々なスマートフォンや照明条件下で撮影された入力データに対する堅牢性（ロバスト性）を飛躍的に高めることができる15。

### **Stable Diffusionを活用した合成データ生成**

最新の計算機科学および医療画像処理の分野において、テキストから画像を生成するText-to-Imageモデルを用いた合成データ（Synthetic Data）の生成が、データ不足とライセンス制約を同時に解決する革新的な手法として注目を集めている。2024年に発表された研究では、Stable DiffusionモデルにFew-shot学習技術（少数のデータ表現から学習する技術）を統合し、実在しないが医学的に極めて正確な爪疾患の合成画像を生成することに成功している9。

この研究は、生成された合成データが、元の実際のデータが持つ病変の重要なコンポーネントやテクスチャを完全に維持しながら、視覚的な多様性を提供できることを実証した。実験の結果、この合成データを用いて事前学習済みのCNN（MobileNetV2）およびVision Transformer（ViT）をファインチューニング（転移学習）したところ、カスタムの実世界爪疾患データセットにおける分類精度がMobileNetV2で3.26%、Vision Transformerで3.02%向上することが確認された9。

本サービスにおいて、「深爪」の過度な進行や「巻き爪」による肉芽の形成といった特定の進行パターンの実画像が不足している場合、プロンプトエンジニアリングとStable Diffusionを用いた生成パイプラインを組み込むことで、あらゆる角度、照明、進行度合いの合成画像を無限に生成し、AIモデルの学習に用いることが可能となる。これにより、商用利用が制限されているデータセット（Kaggle上のデータ等）を使用せずに、同等以上の精度を持つ分類器を構築する道が開かれる。

## **4\. 深層学習アーキテクチャの比較解析と診断パイプラインの最適化**

爪の画像から高精度な診断推論を引き出すためには、単一の分類ネットワークに全てのタスクを依存するのではなく、前処理、領域抽出、および疾患分類を担う複数のニューラルネットワークモデルをカスケード（直列）的に結合したパイプライン設計が必要となる。文献レビューを通じ、小規模データセットを用いた古典的な機械学習（手動での特徴量抽出に基づくモデル）から、CNN、Transformerアーキテクチャに至るまで、様々なアプローチの長所と短所が明らかになっている1。

### **第1フェーズ：領域抽出とセグメンテーション（Nail Segmentation）**

一般のユーザーがスマートフォンで撮影した画像には、爪だけでなく、背景の机、指全体の皮膚、さらには関係のない物体が広く含まれていることが想定される。これらをそのまま分類モデルに入力すると、背景のパターンを疾患の特徴として誤学習してしまう危険性が高い。したがって、第一段階として画像内から爪の領域のみを正確に識別し、ピクセル単位で切り出すセグメンテーション処理が不可欠である1。

Adem Akdogan氏のGitHubプロジェクトでは、DeepLabV3ベースのモデルを用いたセグメンテーションが実装されており、テストデータにおいてMean IoU（Intersection over Union）スコア ![][image1]、Mean Dice Loss ![][image2] という極めて高い領域抽出精度を達成している17。また、ヒストパソロジー（組織病理学）の分野では、H\&E染色やPAS染色を施したヒトの爪組織のデジタルスライド画像から真菌要素を検出するために、U-NETベースの二値セグメンテーションモデルが適用されている。このU-NETアルゴリズムは、11名の皮膚病理専門医による診断感度（89.2%）に匹敵する90.5%の感度で真菌を有するスライドを特定することに成功している18。

消費者向けのアプリケーションにおいては、計算リソースの制約を考慮し、Faster R-CNNやYOLO（You Only Look Once）、あるいはMask R-CNNなどの軽量かつ高速な物体検出・セグメンテーションモデルをモバイルエッジ（端末側）あるいはクラウドサーバー上にデプロイし、背景と爪甲（Nail plate）を分離・抽出する処理をパイプラインの初期段階として組み込むべきである11。

### **第2フェーズ：高度な分類モデルの選定と性能比較**

抽出された爪領域の画像を解析し、具体的な疾患を特定するための分類モデルについては、微細な病変のテクスチャ、色調の変化、形状の歪みを自動的に学習するCNNが現在最も一般的に利用されている1。

各研究において、様々なアーキテクチャが評価されている。Kaggleのデータセット（3,835枚、6クラス）を用いた転移学習の実験では、DenseNet121をベースにしたモデルが、画像のリサイズ、正規化、およびデータ拡張を経て最適化され、全体的な正解率（Accuracy）89%を達成している15。このモデルは、末端黒子型黒色腫やばち指といった特徴が顕著なカテゴリの分類において高い適合率（Precision）と再現率（Recall）、およびF1スコアを示したが、爪甲鈎彎症やブルーフィンガーの分類においては相対的に性能が低下する傾向が見られた。ピーク検証正解率は98.9%に達し、過学習を最小限に抑える堅牢性を示している15。

さらに高度なアーキテクチャの探求として、従来のCNNが持つ空間的階層性の欠陥（プーリング操作による重要な空間・位置情報の喪失）を克服するために、カプセルネットワーク（CapsNet）とCNNを統合した「ハイブリッドカプセルCNN（Hybrid Capsule CNN）」モデルが提案されている5。このハイブリッドモデルは、カプセルネットワーク特有の動的ルーティング（Dynamic routing）機構を活用することで、画像の回転や変形、異なる視点からの入力に対するロバスト性（堅牢性）を大幅に向上させている5。実験において、このモデルは訓練正解率99.40%、検証正解率99.25%を記録し、ベースラインのCNNモデルを凌駕する97.35%の適合率と96.79%の再現率という驚異的な分類性能を示した5。一般ユーザーが様々な角度から手持ちで撮影する環境を考慮すると、このような空間的変化に対する耐性が強いアーキテクチャの導入は誤診率の低減に直結する。

また、自然言語処理の分野で革命を起こしたTransformerアーキテクチャを画像認識に応用したVision Transformer（ViT）やBEiTも、局所的な特徴だけでなく画像全体のグローバルな文脈を捉える能力に長けており、今後の有力な選択肢として検討されるべきである1。

### **AIと皮膚科専門医の診断パフォーマンス比較が示唆するシステム要件**

ここで着目すべき重要な洞察は、AIモデルと人間の皮膚科専門医の診断能力の差異である。2022年に行われた比較研究において、16名の皮膚科医の診断結果とAIモデル（VGG16およびInceptionV3）の推論結果が比較された。皮膚科医の平均感度（Sensitivity）は ![][image3]、平均特異度（Specificity）は ![][image4]、平均正解率（Accuracy）は ![][image5] であった19。これに対し、VGG16は感度 ![][image6]、特異度 ![][image7]、正解率 ![][image8] を記録し、InceptionV3は感度 ![][image9]、特異度 ![][image10]、正解率 ![][image11] を達成した3。

この結果が明確に示しているのは、AIモデルは皮膚科専門医と比較して「特異度（健康な爪を正しく健康と判断する能力や、特定の疾患以外を除外する能力）および全体的な正解率において優れているが、感度（疾患を確実に見つけ出す能力）においては劇的な優位性を持つわけではない、あるいは専門医に劣る場合がある」という点である19。

ここから導き出される本サービスのシステム要件は、AIを「確定診断を下す絶対的なツール」として位置づけるのではなく、「リスクを階層化し、見落としを防ぎつつ、適切なタイミングで医師の診察を推奨するスクリーニングおよびトリアージツール」として設計することである。特に、初期の悪性黒色腫のような致命的な疾患においては、見逃し（偽陰性）は患者の生命に関わる重大なリスクとなる5。したがって、AIモデルの出力層における確率閾値を動的に調整し、高リスク疾患に対する感度を意図的に高めるセーフティネットの構築が必須となる。

## **5\. 臨床的疾患定義と発症メカニズムの解明**

本サービスが単なる画像分類アプリに留まらず、ユーザーに真の価値を提供するヘルスケアプラットフォームとして機能するためには、AIが画像から「巻き爪」や「深爪」などの状態を検出した後に提示するフィードバックが、日本皮膚科学会などの公式な臨床ガイドラインに基づく医学的に正確かつ詳細なものでなければならない。ここでは、対象となる主要な疾患の病態、解剖学的メカニズム、および皮膚色による現れ方の違いについて詳述する。

### **巻き爪・陥入爪（Ingrown Nail / Pincer Nail）の生体力学と病態**

「巻き爪」は日常的に最も頻繁に見られる足部疾患の一つであり、小児から高齢者まで幅広い年齢層で発生し、症状が進行すると歩行時に激しい疼痛を引き起こし、著しく生活の質（QOL）を低下させる20。医学的・形態学的には、爪甲が横方向に過度に弯曲する「ピンサーネイル（Pincer nail：挟み爪）」や、爪の側縁が周囲の皮膚（側爪郭）に突き刺さり炎症や肉芽形成を起こす「陥入爪（Ingrown nail）」などに分類されるが、臨床現場においてはこれらが複合的に発生していることが多い20。

ピンサーネイルは、爪甲の縦軸に沿った横方向の過剰な曲がりを特徴とし、爪の根本（近位）から爪先（遠位）に向かうにつれて湾曲の度合いが増し、爪床を遠位で挟み込むように変形するため、トランペットのような外観（Trumpet-like appearance）を呈する20。主に足の親指（第1趾）の爪に好発するが、他の足趾に見られることもあり、手指の爪に発生することは稀である20。その発症メカニズムの一つとして、足趾の末節骨（Distal phalanx）基部の骨性肥大が関与していると考えられている20。

また、東京医科歯科大学皮膚科フットケア外来で行われた最新の臨床研究（第119回日本皮膚科学会総会発表）によれば、巻き爪の発症は単なる爪自体の局所的な問題にとどまらないことが明らかになっている。外反母趾などの足の骨格的変形、足や足指の関節の可動域制限、さらには歩行時の姿勢や地面の蹴り方などが、巻き爪の発生メカニズムに深く関係していることが示唆されている21。爪は本来、歩行時に地面から足指の腹にかかる圧力（床反力）を上から押さえ込む働きをしている。しかし、浮き指（足の指が地面に接していない状態）などでこの下からの圧力が不足すると、爪が元々持っている「丸まろうとする性質」が優位になり、結果として巻き爪が進行する。このように、巻き爪の発症には足の形態と全身の生体力学（バイオメカニクス）が複雑に絡み合っているのである21。

### **爪白癬（Onychomycosis）および爪囲炎（Paronychia）**

爪白癬（Onychomycosis）は、皮膚糸状菌（白癬菌）と呼ばれる真菌が爪甲内や爪床に感染することで発症する、ヒトにおける最も一般的な真菌感染症の一つである13。爪が白や黄色に混濁し、肥厚し、もろくなって崩れやすくなるのが特徴である18。真菌は爪のケラチンを栄養源として増殖するため、自然治癒することはなく、放置すると他の爪や家族への感染源となる。組織学的には、H\&E染色やPAS染色を用いたスライド検査において真菌要素の存在を確認することで診断が下される18。

爪囲炎（Paronychia）は、爪の根本（近位爪郭）および側面（側爪郭）の皮膚に炎症や感染が生じる疾患である24。急性細菌性爪囲炎は主に黄色ブドウ球菌（Staphylococcus aureus）の感染により引き起こされ、患部が赤く腫れ上がり、熱感を伴う激しい痛みが特徴であり、膿がたまることもある24。一方、慢性爪囲炎は、日常的な水仕事、強力な洗剤への曝露、あるいは化学的・機械的刺激による皮膚のバリア機能の破壊が引き金となり発症する。主婦や調理従事者、清掃員などに多く見られ、甘皮（キューティクル）が消失し、爪甲と近位爪郭の間に隙間（ポケット）が形成される24。このポケットにカンジダ菌（Candida spp.）や緑膿菌（Pseudomonas aeruginosa）が二次感染することで、慢性的な赤みや腫れ、緑色の変色（グリーンネイル）を引き起こす24。また、乾癬、アトピー性皮膚炎、接触皮膚炎などの基礎疾患が背景にある場合も多い24。

### **スキンタイプによる疾患の見え方の差異（Skin of Color Dermatology）**

AIを用いた画像診断システムを構築する上で見落としてはならない重要な観点が、患者の肌の色（スキンカラー）による病変の視覚的差異である。『Atlas of Nail Disorders Across All Skin Colors（全スキンカラーにおける爪疾患アトラス）』の著者であるShari Lipner氏らが指摘するように、白人、黄色人種、黒人といった肌の色の違い（フィッツパトリックのスキンタイプ）によって、皮膚や爪の疾患の現れ方は大きく異なる26。

有色人種（Skin of Color: SOC）の患者において、炎症に伴う紅斑（赤み）は見えにくく、代わりに紫や灰色の変色、あるいは強い炎症後色素沈着として現れることが多い27。特に重要なのは、爪に黒い縦線が入る黒色爪（Melanonychia）の鑑別である。有色人種においては、良性のメラニン色素沈着が複数の爪に日常的に見られることが多いが、これを皮膚癌の一種である悪性黒色腫（末端黒子型黒色腫）とAIが誤認する（偽陽性）、あるいは逆に悪性病変を単なる生理的な色素沈着と見逃す（偽陰性）リスクが存在する。

したがって、診断モデルを訓練するデータセットには、明瞭な白人の皮膚だけでなく、中程度から暗い皮膚を持つ患者の画像が均等に含まれている必要があり27、またサービスの実装においては、ユーザーから自身の人種的背景やスキンタイプを補助情報として入力させる機能が求められる。

## **6\. 医学的エビデンスに基づく予防・治療アドバイスの体系化**

AIが疾患や不適切な状態を検知した後、ユーザーに対して提供すべき具体的なケアのアドバイスは、前述の病態メカニズムを解消するものでなければならない。本サービスのアドバイス生成エンジンに組み込むべき医学的ガイドラインを以下に体系化する。

### **「深爪」の危険性と理想的な爪の切り方（スクエアオフカット）**

深爪（Short nail / Deep-set nail）自体は疾患名ではなく物理的な状態であるが、陥入爪や爪囲炎を引き起こす最も直接的かつ強力なトリガー（誘因）であるため、予防医学の観点から徹底的な指導が必要である。日本皮膚科学会の「皮膚科Q\&A」においても、爪を短く切りすぎることの重大な弊害が警告されている28。

爪甲の両側の角（側縁）を足指の先端より短く斜めに切り落としてしまう「バイアスカット」を行うと、歩行時に地面から足指にかかる圧力（床反力）によって、爪がなくなった部分の周囲の軟部組織（肉）が上方に盛り上がってくる。その後、爪が伸びてくると、その盛り上がった肉の壁に一直線に突き刺さることになり、激しい炎症と痛みを伴う陥入爪が発生する28。

AIが画像の形状から「深爪」や「丸く切りすぎた形状」を検出した場合、システムは直ちに以下の「スクエアオフカット（Square-off cut）」の具体的な手順を、直感的な図解やアニメーションとともにユーザーに提示しなければならない。スクエアオフは、巻き爪予防の基本であり、足爪の形態と機能に沿った理想的なデザインである29。

**【スクエアオフカットの指導手順】**

1. **直角に切る（スクエアカットの形成）:** 爪切り、または理想的には爪ヤスリのみを使用して、爪の先端を皮膚に対してまっすぐ横に一直線に切る（削る）28。この際、爪の先端が足指の先端の皮膚と「同じ高さ」、あるいは皮膚より「1mm以内程度長く」なるように長さを調整する29。爪先の白い部分を完全に無くすのではなく、少し残す程度が適正な長さの目安である28。  
2. **角の処理（スクエアオフへの移行）:** まっすぐ切った状態（スクエアカット）では、爪の両端に鋭利な角が残り、靴下や隣の指を傷つける恐れがある。そのため、爪ヤスリを使用してこの角を少しだけ丸く削り落とす29。この工程において、角を切り落としすぎず、爪先端部に「直線な部分がしっかりと残っている」状態を維持することが巻き爪予防の核心である29。角をある程度残すことで、爪の端が周囲の皮膚の上に乗る形となり、肉への食い込みを物理的に防ぐことができる29。  
3. **適切なタイミングでのケア:** 爪甲が乾燥して硬い状態のまま爪切りで圧力をかけると、爪が割れたり層状に剥がれたり（二枚爪）する原因となる。そのため、入浴後など、爪が水分を含んで柔らかくなっている状態で切るか削るのが最適である28。

### **巻き爪・陥入爪に対する治療的介入と総合的アプローチ**

AIが既に進行した巻き爪や陥入爪を検出した場合、局所的な処置の指導と同時に、速やかな医療機関への受診勧奨を行う。

* **物理的矯正治療の提示:** 医療機関で行われる代表的な保存的治療として、形状記憶合金を用いた超弾性ワイヤー矯正法がある。これは、爪の先端に小さな穴を開けてワイヤーを通し、ワイヤーが真っ直ぐに戻ろうとする強い復元力を利用して、湾曲した爪の食い込みを徐々に和らげ平坦な形状へと矯正する手法である22。処置自体に痛みを伴うことは少なく、即効性のある除痛効果が期待できる22。また、深爪をしすぎてワイヤーをかける余地がない患者に対しては、光硬化樹脂やアクリル樹脂を用いて人工的に爪を延長・形成し、食い込みを解消する方法が併用される22。  
* **歩行姿勢とフットケアの指導:** 前述の通り、巻き爪は足の変形や歩き方と密接に関連しているため、単に爪を矯正するだけでは再発を繰り返す可能性が高い21。したがって、システムからのアドバイスには、自分の足に合った適切なサイズの靴（つま先を圧迫しない靴）の選び方、足指の腹全体を使ってしっかりと地面を蹴り出す歩行姿勢の意識づけ、および足裏のアーチ機能を回復させるための足趾筋力トレーニング（タオルギャザー運動など）の推奨を組み込むべきである21。  
* **炎症・感染時のトリアージ:** 爪の周囲が赤く腫れ上がっている、熱を持っている、あるいは肉芽（にくげ：赤く盛り上がった出血しやすい組織）が形成されている状態を画像から検知した場合、細菌の二次感染を引き起こしている可能性が極めて高い25。この状態での自己処置は症状を悪化させるため、システムは「皮膚軟部組織感染症の疑い」として直ちに皮膚科やフットケア外来の受診を強く促す画面を表示する30。

### **慢性爪囲炎および爪白癬のケア**

慢性爪囲炎の兆候（甘皮の消失と爪の根元の腫れ）が検知された場合、水仕事を行う際のゴム手袋の着用による物理的保護、保湿による皮膚バリアの修復、およびステロイド外用薬や抗真菌薬の処方を受けるための受診をアドバイスする24。爪白癬が疑われる場合、市販薬による自己治療では爪の深部まで薬効が届かず完治が難しいため、皮膚科での正確な顕微鏡検査と、長期間の経口抗真菌薬または医療用外用薬による治療が必要であることを教育コンテンツとして提示する18。

## **7\. サービス実装に向けたエンドツーエンドのシステムアーキテクチャと運用設計**

以上の画像解析技術、データ戦略、および医学的エビデンスを統合し、実用的かつ安全な「爪疾患スクリーニング・アドバイスサービス」を構築するための、具体的なシステムアーキテクチャおよび運用フローの設計を提言する。

### **マルチステージ推論パイプラインの実装**

ユーザーがスマートフォンアプリを介して入力した不規則な画像を処理し、高精度な推論結果を安定して提供するためには、クラウドまたはエッジ環境において以下のカスケード型処理パイプラインを実行する。

1. **画像品質評価フェーズ（Quality Assessment Filter）** 入力された画像に対し、軽量なCNNを用いて画質判定を行う。ピンボケ、極端な暗所での撮影、ハレーション、あるいは指や爪が明確に写っていない無効な画像を瞬時に特定し、推論を実行する前にユーザーに対して再撮影を促すフィードバックを返す12。これにより、後段のモデルに不要なノイズが混入し、誤診を引き起こすリスクを遮断する。  
2. **解剖学的領域抽出フェーズ（Nail Region Segmentation）** DeepLabV3やYOLOベースのセグメンテーションモデルを適用し、画像全体の中から爪甲および爪周囲の皮膚領域のみをピクセル単位で正確に切り出す1。背景のテクスチャや他の指の干渉を排除し、分類器にとって最適な高解像度のクロップ画像を生成する。  
3. **多クラス疾患分類・重症度判定フェーズ（Multi-class Disease Classification）** クロップされた画像を、事前に大量の臨床データおよびStable Diffusionで生成された合成データによってファインチューニングされた高度な分類器（ViTまたはHybrid Capsule CNN）に入力する5。このモデルは「健康」「深爪（状態）」「巻き爪/陥入爪」「爪白癬疑い」「爪囲炎」「メラノーマ疑い」などの各クラスに対する確率スコア（Softmax出力）を出力する。また、巻き爪の場合はその湾曲度合いを、画像処理アルゴリズムを用いて定量的に計測し、重症度（軽度・中等度・重度）を判定するモジュールを並行して稼働させる14。

### **コンテキストアウェアな推論ロジックとアドバイス生成エンジン**

AIの確率出力をそのままユーザーに提示することは不安を煽るだけでなく医学的に不適切である。出力されたスコアを、臨床的決定木（ディシジョンツリー）を模したルールベースのエンジンに入力し、自然言語による最適化されたアドバイスを生成する。

* **絶対的トリアージロジック:** 「末端黒子型黒色腫」などの悪性腫瘍の確率スコアが、極めて低く設定された安全閾値（例: ![][image12]）を僅かでも超過した場合、他の巻き爪や深爪の症状が同時に検出されていたとしても、すべての通常アドバイスを保留し、「緊急性が高い病変の可能性があるため、早急に皮膚科専門医（皮膚悪性腫瘍指導医など）を受診してください」という強い警告を発出する。この「フェイルセーフ機構」はAIシステムの感度の限界を補完する要である。  
* **相関症状の統合分析:** 「深爪」スコアと「陥入爪」スコアが同時に高い場合、システムはこれらを独立した事象として扱うのではなく、「不適切な爪の切り方（深爪）が、現在の痛みを伴う陥入爪の直接的な原因となっている可能性が高い」という統合的なインサイトを提示する。その上で、一時的な痛みの緩和策、前述の「スクエアオフカット」の詳細な手順図解、および靴の選び方に関する啓発コンテンツをシームレスに提供する29。  
* **時系列モニタリング（Longitudinal Tracking）:** アプリケーション内でユーザーに定期的な撮影（例えば週に1回）を促し、症状の経時的な変化を追跡する。爪の伸びる速度、巻き爪の湾曲角度の変化、変色部位の拡大・縮小傾向をAIが比較分析し、「スクエアオフへの移行が順調に進んでいる」「湾曲が強くなっているため受診を推奨する」といったパーソナライズされたプロアクティブなアドバイスを提供する機能により、ユーザーの継続的な利用（エンゲージメント）を促進する3。

### **法的規制および倫理的コンプライアンス（薬機法への対応）**

日本国内においてこのようなヘルスケアAIサービスを展開する場合、本ソフトウェアが医薬品医療機器等法（薬機法）における「医療機器プログラム」に該当するか否かの法的境界線を明確に整理することが事業の成否を分ける。疾病の「診断、治療、予防」を目的とし、医師の診断を代替するような機能を持つソフトウェアは厳格な承認プロセスを要する医療機器として規制される。

したがって、ビジネスを迅速かつ適法に展開するための運用設計として、アプリケーションのユーザーインターフェース（UI）および利用規約において「本サービスは確定診断を行う医療機器ではなく、一般的な医学情報の提供、日常的なケアのサポート、および適切なタイミングでの受診勧奨（トリアージ）を目的とした支援ツールである」という免責事項（ディスクレーマー）を明確に表示しなければならない。AIが「診断（Diagnosis）」を下すのではなく、あくまで「〇〇の疑い（Possibility）」や「リスクレベルの提示」に留め、最終的な医学的判断と治療は医師が行うという建付けを徹底することが求められる。

## **8\. 結論**

本研究報告では、爪の画像をAIで解析し、巻き爪や深爪などの症状スクリーニングとケアアドバイスを提供する革新的なサービスの構築に向けて、データ調達戦略からシステム実装、医学的エビデンスの統合に至るまでの包括的な分析を遂行した。

商用サービスを構築するためのデータ基盤としては、Kaggle上の非営利ライセンスデータの直接利用には法的な障壁があるため、Hanらによるオープンな大規模データセット（CC BY 4.0）を初期の学習基盤として採用することが最も戦略的かつ現実的である。同時に、Webクローリングを用いた半教師あり学習アプローチや、Stable Diffusionを用いた生成AIによる合成データ拡張技術を自社のデータパイプラインに組み込むことで、特定疾患（特に深爪や巻き爪など）のクラスインバランスを解消し、堅牢な分類器を独自に構築することが可能となる。

AIアーキテクチャにおいては、背景ノイズを除去する領域セグメンテーション（DeepLabV3 / U-NET等）を前段に配置し、その後に空間的制約を克服するハイブリッドカプセルネットワークやVision Transformer（ViT）を配置するマルチステージ構造の採用が推奨される。さらに、皮膚の色による病変の見え方の違い（Skin of Color）というデータバイアスに対処する設計が必須である。

臨床的観点から、巻き爪や深爪は爪局所の問題に留まらず、足の骨格や歩行姿勢といった全身の生体力学が深く関与している。したがって、AIが提示するアドバイスには「スクエアオフカット」による正しい爪の切り方の徹底的な指導に加え、ワイヤー矯正の治療情報、フットケア、適切な靴の選定、および運動力学に基づく予防的指導を統合的に含めることが求められる。

本報告で提示した高度なデータ戦略、最新のAIアーキテクチャ、および日本皮膚科学会等のガイドラインに基づく医学的根拠を融合させることで、単なる画像分類アプリの枠を超え、症状の早期発見から予防的介入、そして治療後のモニタリングまでをシームレスに支援する、信頼性の高い次世代のパーソナライズドヘルスケアプラットフォームの実現が期待される。ユーザーから収集される日々の爪画像と症状データは、さらなるモデルの高度化と新たな医学的知見の発見を促進する貴重な資産となるであろう。

#### **引用文献**

1. DEEP LEARNING-BASED NAIL DISEASE DETECTION: A COMPREHENSIVE REVIEW, 2月 25, 2026にアクセス、 [https://zenodo.org/records/15276400](https://zenodo.org/records/15276400)  
2. The Promising Role of Artificial Intelligence in Nail Diseases \- PMC \- NIH, 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11588894/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11588894/)  
3. Artificial Intelligence in Diagnosis and Management of Nail Disorders: A Narrative Review, 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11753549/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11753549/)  
4. Nail Disease Detection \- Kaggle, 2月 25, 2026にアクセス、 [https://www.kaggle.com/datasets/nikhilgurav21/nail-disease-detection-dataset](https://www.kaggle.com/datasets/nikhilgurav21/nail-disease-detection-dataset)  
5. Autonomous detection of nail disorders using a hybrid capsule CNN: a novel deep learning approach for early diagnosis \- PMC, 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11686868/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11686868/)  
6. Nail Disease Detection \- Kaggle, 2月 25, 2026にアクセス、 [https://www.kaggle.com/datasets/nikhilgurav21/nail-disease-detection-dataset/versions/1](https://www.kaggle.com/datasets/nikhilgurav21/nail-disease-detection-dataset/versions/1)  
7. Nail Disease Image Classification Dataset | Kaggle, 2月 25, 2026にアクセス、 [https://www.kaggle.com/datasets/josephrasanjana/nail-disease-image-classification-dataset](https://www.kaggle.com/datasets/josephrasanjana/nail-disease-image-classification-dataset)  
8. Exploiting Transformer Network for Nail Diseases Classification and Recognition | Journal of Engineering and Digital Technology (JEDT) \- ThaiJo, 2月 25, 2026にアクセス、 [https://ph01.tci-thaijo.org/index.php/TNIJournal/article/view/260778](https://ph01.tci-thaijo.org/index.php/TNIJournal/article/view/260778)  
9. A hybrid model for improved nail disease classification using vision transformers and stable diffusion \- PMC, 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC12800211/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12800211/)  
10. ImageNet\_TransferLearning \- Kaggle, 2月 25, 2026にアクセス、 [https://www.kaggle.com/code/antonigrecki/imagenet-transferlearning](https://www.kaggle.com/code/antonigrecki/imagenet-transferlearning)  
11. Project \- Model Onychomycosis \- Figshare, 2月 25, 2026にアクセス、 [https://figshare.com/projects/Model\_Onychomycosis/24745](https://figshare.com/projects/Model_Onychomycosis/24745)  
12. Deep neural networks show an equivalent and often superior ..., 2月 25, 2026にアクセス、 [https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0191493](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0191493)  
13. Artificial Intelligence in the Diagnosis of Onychomycosis—Literature ..., 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11355597/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11355597/)  
14. hannesoehler/nail-disease-classification: ML/AI project to ... \- GitHub, 2月 25, 2026にアクセス、 [https://github.com/hannesoehler/nail-disease-classification](https://github.com/hannesoehler/nail-disease-classification)  
15. Optimized Nail Disease Detection Using DenseNet121: Advancing Dermatological Diagnostics with Deep Learning \- IEEE Xplore, 2月 25, 2026にアクセス、 [https://ieeexplore.ieee.org/document/10836596/](https://ieeexplore.ieee.org/document/10836596/)  
16. Artificial Intelligence Meets Nail Diagnostics: Emerging Image-Based Sensing Platforms for Non-Invasive Disease Detection \- PMC, 2月 25, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC12838109/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12838109/)  
17. ademakdogan/nails\_segmentation: This project was made for nails segmentation using deep learning models. \_\_DeepLabV3Plus\_\_ was used for segmentation problem. ResNet101 were used as encoder and imagenet weights were used as encoder weights. \- GitHub, 2月 25, 2026にアクセス、 [https://github.com/ademakdogan/nails\_segmentation](https://github.com/ademakdogan/nails_segmentation)  
18. Deep Learning Assisted Diagnosis of Onychomycosis on Whole-Slide Images \- MDPI, 2月 25, 2026にアクセス、 [https://www.mdpi.com/2309-608X/8/9/912](https://www.mdpi.com/2309-608X/8/9/912)  
19. Artificial Intelligence in the Diagnosis of Onychomycosis—Literature Review \- MDPI, 2月 25, 2026にアクセス、 [https://www.mdpi.com/2309-608X/10/8/534](https://www.mdpi.com/2309-608X/10/8/534)  
20. An Atlas of Nail Disorders, Part 7 | Consultant360, 2月 25, 2026にアクセス、 [https://www.consultant360.com/article/consultant360/dermatology/atlas-nail-disorders-part-7](https://www.consultant360.com/article/consultant360/dermatology/atlas-nail-disorders-part-7)  
21. 2020年 6月 第119回日本皮膚科学会総会 巻き爪のメカニズムについての研究 | ちえぶくろう, 2月 25, 2026にアクセス、 [https://fukurou-hifuka.com/blog/clinic/2020%E5%B9%B4%E3%80%806%E6%9C%88%E3%80%80%E7%AC%AC119%E5%9B%9E%E6%97%A5%E6%9C%AC%E7%9A%AE%E8%86%9A%E7%A7%91%E5%AD%A6%E4%BC%9A%E7%B7%8F%E4%BC%9A%E3%80%80%E5%B7%BB%E3%81%8D%E7%88%AA%E3%81%AE%E3%83%A1/](https://fukurou-hifuka.com/blog/clinic/2020%E5%B9%B4%E3%80%806%E6%9C%88%E3%80%80%E7%AC%AC119%E5%9B%9E%E6%97%A5%E6%9C%AC%E7%9A%AE%E8%86%9A%E7%A7%91%E5%AD%A6%E4%BC%9A%E7%B7%8F%E4%BC%9A%E3%80%80%E5%B7%BB%E3%81%8D%E7%88%AA%E3%81%AE%E3%83%A1/)  
22. 陥入爪と巻き爪の治療 \- はるこま皮膚科形成外科, 2月 25, 2026にアクセス、 [http://www.harucoma-der-pla.jp/?page\_id=413](http://www.harucoma-der-pla.jp/?page_id=413)  
23. 白癬（水虫・たむしなど） \- 皮膚科Q＆A（公益社団法人日本皮膚 ..., 2月 25, 2026にアクセス、 [https://www.dermatol.or.jp/qa/qa10/index.html](https://www.dermatol.or.jp/qa/qa10/index.html)  
24. DISORDERS OF THE NAIL APPARATUS | Fitzpatrick's Color Atlas and Synopsis of Clinical Dermatology, 8e | AccessMedicine, 2月 25, 2026にアクセス、 [https://accessmedicine.mhmedical.com/content.aspx?sectionid=154896484\&bookid=2043](https://accessmedicine.mhmedical.com/content.aspx?sectionid=154896484&bookid=2043)  
25. Atlas of Diseases of the Nail \- Portal Saude Direta, 2月 25, 2026にアクセス、 [https://www.saudedireta.com.br/catinc/tools/e\_books/An\_Atlas\_of\_Diseases\_of\_the\_Nail.pdf](https://www.saudedireta.com.br/catinc/tools/e_books/An_Atlas_of_Diseases_of_the_Nail.pdf)  
26. UNINA9910988387103321 1\. Record Nr. Titolo Atlas of Nail Disorders Across All Skin Colors, 2月 25, 2026にアクセス、 [https://catalogo.share-cat.unina.it/sharecat/download?format=pdf\&id=UNINA9910988387103321](https://catalogo.share-cat.unina.it/sharecat/download?format=pdf&id=UNINA9910988387103321)  
27. Atlas of Nail Disorders Across All Skin Colors \- Ovid, 2月 25, 2026にアクセス、 [https://www.ovid.com/journals/jeadv/pdf/10.1111/jdv.70130\~atlas-of-nail-disorders-across-all-skin-colors-a](https://www.ovid.com/journals/jeadv/pdf/10.1111/jdv.70130~atlas-of-nail-disorders-across-all-skin-colors-a)  
28. 爪の病気 Q11 \- 皮膚科Q＆A（公益社団法人日本皮膚科学会）, 2月 25, 2026にアクセス、 [https://qa.dermatol.or.jp/qa38/q11.html](https://qa.dermatol.or.jp/qa38/q11.html)  
29. 巻き爪切り方・ニッパー使い方を画像で解説｜大田区大森・大木皮膚科, 2月 25, 2026にアクセス、 [https://oki-hifuka.com/how-to-cut-ingrown-nail/](https://oki-hifuka.com/how-to-cut-ingrown-nail/)  
30. 陥入爪・巻き爪（かんにゅうそう・まきづめ） \- 日本創傷外科学会, 2月 25, 2026にアクセス、 [https://www.jsswc.or.jp/general/kannyusou\_makidume.html](https://www.jsswc.or.jp/general/kannyusou_makidume.html)  
31. 爪はスクエアオフカットで仕上げよう！正しい切り方・ポイントや注意点をご紹介, 2月 25, 2026にアクセス、 [https://medical-media.jp/column/nails-square-cut/](https://medical-media.jp/column/nails-square-cut/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAWCAYAAACL6W/rAAADJUlEQVR4Xu2WS8hNURTH/0KRV+RZyseATFCSCCGJZOBRFGVIyEQoJlIGMvBIBiIhiURCGYgvDJSBCZFHfUSSJIpCHutnnXXvuuc7l2JicP/179699jp777X2f61zpBZaaKGFFqpxxthhPGK8ZJzfMNscXY0bjJ+MF4wfjJuM3bOTYYDxkXz9drlfl+xgaDPeMt41HjK+MM7ODvJ1txlfGU8bvxtvyJ/thJ7GO8ZBxZgN2XhyzaMa+G02fjUuKWw8w7Mbw0l+GA5BEgJTjSvTGHDAZaoHzP93xuk1D1/3irFvMWaNH8Z7xsHhFJhnXF2y3ZcvQNDNMMX42XjT2Kew9TBelmc7gB/rlXHV2CuNrxt7p3E341nj4WRrlwdyQJ6AicaPha1BZf3lt4VDxjG588KSPSN8+K2yB9iQ8bhkI2F71ShHfAh2eDEeIk/ImpqH39QM1RPOpSDH18Yx4QSGGZ+peWBbSvaMPwUWh0YiSAXbfnm9bZfvnfFG7vNFXqcn5LWfb7EM5nmGkshJ0ljjW/1dYDvlPkgPCQIWP1nY84EmFDZIhi+mucAC1WUF96h5KVDLa43v1ViXNYRG/yaweDbXGPJ5oM6B0TjonHFomOsLEMQOed0y/01+E+UOCwhsqfGlXNLRTGr4FykCDrxe3gmfG7caj8ufDdDJHqcxASFJDj6zsNEo6Ir9ijE4J1+nU/0kkFASi9+pPNGseYScFpfszUCAkdncPAbKGwCyzUA6OXGUxIr69C+wHu8z/KKJTZO/KrL0Yr+nyVZrqeUXcruqJZrB4uPlm8U7KjIY7T4UUXXz+ISdfao68CS5hGOOAKjROcU41zT7NGC5OmeLLN9WXRr8HpRnJ2yj5F8AeaN4t6F7gC/rHC3GGQQWz41UdfCz5AfmRkE5sKZSDFDw1+QBIhuKNn8pjJC37IfG0YWNbOHXIf9U4gC8h4YW84H47OIA/O6T102uJ7BbXnfnjevkdbtLjc0DZfE1wlrUM6p6Ir/ZSvAwLz4CW1Sa+x0IjkC5dX6z9suYK1+fbtbWOFUDXRXZrSr+VyGfFQnnC2ihhf8JPwE6/sTsFjRhbAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAWCAYAAACL6W/rAAAC+ElEQVR4Xu2WS6hOURTHl1CEhOQZlySSJMVAXEmiUGQg5h4TA4oYmMjglgnJQCQDKYkUIdItJWFCXom65JEBIpTy+v/u2vt8+9v3nI8MZHD+9ev79tprn7PXXmvvfcxq1apVq1a5TooucUScE0ubeqvVW2wWb8Wx8Nsh+iY+M8RH8Uo8z7grpge/ZeKNeCHeiSeiPfRF9bKG39nwe0mMTJ2i+otbYnhoM5iJzCk8qrVRfBELQ3uKeQA7Cg+zReKH+FnCFTE4+N0Rk8J/5vBdvBezgw3NE7et4cfcD4ubYlh0iloiNmS2++Ki+cAqjRAPxXnRL7HvN59QFM9mdVeLxWKsGCUeiZnBh/dcEJNDGx0wDz6dxwmxvfBwTTRfzKYqG2KerVmp0byseOjyzJ5qj7lP/iLGYI9aK9qSNtnYZs3lysQZszWxxed8tsb8yDC2XdYIlsS8FNNCu1us3DOrDiyfdKoqnzihgZk9ihK/lhulQVmbTPOcLjEm2Cj9WMbswanigdgU+gvRwYb/m8AowTKfVoGxD26INXlHiShBnrPbPMuILO8NdvgkViT9hQgoTXXUnwTWaeU+rQJjxZ9aIwOtxIGTHi5R48RV8c38PZyu7U0e9m9Lkb3AZHdm9lzjxWMxIO8wP6w4cWOGCIiS5H1nohOqOjyOmzuvyuypqg4PxmDPy4PTEvuWzJ6K7Fw2LzfUR8wVQ0P7tfkpmCouBAkqxMBT1vNC7rTyEk21znyi3COpCBR7Lg4M7FUnLafcIfOMcPEjFv60+RWBmDxVlosqaAoMsZGZZCruMTZ5rG9+D5qXX7RNMP9KYGFYoCgy8zVpR/HiVoERFJkabT554HIngwSI+HDIF5vK6DA/zHqI2mVDEiAlxj0TVw2R7nvml2p6ibIPjprfI+vN651PnFg6qTh9CSyvDkQQ9JXBQkW1ievig9hnXlk8t+yZ3eIYnW8e2Mqs73dixQiWsfzmeyuKzyEykC7Y34jxXFNU2gJr/uqpVet/0i//gryL1KuU9gAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAAWCAYAAADKHRJUAAAEjklEQVR4Xu2Ya8hmUxTH/0JRM4MwmtzlEmMYMWkUHwZFIblkinzgw5iaRlGmkaSZFJokl1ziwyTlHkUuqXkw5fYBZfJl1JgYIUSR3NfvXWe9zz77nP085+kd4y3nV//e96x9OXuvtfde+zxST09PT09PT8/MOci0Z27MmGvaPTf27HoI1C2m500fmE6qF09zhult0yF5AWD82/SNaXuL7h5WnWYf01umz00LsrI2LjB9bXrR9JjpU9OSWo1uzDG9kBsnBKedbRrI+8vZzXSF6UPTRvm4cfA4LpT78UvTU/K2W00/mpZWdfDbu6Y3quc9TI+b7pW3w987qr/3yMfSCs7jZW3603TpsOo06+XlXYP2seno5Hmt6XvTKYmtCzMJ2nXydzLun9QeNJy0yvR79T8cKN8ROHwUEbRUBC1dnMebvpMHNLjZdGXyDGea9s9sNXjZctNlpotNx5gOk68unNsWbXblX+oWNByDI1L2kzvi9sw+jpkEjbaRR5jzoLKlLDR9a/ois6+QB30U9EmQ7jM9YjpdzXx0quln1YO2plIwX34sjuTa3GBsNh2eG+UTfkjDl3cJGgFi1d1q2ruyseu2mS6pnrsyk6CllIKGMxnrILOfIw9ka36pKPWZwvxf1TAo1H3OdGL1zKn2ssbv6gZE+tzcWEGnL2myoEF6XCwzvWl6UONvTzn/ZdCYL/MuEX0ebLredJfpBDVPqovkfWG/yfSAPLcdYXpPk6eMqY5IgHSSw87D2RwhkwZtg+pn/Wo1j44Uylg89J2KHfpaix3tNdWyG6Wg3SAfX348cSKQDgheCfrEJ1xgSDfMkdzI3NPFiY/PN/1gelLDXcXl5aqoNAkEg2Sdw0u59UWnkwaNHLlJPnGc8pvpajVXYUAi/kzNmyxH1B8tdrRuqmU3SkFry2mM8X75uGlXggvH+xqmFdrdKW93Y1QaAf6N4PKXCwtjWamyn3SU6Ss1jwYYyLdvMEnQcMRa1V/M5JgMzjkysY/j3z4egXFy5Y9PIK7k58mdyO1vEgjkL5VKsNPIYwH5jV0YLDU9mzzX4NqJI5/IC+Q7I13VTCiOOr4rFg2rNrhNviBSSMgMZNyRk7Mrghbsq2F5l/oD00emYxNbLG781AYLhAVNfg8iDsEBpleS5xqPyitvzAvUzB8cbdTlg/Bkjb5Q0N/c3Ch3xGwMGgswv4hxJV+V2XJiEV+T2Mhd2PgubIM08I48fwe8Kw1acc4UDFQOWg6Tpm5+PLLKNqkeRAbBls9hRc2245HvOHJp6rT4FSO97jM/bIsTGwt4g+rXdb7v6Itrfk58j/E9lxKXoYAF/3TyPA1bcIu8cvqh1wZBjVUViqswK5SfbfI8x89W2B+WD4qVN+oGye6LS0tX3THVskwstDYNqjocV1wayF98IH8iD8ayqjwg2L/KgxIQrGfkbWjLfPNfRFJK32P0/bp8YTAefn0qxuQ40+WmeXnBToDgkMS5CrPD2gY7mzhUPs6zNProz4l50vY0lduya7mglaCcXYjYZbPdX/8LSidMCscn6lK3p6dnp/IPU5orBSxMET4AAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAAAWCAYAAADKHRJUAAAEe0lEQVR4Xu2YW8hVRRTHV1igVIYYRdDNKKV7ERUFXagUgxKpRKHopYcuRA9FhdGDFVFBRARh1wcJMbUiwchE6HSBbg8RFD1UD0UZFBkFRoVd/r8ze769Zs7sc/Y5n5/4sH/w5/v2mtn7zMxas+Zi1tHR0dHR0dExfY6UDsqNGYdKs3Jjx74HR90vvSZ9Ip2RFk9xofSedHReABj/k36SvivoibrqFIdJ70rfSkdlZSUek36UNkqbpS+lc5Ma7ThEej03jgmDdrnUs/C9nAOkq6Qt0ovS1xba24ZLpK+kTyt9YWk/GbcPpR3V84HSS9JT0g8Wxntn9fdJC20pwkdxWkn/SNfWVad4yEJ5G6fxw9uluc72l/SrdLaztWE6TrtF2mWh3b9bs9OWSZ+5Z9LTahvd1vMs9OkRC+8QHM9VtvjuydIv0rrqGe6TrnfPcJE0P7MlXC2tkq6TlksnScdamL40tuRtZuW/1s5p5G4GaoOFyALew0aEjcN0nMa7cR2hz73K5uEZ++2ZfZ70cGbLoX9kkxOcLTqJMjhH2m2p0+6tFDnCQlocyk25QbwvHZcbLXT4Gat/vI3T4GJpjnvmXZy+1NnaMB2neZqchnNYZwgo394TpWvccwne6Vn6zRgElAHf3Ga1Uyh/VTqteiarvWEhjY4Fnl6cGyv46FYb32keZi6dIHWM2j3lzLTT4C4L7WMtu0w6RnrHRre1jdOA9MvYMQ73SE9byEDHSx/Z6DQ8AB9iAYxpzMPMo/Gn2mROO1+6zUKU3W1pJOewJhA8fNuLiH+rYEez+2+2Y5jTcM7jVq/rZIQ7khpl2jqNMb7Swlr3stWzik3aDbHSOOAMFuscOsJOKn50UqexbrLwkgIWpsUJLMTf2OBO9ntpT8GOHuy/2Y5hTgPWdJwVHfe3ldd2T1unNcH4xtnMX9bCn6Vbbchvs4CykPYyO/QsTN/IJE7zrLfQkc8tzKi2zHR6JIswUKud7RTpYwsBs8DZcyZ1GjONII6wvjELIxdIr7jnBLadfJwBzSHSfFSze4xRuFM6va46AGnwTEujhd1STD1XOPsoZtppa2xwBwj0YVRbJ3EaY0KArHW26IfI4dKb7jnhBQuV1+UFNrh+3GihLgdCHDJskV5j4bx3qbORIvdHp9F31lyuj3JGtZWzH4dpBjnCEYM0T6orwTLwgaXZJgZ0pLHPPiJKTsuh09TN0yPr1NuWOpGzWN7hmB5HpZycxg6MSZPTGDBSEykqx7eV/nGzcVZd3N/K57M0ntMoy4nnMdZ6z52WOo0A2uSepyA6iBIq+4NeCZwaU2MUaxxwVPjNUkeSAmg4558HLFxpUWdlVVYCB/uNQBs92n+zmRhoJfXqav2B5trqWQsDyHUWs8hf3OLsP6WbnY2+sDv+Q3q+Ev+TlUr9bDqP8W1ukAgM3uP2qdEni6QVll437S1oAAdsbl7I2cPS6f4ADoptXWLlwW2C6ycChPcOzsoi3Pey6WmCcmYhYpaN8/sdM4SftU2QPlGbuh0dHXuV/wE2iyo6+E6NZAAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEW0lEQVR4Xu2YW6gWVRTH/1KBkaBZJFkQhghRZJEYXYweMgtJuoFREFEPXfAlo4KiOBE+RJYQZBFG1EtQUUF3ijxaD5EPEhSJFVpE4YNJoRBBl/Vzfbtvz/r2zPnmjBLG/ODPOXvtmW/P3mvvtdaM1NPT09PT0/NfcsJAM2JHxnGmY6Kx59Ay2/SJaYtpvenYavdBTjN9ajo3dsAcuSfbgNdvMl0ZOwpw7fxoVPsxYZZpZjS2hPvPMi2NHWPAXE4yXTD4m3O06Rm5A9j1L5g+Nx2VXcP/u033ZLYKl5n+rtFHcm9Htsr7748dBVjASVV/91c1H+M6GO+qaGwB85mbtT82vaLxQsZ1ptvkC8r1j6m6GXku5pY42fRO1gYcWDwRidtN1w90uelU00WmHSrfyCLuVztnvGt6zvSU/KGJmdOhizPYVPHei00/mRYHe4R12Cff/cBCfy9fu0TJGZNZm3ufztpF1kWD3KOro3EAx/txtXPGm9E4Tbo4g8VZE2znmX4Y/K2DRdxk+iuzsSGvVjVqcEpyZ7CpX8/aq0xvZ+0iN4Y2Az2r8tFlcBaWRTnSnDHP9IfpVg3jOM75UqPxP+d008+mH2NHYIGq11whjwaAY0jspUjTyPkqPxxOus/0iKbnjJWmjfJQdWHlivHp4gyeP+UsEusi0y7TivyiAmnHbzNtNv1i2mO6N79I/vsT8mqJvPSWaZmG4ak2addxh+m7aJQvKEds+aDd1hkfBNstpkfVnMQJH1HkKhYj2tE4kz1bngv/lD//drlTmkhzzcMUEN5vCLYSeRnLfHfL88+DKkefgxCCPjO9FjvkE31Sw8Vr44wSxGiONEe7DV1PBuGG6jHFc+awU76b60hzjWEKO7m1qdRmsfNNwmYm51L+EsLY/EWIcXj/gdhhfKhq6OrqDOIwY7EwbejiDHbn6qyNcyixmccTmT2yVn7NV8HOc1BRURjUQTlMZAAc8L6GFRnvOrUJnVjOoAweITzEcMG1yc6pKcGE7zbtDXYmwP1tF7aLM5jf8cHGLiVkTGq4aJGUM0jAOVM5g9NGiEqkQiDBeK9m7X9JdfO4C1R3MojJm013DtrsgpflJyuHE0FILL1QNtHFGROmU4KNMPKG3FGp/bDpPXkogzSHuKGIIBPBluBEsND55xDeZX7L2jiDsUdIF47rjA0aHu88Cb04sOPYBHFyMmvzgOQl6u62dHHGQvn7Qr5AhC0KFvqAXHZAoxuNOZD0U85kE21VOddg22I6M9hPlIe69BtsDCquEc6Qe56HaPreVPq0gXACXGv6Xf5dJsHgd8mved70rcb7HBLHmEoP+W2NMDYbhUqIMv0b0zlZP4vMqeD5+AqR4Flvlu92xuHd5OusP4d3tLrETDKfp+prwgh0UhMTPvIPW4eSa+QfFy9VcwVyOOEUL5GXpDxLbWlZQ5rDJaq/9yXV93Eqv5Anbsr9tmG6pyVTbTS+klOZHq5N39PzP+IfzyP5S1ochhkAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAETElEQVR4Xu2YTahVVRTHl5iglPlRr4dmfoGDPlDDPjC1QWTUwMAPUNKBMwtqoqCoKDlwUDgSJQlEbJCQYYMSC6Ke1CC0QYKSSIKGFAgWikYiauv31t3vrbvu2efe8+6D3uD84M97e+9z7tlnrbXX2meL1NTU1NTU1PyfPNLQqDjgeFA1JnbWDC8TVD+oTqr2qMY1D/czQ/Wj6tk4ABPFPFkGXuyVVm/z8IdDXw6e85Jqugw9Kh5SjY2dFWEei1Vz4kAJb6jejJ2BB1QfiTmA9zukOqUa7a7h/0uqTa6viVdV9zP6VszgU1SXw9hvquelPUzuS1VPo41D16teTBdUYItqWezsEBy5VQaNM1nsPT6W8uDA+cel1Tbormpl4zrmRV8Cm3Gf5zHJrIjEBtWqhl5TTVMtUp2XwRv54dOqfWKTf0XKX8Dzuupe6HtU9bUUL+MyunEG83hXmuf9t9jcGMvBXEkr74nZ6Bkxe0wVWwmsCChyRp9rc91+1y5kd+wQ8+hq104/zN8qsAoOSasziNJrqidDfzu6cQb33lItcH3kdwy41/VFZqs+U40P/aQtskaCVOadQVAfc22u/8q1C3krtDHgAWmOoKE6Y5LYisIIESZe1bDdOGOp6lcxIyX6xOZx2PVFZkqrjWaIrRbPLNUV12a1kUWAZ+L40hRVBLmc3OZJziBKmNiHqqektaBHUq3JOQPjVqEbZ0BMreek+jz4jYOqt0M/tnhfzFHUI+rkEhlMT9minYMHXIydYkb9WfVCo82DPxB7kXXpogJICThiKM74vUA3VX8V9KOqL0uK8QW4EwjSs1I+74jfxmK3S2K1aru0BscATO4n1edxIEMqWNzjc6dnnuqGDM0ZRXS7MhIYgRSyIg60YY3qttjWuBN4jg8SUiUBzcaF58fVNUDa9WyLAxmY0B0pL8QjLU0B0blZbIVVhR0gdcHXnTJYdWxWAAdwf9p9sSvLFnR2FBhoYxwQ29L+IebZhE9BfofiyRVwDMKzqkbmcDgDA11QzW+0H5fOv3kIPNJ4bxwoIBZ56u2fro2Tjrr2AP6jruhl2QkckeaI4PuE6+lP3p6r+l71TrpIbGlznYe9e1l6y9GtM35RLRR736RPVWsb46SVnaoTUhz9vEefDEZ7DhyOof13VErZCX7jC9ceIF2Ycwa5DaNzwAU9YhFPIfLbNbaI/AaOTXDUwrGAN/zqhqrSjTOIVOYWRapNNSCtdvqLUmgnzuA5J1VPh34CkN1b2oGyItlxtUDOZwnyMD5eIkQMuyeWKNu6q1J8HELa+VfsQ8/D738nFoF8ZP4jzWc2RUSjtdMOuy0Lxo33IF/zCBhWxXWxU4gI13NElIKyCL7RcoWZYk6KS3VrV/OwwSB7Ys6pyoz0hNiRwHNSsi3L8LKYM5ZL+4PJkQopt92H7yeStw1p64xY4f5Gqqfpmoq0O1Xm1JjvlbKgr6mp6ec/mYvyy3pKOvAAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEFElEQVR4Xu2YW4hNYRTHl1DkfsnkUi6hRITiQTwhEuVSihdvKE8URTQe5GWeRCQ1IXlwSwhRZuJBKHkQKRlSkhAhD27rN+t87XW+2eecfc7MdDTtX/2b8337O7PX/ta3LvuI5OTk5OTk5NSTEQX1ii84Bqj6xpM5XcsQ1V1Vq6pJ1b/4cjvjVfdUs+MLnqGqOaqx8QUH3pwilT3v4f/uiidrZKCqXzxZI6PjiQzMU80QsyOmj+qomAPYp2bVA1Vvt4bPbaodbq4IvPlCzGPAJn+WYs+tUj1RTS6M16t+i63DwHIsVv1R/U3RbbH7ZwWnrownM0Jq+Kb6JWY7989C2OQThTGbzWe+723HLv8/cfY1N4ZRUiEiGlW7o7mPqrNihsAN1XXV1MIYhx0WuznX0sIxsFl1WbVOtVQ1TszQ51LBsBQ64wxsJqIHq1okuzOIhLeqg26uQfVMtc3NpTmjxY3ZyyNu3IFhqoeqjdH8a7FwCimLMTc6GRYoawpzOG6am485ILbWQ5gTXdXSGWcEuHeLZHdG2GS/HseeETv5IW0ul+I1HLqLbkx2uerGHcB7bHT8gMyRWkgxcEXsRj7XBSO/q+a6+ZgNqgluzIPslNq6iXo4Y7rqg1hK9nAwWySpHxPFIiiwTHW88BnHUNjLZoJyzsDYcKIpPIOSy+2QfljTJuWLfsx8McNqoR7OAE6/bxz4TFQ0S9LI8LdRrPYOFzvACyVJTyWLtocHjGtGKLiluiBSDGuqLcBbVC8lm/PepIgC/CllHmV6WKnNGZ7QKfH94Ihy+DaW9W1iUbZHUrJD3E0xfi92M05/GvwzCno1jmDtfdV5SRqDaqlXZARCiuUgZnE+m+3XLRHrPml4SGEczg7QOf0QO2FPxU4vxlKUYnDaabFWsRrIoTxEHIXVUG9nrBWrkZskW1SwPtQUHEDnGQ4iXVrJgk4eDC9z1Iy0LonTfUuS8OIfLxDLkZU4JLYB2+MLVVBvZ7xSrXBjnr1UlHNoSVGBSap3bowd59y4HdpaomGkm+OliJAKsPmEVZNqjFjhR3RbOIcWGWaq7qi2Fsae0BR0ZjO72xk85z6xFEwHFGBjH0ny3EG07WkQEWy0f/+apfrqxthxyY3boWO6IMkXyWnkRR+GjDE+Tb4G0O4xx8bHYMj/4Ayah8ditsQFlBadNMS10LyQDWhU4udG8fsZ4LhWsZbYw2Hn0Id9xQ46riK4Ga0mJx9vUjtiI8OpThPpJ4Bjf4p1GzGkPdan1aE04vtU0l77Wlni7yD/nsReEBVfxFIQhPepNIX3MM8xKVGYxYp5gySNwP7iy8YiMS+vFqsb3QE9N8b7H856Iqek42EOkH34jY/CfVOq60ZzaqDSr8r8is0Phj39UObkdAH/ACyXASJtaysHAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEh0lEQVR4Xu2YTahVVRTH/1FCUaik9CojfQ8toi8jUJ4VWmTUQAcZGNSoQR+TBgVFhFFJg9BB9oERgWmEUVKDihQkrxUR0SSonBioqFFRUVRoH+j6vXV2Z539zj3v3ltxCc8P/nD3Pvucs/daa++1zpVaWlpaWlpahsmsQiflFwKnm6blnS3/LjNMH5h2m9abTqtenmCu6UPTFfmFyEzT1aYF+YUA3j7LdJ7p5OxaL3D/fA12L5xhOjXv7BPuv6RQv2AbbIStck4xbZQ7gKjfZPpE1bXye5/p/tBXgRsfUvWmH0y3hzbb7n3TarlBEb9/NF0TxtVxqelz02+mY6b9pnMqI3rnQdOKvLMPmMN1oX1YvvamIwVY46ehjcFflNslwbxYX4I1vhPaQCA37ohxTTbOE6ad8rMNbjXtkkdmgkjYJp9UEzh7xHSl6VcNzxnMAePEnfW0PKCadgnr3Cp/d2TMdFNo1zmjE9o857nQroWH5JPhxR2Vxqe9R76gyOZCvTBsZ6yUGz/C8zDgXVl/BBt0TM9m/awhzgXHRGdwlL8R2rz/7dCuhYdg6MtC33bTUyq3733yF7FbeAngmC9MdxftqRi2M9jteXSnaG4KKE4H1s24mJBvNF0c2qOmg6HN9ReK39iMxN54RAHnGC9CRM6Zpo9VNRgv/a4Y83sx5mXTa6oeXU0M2xkYvJszOmpeBwHHuL2mpaaLTF9WRnjgPiqvlrDPW/Jck46nrkk75w6VCRZxc8oXCaLicdNR+Zi/TA+o93q5X2ccqNEv8uIi70dNi01HzaDOgPNNf6q0Ee/shVjG4rB98jz1sGpsh5GplM6VVxp4n5exxdJgPP2efDdMN/1UjEE4ZKpqBPp1Rh2D7ox01AzqjCWmr+Ul7TMq174oDqoB+8UgWS6/B5tj30lHPIPnhTYTT5G/rOjbKHcYHzVwtjw5Me4b04VFfxPDdAYMekxx3pNTKYETS+VB+6aav3tWqXwuDiAXc2wBRVMloc+WJ+Ecop1Jpsl/b7qtvDwBXse7jOvFQMN2Rl0Cv1k+/1fUfXdTabErxrL+uWpeC9c5ohLcz3MSOOn10J6IdJJ1PhG+NKkMri/a/M4XAtfKJ0RCAyqyXaZ7/h5RMmxnjMq/i1JkAgULOXC8aBNgj5jeVVk18o31s3z+EWyWf7ck2BEYOlZfl8ufk8AZ7KwKfGmvVtUhfMhRKaWcsVaedDg7EymPcC3dy1FApGHwHEq9P0zfmhZm13rlnziDORIMi0PfV/K/LdI6U8DEU2GW/G8N1hrBFnX/PrAjdqta9kI6hZKt5sgrrgr8DXJEXgffa9pgelVlfgA8vE6eR/DmS3IvP6lqRcC251ksMMEuwDksMKqj7uc05OOn0hq/rZFNpkPydd5p2iEPqgRrZldQoFwV+ueZPpLbhns78qO7judVk5gLyM8jcoeQCh6rXnaYxA3yvHCLJh9bCR5EZCJ+/99gXRfIjx7W2m2ddRC06b5lqj+eYItqStYCgvozeeImEGLAt/wHdHNSgvKYD+1B/7luaTmBOA58agemL6TFuwAAAABJRU5ErkJggg==>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEGklEQVR4Xu2YXahVRRiG30jBKPynCIWOEYJomQaJiDdiYhcF/UChl16oV4JBoVkcL7wyFQRRvBG9KdT+SMko6JhdiIWgIHgjHEUSBIuiwkCy7znfmbNnzZ619177LJFkPfByzsystdfMvDPfN2tJDQ0NDQ0NDfeTGaN6KG2IeNQ0Ma1sqJcppjOm06aPTI8Um0d4yvSjaVHaAFPlTlYB19eaXk4bOsBzFptmqf9V8ZhpUlo5Dt6X96sbk+UTHcMcxOOYYNovN4D6Q6Zzpoeja/h/2PROVFdgpeluib5TeyfgB3n7e2lDBu7nd1gRwCC2qGRldIHnvZJW9slbpqumJ9OGDDwznZujhSta1wT43ZNRGR5Xl3GvN705qlWm2aZlpsvK38hk/qnezRhUsZMwz/SxfDVVoS4zBkwXVM2Mn0wHTe+a5qo9J+TMGIrKjHVfVM6yI62QO8rKyfGiaad6M2OafBCpGXR0WB6yqlCHGYSQA/LdWcWMw2llAiE7HieL+rOo/KrpRFTOsiYp4zidzcV1Qs4X8knpxQwGyoBzZvwrD5FVqMOMN0xH5GGzTjPmmK5H5dXynQQYQ2LPRZqOLJHHthRMYotuVz1mUPd6Ut+N8ZqBAeSvZ9TqWxUzPpBP8Ca1H3qYn0H5M6abvjItVys8lSbtMjaYrqSV8lMMW+yl0XKvZkC4NoZV0+3+axmRq37N1KNeBntMreNmVTMwMYAR5+WmdiM+xmLYsOk3+UkuF31GIASdNR1PG+QD3a1W0qpiRnqaovyJ/H4OD1UYz84gVMyPylXMyMFOGUwrE5jseJGwmMm5LAh2GIs/C6uVOL41bTC+VTF0VTED2LZ/y1fwJfk7CvdXeU+Bfs1gEbGYYsZrBgcfDjqd3nvIT0QVwIBTap0gF6hDQt8rn6DNaYM8PKThgmtDfTrQHHQ6fCZgAm7Jj7hV6NcMnkf4jcfwi3wM/L1oenbs6iLs6J9VPKYCfaEuTHYK9xGiAk+bbkRl7iNsthEn2l4GW7YznjN9b9oY1YVdMDOqG1Qr/1ShXzNy5HYGYeVD09fysAZL5ebFY2VhsSvejupi2BFxfoKFpj+iMmZ8HpXHCBf2asYe+bW7VExCxFHqGWSAExN1oWPETJJwyD9VqMsMnv286aZ8AQVeMP2l4kKj35+a1oWLjBWmf5TfFeyI0yrmJ2AxEqLDuHnH4sTVBuGCsNEtjvPwIfl1sTABmPjb8u8yARI2OYeExWohd2yL2stIn9FNHDt7ATPTezEAI+gru+J3+VeIALuEkMMYvjTdUfvnkADvaGWJmWT+hIqvCW3QyJmYl7D4w1ZdsHsIV6+p/Xz+f4F5YQx8NhpQ+c4+ovIjK7uMzzAk7m+U/+7XUCOdTlfAV2JOpvdi0Tc0PGD8B5lI9G8Aj+vEAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEQklEQVR4Xu2YW4hOURTHl1DkfolcaoaGcolQyjUJkSiXB+HNAx54URTRePAmoUQijRchPCCUMoMkHqSIXGpI5AERcmf9Zp3d7LPnnO+cb4a+1PnXv5m99j77rL3X9TsiBQoUKFCgQIFKok/EduGEhy7KjqGwwN9FD+U1ZYNyp7JzfLoJVcrrynHhhI+eyvHKQeGEh/bKfpJt+SSw/1TlMGm9V3RVdgqFrcSAUFAC85QLQ2GADsr9YgbgfEeUt8TuzIH/G5UbPFkMWPORmMUAl/xO4pbj/4fKCdG4RvlS+VM52y1KAYodl7hSk5UrvXFebFIuCIU5QWr4qPwhpvfv+HQqMP55sfUh2WdJtA69/D0xNs/5wJFLRkStcnMge6M8JmZtwCXwogfK/mIeWh/JDkVr0jBJeT8UKi6LXVA5aIsxcDIiurs0654HfcXSyjrlUuVosYseKBYJ7o6SjFHvjVm3zxu3QC/lbeWKQP5MLJxcylot9qIXyiESN0ZdtCYNKEmkhagX26cctMUYDr7ueTBUeULZLZCTtsgqDqQyf8/BytPemPXnvHELYD0uPjwgsl/KWdGYFENqcXmW6CBKePmqSJYGp+QYT0Ze3S3l151KGKNauTyQVYlFiw+cFGd1mKs8GP2PYSjsJVNUKWOg7OJA7kC+Z55U43tHEsiT98TW71X2FkuN5RRQh0oYIwQ18LByTSDHsWrFDMUZzyqnSXN6Si3aPjhgWDOICpRlzgdpi7xJl3BVOTI+nQoi67PYno5Z9eJ5AinAbxPkMNdhpW3GcI4V3ksp+G0sBmsUS9tbJKGrDLspxq/FlKVWJIFCiEH8biINpCSKPAVvpvKJ2N6EcAtlMlDpyFim/CrWoucB5/OdhM5zotidcP4wuppA54Tn4mF0Pk/FlCXfp4FoYo0r6mlAmcfemIggXWHIGZ48DyptjIti56UG5AGO6poUDMDzrvuiK0st6PTT7sccNYP2dkQ0V6OcL/HU4lq5UkajLcS4OwI570hKg1motDG4ExyVBiYLZBq/yNOVvfLG6HHSGzeBtpYL4+Icwh9zH8SUx6MdkiKDjumKcm00JuXdFPs1GoLnXLeWF//aGKSVbcoLkuz9PFMv2S05EcFF+59DxordowN7nPHGTaBjOiXND5LTNkq87aQzoHNyBnM1A+X8tXWRjMhyoPP6LvH9eBe9eyVqBk3IHTE9w/fzheFTNJcUtXmMQUQ0KEcFcpcl3D2gB/cag/u4RUHBmtSOUEm85IbYJe8S+zTyTble4p85MOwXiUcC86zjHfzdI9YgZLXEHLwcbrXHSiJ8BnL5GAGgE1HxXjklkvlgfdaXgwOSUpjF6icpDoPgxNvj04bpYulqkZjXJ4ENhot1FHOktEJJ4BneQWtcHZ/6b8DZs34fHZWWzuxARrgrVrgvSbZDFmgjsr4q8/Wa3yt+RilQoEAi/gCyzvyiW6iE5wAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAAXCAYAAAAfiPFCAAAEiUlEQVR4Xu2YW+hlUxzHvxOKRggZt5qhhkQ0KRNGoSEeeECN4skD42UeRjHTRIM8iGSURlLjknKZeHAvmTN4kBcp8mCmhlxCTCMjl8Tv8//t5fzWOnvvs8/Z4sH+1rf2b+21fnut33WdIw0YMGDAgAED/kscVXFR+SJgsfGgcnDAP4vDje8YdxrvNx6Sv17AUuO7xhXli4gjjKuMy8sXAXj7GOOJxgOKd9MQ9c8bFYcaDy4HZwTrz6g4LzD6hmLsQONWuQM43zbj+8rtxPMe4y1hLAMLNypf9IPx+iCTdm8b18gdAnnea7wgzKsD+p9Vrv885fq74jbjFeXgDPjZeHGQv5Kfva2klFhp3F8xgn39GeTjjK8EGRDIrRlxrnxhxD3GN+W1DVxr3CGPzAQiYbvxsTBWB/R/XA4q198VfZyxRG6cmFkPyQOqa5aQEez7N3VzxijI2OvhINcCJeVmOPRIY+MjfyI/UMQTFduAfg5cYqTcuV3QxxlXyo0fgT4MeFMx3oRbjQ/Kq0TpjMuVO4NS/kKQ+f7LQa4FSjD0mWHsdflHU/qul3+IqOAjAMcQ8WsruQlpk1E/dTXq74o+ziDbWR+RonlaQCW8Km/AI0064yTjF0G+zPho9YzNaOytJQpQx9gQJHKONL6nvHSdbvyumkOKMucp43OaHt3o/0i5/s2aLI1d0McZGLzJGSNNPwcliv7IvJEmnUFgbZY7izO+JJ+fylNj0y5xg7y5JaewuKznRPNdxl/lc/6Qp22XmxHNO+qHpf4Sn9fwJ/nlohyHbYdNBpzXGUT0juq5yRlNiNdYHLZHXrY3qcZ2GJkaeLz8prFLvkFSLE3G02/Js+Ew475qDsQhbeUG/TT5Nv1dMW9m4HhK7DzOYJxaf0mQR+rmDM4XgwQd58htwvknSjyTlwWZjafIv7Aa2yp3GKkKjpU3J+Z9Yzy1Gq8D+j8NMvopV1F/V8zrDDBvmcJgD2gccLM442qN9eIAejFlC3Bpyhr60aq/dhLtbDJt/nvjdePXC8DreJd5TQZK+mmeERws6u+KPs6oa+BXyffxtOqzG0NSnr7VuBzSpAkk1iGv/nt2jqXyEpVwsvHrIKP7+SAvRDrNutzIcvlH04d4Lg8CLjJ+ZjytkrkxsfmbKznp31bJEVF/V/RxBred7RpHJiBD6YH8FgIE2B3G1zS+NZbokhlkBIaOf4ecZfwxyOh5McgL4JfwGuUOocZzU0o1/W550+GXc0LqI7xLaykFRAwOSkD/78r1s8movyv6OIPvY8CVYWy3PFDSPs6Wz2nLWiL+A02eKYH3O+U30IhUJdKaE+Q3rgzcdH6R34PXGbcYn9G4PwCMd588PfHm43Iv36vcoKQ9umImoB+9UT99JuqvAwaZhbf7slawry/l+7jR+IY8qBLYE1nBBeX8MJ6QHBVZBscjqmnMFeifS+QOoRXcmb92sIlL5X3hGtV7HKCIj0OeZ0HUvyx/9a+Bc50i/3uHvTSdsw+eVHPGE9Qfyhs3gTAtIAf0xLR/lfn3mh/Cs/7rPWDA/xB/AdoTDNdEVCnSAAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAAB+klEQVR4Xu2Uv0tXURjGn6jAMLCUEMEkGyIlcCgVRBykoMVAFwN36y9QnMXBxoiGlnAQF1dBQeSLLoKORg05COogRCAoVIM+T+85l/ee7qVfEA33gQ/3nve+557n/HqBSpUq/Z2ukT7Sln74BdWRe+Rq+oG6TJrJhSTekLRxhWyRG6GtDsekN8so13NySgZD+y45JFNZBtBC9siZ4yPpdjnf9Zg8S2LvyDLMZJk0y/dkCbYiUS/JZ9eWEU30FXkBM61Vykmzf0seJvEa+UQ6krjXE9jsNLDXZIhHyUgtPEt1Heb2fhKfg/1sKIl7zcByNLCX+vy2kbh/ZUbSQbzKcqKReHCjkdvkDWx7OpEcXhk4CU+vskG8aijOKTKyTXpCWwZmQ06mLtgN+RMjqyjOSY0UKeZkV/hfbE2R+sk3uMtQdljnYT8bSeJeZYdVfRTXFuia6tqqtjxyOYVH4ikZ8wFYHdlEvvq9hq1CjLWTfbJILsUk2HX+Et6Vu0EWSGuWYXVLZn0/NJF15Af9SkZdW1JHEa+0ZjwNm1mswrfILqw2Ran6ykh9aKuCaxd80cukCrkGWxkt+QS5mMsAdsgHcsfF9HMNekDGYaV7hTS6HG2PbokMakWPQt4PJV5S8gDMyHDy7WfSysic+uqZqw9ON2E5D1BQ4iv9lzoHFFdwwQSTLygAAAAASUVORK5CYII=>