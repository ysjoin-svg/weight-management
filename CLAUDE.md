# 體重管理師網站 — 專案說明

## 專案概述

Dr. Li 科學體重管理的**行銷型招募網站**，目標是讓潛在學員了解服務內容、建立信任感，並主動聯繫報名。

**技術**：純 HTML / CSS / JavaScript（靜態網站，無需後端）  
**部署**：GitHub Pages

---

## 注意：目錄內有獨立子專案，請勿混用

| 路徑 | 說明 |
|------|------|
| `適應期注意事項/` | **學員專屬教材**，獨立單頁，有自己的 CLAUDE.md |
| `份量代換表/` | **學員專屬教材**，獨立單頁，有自己的 CLAUDE.md |
| `獨立頁面/` | 其他獨立教材頁面 |

以上子目錄**不隸屬於主網站**，有各自的定位、受眾與版本管理，修改時請以各自目錄為範圍，不要互相引用或牽連。

---

## 學員專屬教材規範

### 定位
- 教材**不會在主網站產生任何連結**，由 Dr. Li 直接傳送給學員
- 每份教材各自建立一個獨立目錄，目錄內附有自己的 `CLAUDE.md`
- 新增教材時，目錄名稱即為教材名稱（例如 `飲食紀錄表/`）

### Header 標準樣式
每份教材的首頁 header **必須** 套用以下結構，不得自行發明其他樣式：

**HTML 結構：**
```html
<div class="page-header">
  <div class="brand-bar">
    <div class="brand-left">
      <img src="../logo.jpg" alt="Dr. Li" class="brand-logo">
      <span class="brand-name">Dr. Li 科學體重管理師</span>
    </div>
    <div class="badge">學員專屬教材</div>
  </div>
  <div class="hero-content">
    <h1>教材名稱</h1>
    <p>副標題說明文字</p>
  </div>
</div>
```

**CSS（貼入各教材的 `<style>` 區塊）：**
```css
.page-header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); color: #fff; }
.brand-bar { display: flex; align-items: center; justify-content: space-between; padding: 0 1.25rem; height: 56px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.brand-left { display: flex; align-items: center; gap: 0.5rem; }
.brand-logo { height: 36px; width: auto; object-fit: contain; border-radius: 6px; }
.brand-name { font-size: 1.15rem; font-weight: 700; }
.hero-content { padding: 2.5rem 1.25rem 2rem; text-align: center; }
.badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; padding: 0.28rem 0.9rem; border-radius: 99px; }
.page-header h1 { font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 900; margin: 0.8rem 0 0.4rem; }
.page-header p { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
```

### `<head>` 標準設定
- **Favicon**：將 `logo.jpg` 轉為 Base64 data URL 嵌入（避免路徑問題）
- **Title 格式**：`Dr. Li 科學體重管理師-{教材名稱}`
- 使用 Node.js 指令從 `logo.jpg` 產生 Base64：
  ```js
  const b64 = require('fs').readFileSync('../logo.jpg').toString('base64');
  // → data:image/jpeg;base64,<b64>
  ```

---

## 頁面架構（Sitemap）

```
index.html        首頁（主視覺 + Hero + 服務速覽 + CTA）
about.html        關於我（個人故事、專業背景、服務理念）
services.html     服務內容（四大服務詳解 + 收費方案）
results.html      成果案例（學員數字對比）
faq.html          常見問題
contact.html      聯絡 / 報名表單
```

---

## 技術架構

```
體重管理師網站/
├── css/
│   ├── main.css          全站共用樣式
│   └── components.css    元件樣式（卡片、按鈕、導航等）
├── js/
│   ├── main.js           導航、滾動效果
│   └── contact.js        表單驗證
└── images/               網站圖片資源
```

**外部資源（CDN）**：
- Google Fonts：Noto Sans TC + Inter
- Bootstrap Icons
- Chart.js（results.html 用於學員趨勢圖）

---

## 色彩系統

| CSS 變數 | 色碼 | 用途 |
|---------|------|------|
| `--primary` | `#2C7BE5` | 主色（信任藍） |
| `--accent` | `#27AE60` | 強調色（健康綠、CTA 按鈕） |
| `--red` | `#E74C3C` | 警示（需改善的數值） |
| `--bg` | `#F8FAFC` | 頁面背景 |
| `--text` | `#1A1A2E` | 主文字 |
| `--muted` | `#6C757D` | 說明文字 |

---

## 設計原則

- **行動裝置優先**（學員主要透過手機分享連結）
- 每頁至少一個 CTA 按鈕，統一用強調綠
- 數字、數據用卡片 + 標籤視覺化呈現
- 每頁 `<head>` 需有完整 SEO meta（description、OG tags）

---

## 目標族群

| 族群 | 核心痛點 |
|------|---------|
| 25–45 歲上班族 | 久坐、代謝下降、體脂偏高 |
| 體檢紅字困擾者 | 血脂血糖異常但不知如何改善 |
| 曾節食失敗者 | 體重反彈、肌肉量流失 |
| 健身停滯者 | 長期運動但體脂未降 |
