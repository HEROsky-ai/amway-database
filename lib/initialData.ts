import { DatabaseItem } from './types';

export const INITIAL_ITEMS: DatabaseItem[] = [
  // 1. 營養保健 (nutrition)
  {
    id: 'nut-001',
    title: 'Double X 綜合營養片 (核心全面防護)',
    category: 'nutrition',
    subcategory: '核心基礎保健',
    tags: ['Double X', '植物胜肽', '綜合維生素', '抗氧化', '明星商品'],
    summary: '提供 12 種維生素、10 種礦物質及 21 種植物濃縮素，專利 PHYTOCOLOR 專利配方。',
    content: `Double X 是鈕崔萊 90 年研發極致成果，結合科技與天然植物精華。

【三大組成】
1. 維生素錠 (錠劑 A)：提供每日人體必需之完整維生素 A, B群, C, D, E。
2. 礦物質錠 (錠劑 B)：包含鈣、鎂、鋅、銅、錳、硒等關鍵礦物質。
3. 植物濃縮素錠 (錠劑 C)：集合五色蔬果植物因子（迷迭香、薑黃、槐樹等）。

【建議食用方式】
每日食用兩次，每次各含三種錠劑各一顆（早晚隨餐食用最佳）。`,
    highlights: [
      '包含 21 種植物濃縮素，提供多色植物因子保護力',
      '專利防護成分包含薑黃、迷迭香與槐樹萃取精華',
      '不含人工香料、防腐劑與化學色素',
      '臨床證實有助提升整體抗氧化能力與精力平衡'
    ],
    qa: [
      {
        question: 'Double X 和市面上一般的綜合維生素有什麼差別？',
        answer: '市售多為化學合成維生素，Double X 含有 21 種天然有機農場栽培的五色蔬果植物因子，能提供植物化學素 (Phytochemicals) 協同防護。'
      },
      {
        question: '孕婦或青少年可以食用 Double X 嗎？',
        answer: '青少年可依需求調整劑量，孕婦建議先諮詢醫師或依專門孕期補充劑選用。'
      }
    ],
    links: [
      { label: '鈕崔萊官網 Double X 研發故事', url: 'https://amway.com' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    isFavorite: true,
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'nut-002',
    title: '鈕崔萊 全植物蛋白質粉 (9 種必需胺基酸)',
    category: 'nutrition',
    subcategory: '基礎營養代謝',
    tags: ['蛋白質粉', '大豆蛋白', '零膽固醇', '低脂肪', 'PDCAAS=1'],
    summary: '來自大豆、小麥及黃豌豆的純植物優質蛋白質，PDCAAS 國際評分達到最高分 1。',
    content: `【產品特點】
* 消化吸收率最高：PDCAAS = 1 (Protein Digestibility Corrected Amino Acid Score)
* 比例完美：提供人體無法自行合成的 9 種必需胺基酸。
* 健康無負擔：純植物配方，零膽固醇、低脂肪、無乳糖。

【適用對象】
* 成長期青少年、運動健身者、熟齡保養、體力恢復期族群。

【食用沖泡建議】
將 1 匙 (約 10 克) 加入 200ml 常溫水、豆漿或牛奶中搖勻飲用，切勿使用超過 70°C 熱水直接沖泡，避免蛋白質凝固。`,
    highlights: [
      '純植物來源：大豆 + 小麥 + 豌豆黃金三原色',
      '每一匙可提供約 8 公克優質蛋白質',
      '無添加香料與糖分，可添加於湯品或奶昔中'
    ],
    qa: [
      {
        question: '尿酸高或有痛風疑慮的人可以喝嗎？',
        answer: '鈕崔萊植物蛋白粉經高科技去純化處理，普林 (Purine) 含量極低，一般健康保養量補充無虞。若有嚴急性痛風發作期請先諮詢醫師。'
      }
    ],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80',
    isFavorite: false,
    updatedAt: '2026-08-02T11:30:00Z',
  },

  // 2. 淨水器 (water)
  {
    id: 'wat-001',
    title: 'eSpring 益之源淨水器 經典款 vs 智慧新一代比較表',
    category: 'water',
    subcategory: '機型比較與規格',
    tags: ['eSpring', '益之源', '紫外線淨水器', '濾心技術', 'NSF認證'],
    summary: '採用「高密度活性碳濾心」搭配「UV 紫外線殺菌燈」，通過 NSF 42/53/55/401 認證。',
    content: `【eSpring 雙重核心過濾技術】
1. 第一重 - 高密度高活性碳濾心：有效濾除超過 170 種有害污染物（包括重金屬鉛、汞、微塑膠、有機化學物、農藥等），並保留水中有益礦物質（鈣、鎂）。
2. 第二重 - 紫外線殺菌 (UV-C)：殺滅 99.99% 水中常見細菌與病毒。

【關鍵 NSF 認證項目】
* NSF/ANSI 42：口感品質（氯味、濁度）
* NSF/ANSI 53：健康品質（鉛、VOCs、農藥）
* NSF/ANSI 55：Class A 紫外線微生物殺菌
* NSF/ANSI 401：新興污染物（微塑膠、藥殘）`,
    highlights: [
      '高密度活性碳＋紫外線殺菌雙重防護',
      '保留對人體有益之鈣、鎂礦物質',
      '通過 NSF 國際水質權威四大認證',
      '智慧晶片發光監控，精準提醒濾心壽命'
    ],
    qa: [
      {
        question: '淨水器濾心多久需要更換一次？',
        answer: '原則上為「使用滿 1 年」或「總過濾水量達到 5,000 公升」（以先到者為準）。面板上會有提示警示燈號。'
      },
      {
        question: '過濾出來的水可以直接生飲嗎？',
        answer: '可以。經過紫外線殺菌後的生飲水潔淨安全，無需再燒開，高溫煮沸反而會使部分有益礦物質沉澱結晶。'
      }
    ],
    links: [
      { label: 'eSpring 淨水技術教學影片', url: 'https://amway.com' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=80',
    isFavorite: true,
    updatedAt: '2026-08-03T14:20:00Z',
  },
  {
    id: 'wat-002',
    title: '益之源淨水器 常見故障排除與保養步驟',
    category: 'water',
    subcategory: '故障排除與維護',
    tags: ['故障排除', '濾心更換', '嗶嗶聲警報', '出水變小', '維修'],
    summary: '當螢幕顯示紅燈或發出嗶嗶聲時的檢測與排解方法指南。',
    content: `【現象一：機器嗶嗶聲響不停 / 紅燈亮起】
* 原因：濾心壽命已盡，或分流器未正確導通。
* 解法：確認過濾總量或年限，如已滿 5000L 請更換新濾心；若為新品，檢查電源線與上蓋感應是否扣緊。

【現象二：出水量變小】
* 原因：當地水質較硬或水壓過低，雜質預過濾網偏髒。
* 解法：檢查自來水進水閥門是否完全開啟，若使用超過 9 個月且水質較濁區域，建議提早更換濾心或清洗分流閥。

【現象三：出水有異味】
* 解法：長期未停用後重新開啟時，請先讓水流暢運轉 3 分鐘後再飲用。`,
    highlights: [
      '簡易 3 步驟判斷發光面板燈號訊息',
      '更換濾心時記得先關閉水閥並解除壓力',
      '定期清洗觸控分流閥避免卡垢'
    ],
    qa: [],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
    isFavorite: false,
    updatedAt: '2026-08-04T09:15:00Z',
  },

  // 3. 空氣清淨機 (air)
  {
    id: 'air-001',
    title: 'Atmosphere Sky 逸新空氣清淨機 (旗艦型 13 坪)',
    category: 'air',
    subcategory: '旗艦機型規格',
    tags: ['Atmosphere Sky', 'HEPA', '超極細濾網', '英國過敏協會認證', 'CADR'],
    summary: '過濾微粒細小至 0.0024 微米，過濾率高達 99.99%，適合客廳與主臥房。',
    content: `【三大濾網防線】
1. 第一層 - 前置濾網：攔截毛髮、大顆粒灰塵，可拆下水洗。
2. 第二層 - 醫療級 HEPA 濾網：可過濾 0.0024 微米極小微粒（比 PM2.5 細小 1000 倍！包含 PM0.3、病毒、細菌、二手煙）。
3. 第三層 - 高效活性碳濾网：填滿大量椰殼活性碳，有效吸附甲醛、苯、總揮發性有機物 (TVOC) 及寵物異味。

【認證與數據】
* 英國過敏協會 (Allergy UK) 認證全類別 22 種過敏原全數過濾
* 美國家電協會 (AHAM) CADR 潔淨空氣輸出率認証`,
    highlights: [
      '濾除小至 0.0024 微米懸浮微粒 (業界極致極限)',
      '全機 CADR 達 300 CFM (每小時可清淨廣大面積多次)',
      'App 智慧遠端遙控與即時空氣品質 monitor',
      '低速運轉僅 22 分貝，睡眠超靜音'
    ],
    qa: [
      {
        question: '前置濾網多久需要清洗？HEPA 濾網多久更換？',
        answer: '前置濾網建議每 2~4 週拆下沖洗或用吸塵器清理；HEPA 與活性碳濾網依面板指示燈提示更新（通常為 1~5 年，視環境污濁度而定）。'
      }
    ],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    isFavorite: true,
    updatedAt: '2026-08-05T16:00:00Z',
  },
  {
    id: 'air-002',
    title: 'Atmosphere Mini 逸新空氣清淨機 (輕巧型 6-8 坪)',
    category: 'air',
    subcategory: '小空間首選',
    tags: ['Atmosphere Mini', '小資套房', '兒童房', '靜音濾淨', '省電'],
    summary: '專為書房、套房、兒童房設計，具備相同的 0.0024 微米高規格過濾力。',
    content: `【產品亮點】
* 尺寸輕巧，佔地面積小於一張 A4 紙。
* 三合一整合式濾網，換濾心單手即可完成。
* 具備安靜夜間模式，運轉省電消耗功率低。

【適用場景】
* 大學生宿舍、單身小資套房、幼兒房、居家工作室。`,
    highlights: [
      '同級最高過濾規格：0.0024 微米 99.99% 過濾率',
      '極致省電設計，24 小時運轉每日電費僅約數美分/零錢',
      '一體成型濾網，更換極為簡便'
    ],
    qa: [],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600&auto=format&fit=crop&q=80',
    isFavorite: false,
    updatedAt: '2026-08-06T12:00:00Z',
  },

  // 4. 事業與起步 (business)
  {
    id: 'bus-001',
    title: '安麗事業 新手起步 90 天心法與行動清單',
    category: 'business',
    subcategory: '新手起步指南',
    tags: ['90天起步', '事業心法', '自用體驗', '名單梳理', '目標設定'],
    summary: '從產品自用體驗、建立學習習慣到第一批 20 位顧客名單開發全流程。',
    content: `【階段一：第 1 - 30 天 奠定基礎】
1. 產品體驗者心態：親自換用居家必備品（營養、淨水、洗滌），記錄真實轉變與心心得。
2. 了解事業亮點：掌握安麗自主創業、無庫存壓力、無風險保障的優勢。
3. 參加基礎研討會：認識團隊與成功導師。

【階段二：第 31 - 60 天 建立名單與溝通】
1. 列出 30 位潛在需求名單（分為：健康保養需求、居家潔淨需求、斜槓增加收入需求）。
2. 練習使用本「萬能資料庫」進行解答與資料分享。

【階段三：第 61 - 90 天 啟動分享與輔導】
1. 協助第一位直屬夥伴開箱體驗與設定學習計畫。`,
    highlights: [
      '清晰 30/60/90 天階段性實踐藍圖',
      '以「幫助他人解決健康或收入需求」為核心心態',
      '善用數位萬能庫進行線上高效發布與答辯'
    ],
    qa: [
      {
        question: '剛開始加入如果親友反對該怎麼辦？',
        answer: '切忌爭辯！保持理解態度，先將重點放在自己的改變與真實體驗上，分享專業知識而非強行推銷。'
      }
    ],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    isFavorite: true,
    updatedAt: '2026-08-07T08:30:00Z',
  },
  {
    id: 'bus-002',
    title: '安麗核心獎金制度解析 (月結獎金與年終分紅)',
    category: 'business',
    subcategory: '獎金制度解析',
    tags: ['獎金制度', 'PV/BV', '績效獎金', 'Core Plus', '斜槓收入'],
    summary: '理解 PV/BV 比率、3%~21% 銷售績效獎金與 Core Plus 額外獎勵機制。',
    content: `【基礎名詞概念】
* PV (Point Value / 積分額)：決定您的獎金比率階級 (如 200 PV = 3%, 10,000 PV = 21%)。
* BV (Business Volume / 淨營業額)：實施計算實際核發獎金金額的基數。

【核心績效獎金階級表】
* 200 PV  -> 3%
* 600 PV  -> 6%
* 1,200 PV -> 9%
* 2,400 PV -> 12% (銅牌過渡獎勵)
* 4,000 PV -> 15% (銅牌創業者獎金)
* 7,000 PV -> 18%
* 10,000 PV -> 21% (白金 Platinum 基礎)

【Core Plus 額外加碼】
新創業者在建立結構健康團隊（如帶領 3 個小組達到特定 PV）時，可獲得 20% - 30% 額外加碼獎金！`,
    highlights: [
      '多勞多得、公平透明的無限代結構',
      '多重收益來源：零售利潤 + 月績效獎金 + Core Plus 加碼',
      '具備世代繼承與可持續累積之事業資產價值'
    ],
    qa: [],
    links: [],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    isFavorite: false,
    updatedAt: '2026-08-08T15:45:00Z',
  },
];
