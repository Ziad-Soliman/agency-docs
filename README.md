# New Agency Egypt — Realtime Notion Documentation Engine 🇪🇬

An agency-grade, real-time documentation and knowledge base web application built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Framer Motion**, and the **Notion API**.

Whatever pages, blocks, callouts, or tables you add or edit in Notion appear immediately on the website in real-time.

---

## ⚡ Key Features

- **Live Notion Sync**: Dynamic server-side rendering with instant on-demand revalidation, live connection beacon, and manual refresh trigger.
- **Complete Notion Block Renderer**:
  - Rich Text (Bold, Italic, Strikethrough, Underline, Code, Color highlights, `@Page` mentions, Inline Math via KaTeX)
  - Headings (H1, H2, H3) with anchor links and active Table of Contents scrollspy
  - Callout blocks with custom Notion background colors and custom icons
  - Multi-column and multi-row tables with header rows, row headers, and responsive horizontal scroll
  - macOS styled Code Blocks with syntax highlighting, language badges, and one-click copy
  - Grouped bulleted & numbered lists
  - Interactive To-Do / Checkbox items
  - Collapsible Toggle / Accordion items with nested child blocks
  - Blockquotes, Dividers, Images with lightbox preview, Bookmark cards, KaTeX equations
- **High-End UI & UX**:
  - Vercel / Stripe / Mintlify documentation aesthetic
  - Dark and Light mode toggle with smooth theme transitions
  - Spotlight Search (`⌘K`) across all Notion pages, blocks, and Arabic/English text
  - Bilingual & RTL Support (Cairo & Plus Jakarta Sans typography)
  - Responsive mobile drawer and layout collapse

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (or 20+)
- A Notion integration token and root page ID

### 2. Installation
```bash
git clone https://github.com/Ziad-Soliman/agency-docs.git
cd agency-docs
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
NOTION_API_KEY=ntn_your_notion_api_key
NOTION_ROOT_PAGE_ID=your_root_page_id
NEXT_PUBLIC_NOTION_ROOT_PAGE_ID=your_root_page_id
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router) & React 19
- **Styling**: Tailwind CSS & `@tailwindcss/typography`
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Math / LaTeX**: KaTeX
- **Theme**: `next-themes`
