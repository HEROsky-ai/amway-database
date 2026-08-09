# 🌟 安麗萬能資料庫 (Amway Omni-Database)

專為團隊與個人打造的高效數位萬能資料庫，網頁版原生支援：**營養保健** 🥗、**淨水器** 💧、**空氣清淨機** 🍃、**事業與起步** 💼 四大分層頁籤，並具備全域關鍵字搜尋、一鍵複製推廣文案、新增/編輯條目、備份匯出匯入與 Vercel 多人共享資料庫功能。

---

## 🚀 快速開始 (Local Development)

要在本機電腦啟動此專案，請開啟終端機 (Terminal) 並執行：

```bash
# 1. 安裝套件
npm install

# 2. 啟動開發伺服器
npm run dev
```

接著開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 即可瀏覽與調校雛形資訊！

---

## ☁️ 1 分鐘部署到 Vercel (多人共享網址)

想要讓知道網址的夥伴都能共享與填寫資料？請依以下簡單 3 步驟操作：

1. **上傳至 GitHub**:
   將本專案資料夾推送到您的 GitHub 儲存庫。
2. **在 Vercel 點擊 Deploy**:
   開啟 [Vercel.com](https://vercel.com)，登入後點擊 **"Add New" -> "Project"**，選擇剛剛的 GitHub 儲存庫並點擊 **Deploy**。
3. **獲得免費分享網址**:
   部署完成後會獲得專屬網址 (例如 `https://amway-database.vercel.app`)，將此網址發送給夥伴即可開啟跨裝置共享！

---

## ✨ 核心功能說明

| 功能名稱 | 說明 |
| :--- | :--- |
| **四大核心分頁** | 獨立區隔 營養 🥗、淨水器 💧、空氣清淨機 🍃、事業 💼 內容與問答。 |
| **動態搜尋與標籤過濾** | 關鍵字即時比對標題、摘要、內文、QA 答辯庫與分類標籤。 |
| **富文本與 QA 答辯庫** | 支援多條亮點清單、問答 (Q&A) 與外部參考連結。 |
| **一鍵複製推廣文案** | 點擊卡片「複製文案」或詳情頁「複製 QA」，快速分享至 LINE/微信。 |
| **資料庫編輯與新增** | 提供直覺式 Modal 彈窗，可隨時補充新品資訊或修正文案。 |
| **資料備份與匯入** | 支援一鍵下載 JSON 備份檔，也可於任何裝置上傳 JSON 進行還原。 |
| **即時雲端同步** | 預設包含 LocalStorage 與 Serverless REST 同步；亦可填入免費 Supabase 金鑰實現毫秒級多人同時寫入。 |

---

## 📂 專案目錄架構

```
├── app/
│   ├── layout.tsx         # 全域根佈局與 SEO Meta 設定
│   ├── page.tsx           # 萬能資料庫主頁面與狀態管理
│   ├── globals.css        # 高質感深色/玻璃擬物 (Glassmorphism) 視覺主題
│   └── api/items/route.ts # Serverless 資料同步 API 端點
├── components/
│   ├── Header.tsx         # 頂部導覽與全域動作按鈕
│   ├── TabNavigation.tsx  # 四大分頁（營養/淨水器/空氣清淨機/事業）
│   ├── SearchAndFilter.tsx# 搜尋列、熱門標籤與精選過濾
│   ├── ItemCard.tsx       # 條目卡片元件
│   ├── ItemDetailModal.tsx# 詳情與 QA 答辯彈窗
│   ├── EditItemModal.tsx  # 新增 / 編輯資料表單
│   └── CloudSyncModal.tsx # Vercel 部署與 Supabase 雲端設定
├── lib/
│   ├── types.ts           # 資料結構與分類型別定義
│   ├── initialData.ts     # 預載雛形範例資料庫
│   └── db.ts              # 本機與雲端資料存取介面
└── package.json
```
