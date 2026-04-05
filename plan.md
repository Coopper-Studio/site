# Cooper Studio 问题清单与改造计划

## 目标

这份文档聚焦当前项目已经暴露出来的真实问题，并给出一套可落地的修复与演进方案。目标不是泛泛而谈“可以优化什么”，而是回答三件事：

1. 这个项目现在具体有什么问题
2. 为什么这些问题重要
3. 应该如何实现修复或改造

我会优先按影响面排序：先处理会影响内容正确性和部署正确性的，再处理搜索、信息架构和工程一致性问题。

---

## 一、当前项目的主要问题

## 1. 静态导出产物 `out/` 与源码明显不同步

### 现象

仓库中的 `out/` 目录仍包含旧模板内容，例如：

- `Hello World`
- `Your first document`
- `out/blogs/test.html`
- 旧版 `out/llms-full.txt`

但源码中的真实内容已经变成了两篇中文文章。

### 为什么这是严重问题

当前部署配置 `wrangler.jsonc` 明确把 `./out` 当成发布目录：

```json
{
  "assets": {
    "directory": "./out"
  }
}
```

如果部署直接使用这个目录，那么线上站点就可能发布旧内容，而不是当前源码表达的内容。

### 根因判断

大概率是以下两种情况之一：

1. 源码改了，但没有重新导出静态产物
2. 构建链路没有把旧 `out/` 清理掉，导致历史文件残留

### 解决方案

应该把“构建”和“导出目录清理”变成一个稳定、可重复的流程。

### 实现步骤

1. 在构建前删除旧的 `out/`
2. 重新执行 `next build`
3. 在本地验证 `out/llms-full.txt`、`out/blogs*.html` 是否与源码一致
4. 再将 `out/` 交给 Wrangler 发布

### 建议代码

先补一个清理脚本到 `package.json`：

```json
{
  "scripts": {
    "clean": "rm -rf .next out",
    "build": "npm run clean && next build"
  }
}
```

如果不希望在脚本里直接写 `rm -rf`，也可以引入 `rimraf`：

```json
{
  "scripts": {
    "clean": "rimraf .next out",
    "build": "npm run clean && next build"
  }
}
```

然后增加一个简单的产物校验脚本，例如 `scripts/check-export.mjs`：

```js
import { readFileSync } from "node:fs";

const llmText = readFileSync("out/llms-full.txt", "utf8");

if (!llmText.includes("为什么成立 Cooper Studio")) {
  throw new Error("导出产物不是当前源码内容：缺少最新博客标题");
}

if (llmText.includes("Hello World")) {
  throw new Error("导出产物仍包含旧模板内容");
}

console.log("export check passed");
```

然后把它接到构建链路里：

```json
{
  "scripts": {
    "build": "npm run clean && next build && node scripts/check-export.mjs"
  }
}
```

---

## 2. 部署路径不够清晰，`next-on-pages` 与纯静态导出思路混在一起

### 现象

仓库同时存在：

- `next.config.mjs` 中的 `output: "export"`
- `wrangler.jsonc` 的静态资源目录配置
- `.next-on-pages.config.js`
- `wrangler.toml`

### 为什么这是问题

这会带来维护认知混乱：

- 当前到底是“纯静态站点”还是“Next on Pages”？
- 某些配置是否已经废弃？
- 构建失败时该查哪条链路？

如果团队未来继续迭代，这种配置重叠会让问题定位成本变高。

### 解决方案

应该明确二选一：

1. **保留纯静态导出方案**
2. **切换到 Cloudflare 的 Next 运行时方案**

从当前项目复杂度看，我建议继续用 **纯静态导出方案**，因为：

- 项目没有真实动态后端需求
- 搜索、博客、OG、LLM 导出都可以静态生成
- 静态托管更简单、更稳定、更便宜

### 实现步骤

1. 把部署流程文档化，明确“构建后发布 `out/`”
2. 检查 `.next-on-pages.config.js` 是否仍有必要
3. 如果没有实际使用 next-on-pages，就删除相关残留配置
4. 保留最少量的 Wrangler 配置

### 建议目标配置

`next.config.mjs`：

```js
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

export default withMDX({
  reactStrictMode: true,
  output: "export",
});
```

`wrangler.jsonc`：

```json
{
  "name": "site",
  "compatibility_date": "2026-01-01",
  "assets": {
    "directory": "./out"
  }
}
```

如果最终确定完全不走 next-on-pages，则可以删除 `.next-on-pages.config.js`，并在 README 中明确写出部署方式：

```md
## Deploy

1. `npm run build`
2. 确认最新静态文件已经生成到 `out/`
3. 用 Wrangler 发布 `out/`
```

---

## 3. 搜索语言配置与中文内容不匹配

### 现象

当前搜索实现：

```tsx
const { search, setSearch, query } = useDocsSearch({
  type: "static",
  initOrama,
});
```

Orama 初始化配置为：

```tsx
function initOrama() {
  return create({
    schema: { _: "string" },
    language: "english",
  });
}
```

但当前博客正文主体是中文。

### 为什么这是问题

搜索的匹配质量会直接影响内容可发现性。对中文内容强行使用英文语言配置，通常意味着：

- 分词不准确
- 查询召回效果弱
- 搜索结果排序不理想

### 解决方案

分两步推进：

1. 先确认 Fumadocs + Orama 对中文的支持边界
2. 如果现有方案对中文支持有限，至少要通过更合理的字段组织或 fallback 逻辑改善体验

### 低风险改造方案

先移除语言误导，尝试更中性的配置；如果底层库支持 `chinese`，则切到中文；如果不支持，就保留默认并补业务侧兜底。

### 建议代码

如果 Orama 支持中文：

```tsx
function initOrama() {
  return create({
    schema: { _: "string" },
    language: "chinese",
  });
}
```

如果不支持，至少在搜索空结果时增加引导文案：

```tsx
const items =
  query.data && query.data !== "empty" && Array.isArray(query.data)
    ? query.data
    : null;

const showEmptyHint = !query.isLoading && search.length > 0 && !items?.length;
```

```tsx
<>
  <SearchDialogList items={items} />
  {showEmptyHint ? (
    <div className="px-4 pb-4 text-sm text-muted-foreground">
      No results. Try shorter keywords or search by article title.
    </div>
  ) : null}
</>
```

更进一步，可以为中文内容单独加标题关键词权重。即使 Fumadocs 默认索引不方便改，也可以在内容标题中保持高信息密度。

---

## 4. 首页项目区与博客内容完全断开，维护成本会逐步上升

### 现象

首页中的项目卡片全部硬编码在组件里，例如：

- `Rainbow Paths`
- `Emotion Cards`
- `AI Color Palette`
- `CLI Boilerplate`

这些内容与 `content/blogs` 没有任何联动。

### 为什么这是问题

随着项目增多，会出现典型问题：

- 首页要改一份
- 博客要改一份
- 未来如果有项目详情页，还要再改一份

同一信息分散在多个位置，很容易不一致。

### 解决方案

把首页项目数据抽到单独的数据层，哪怕一开始不是 CMS，也至少做到“单点维护”。

### 推荐实现方式

新建一个本地数据文件，例如：

- `lib/projects.ts`

### 建议代码

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  category: "product" | "experiment";
  status: "live" | "development" | "prototype";
  techStack: string[];
  href?: string;
}

export const projects: Project[] = [
  {
    slug: "rainbow-paths",
    title: "Rainbow Paths",
    description:
      "Global LGBTQ+ rights map tracking decriminalization, depathologization, and marriage equality worldwide.",
    category: "product",
    status: "live",
    techStack: ["Next.js", "TypeScript", "ECharts", "TailwindCSS"],
    href: "https://rainbow-paths.cooper-ai.org/",
  },
  {
    slug: "emotion-cards",
    title: "Emotion Cards",
    description:
      "A quiet product for emotional awareness. Just 30 seconds a day to check in with your emotions.",
    category: "product",
    status: "development",
    techStack: ["SwiftUI", "iOS", "Core Data"],
  },
];
```

然后在首页组件里统一读取：

```tsx
import { projects } from "@/lib/projects";

const productItems = projects.filter((item) => item.category === "product");
const experimentItems = projects.filter((item) => item.category === "experiment");
```

这一步的价值不是“高级”，而是先把维护入口统一掉。

---

## 5. UI 语言中英混合，但项目并没有真正 i18n

### 现象

站点外壳大量英文：

- `Blogs`
- `View Products`
- `Explore Experiments`

博客内容主体则是中文。

### 为什么这是问题

这会让站点呈现一种未完成的语言体验：

- 中文用户会觉得 UI 语言不统一
- 英文用户也无法真正读懂正文

如果这不是有意为之，就应该尽快收口。

### 解决方案

短期内不要急着上完整 i18n，而是先做 **单语一致化**。

最现实的两种方向：

1. 全站统一成中文
2. 全站统一成英文，并逐步翻译内容

从当前内容现状看，更适合先统一成中文 UI。

### 建议改动

`lib/layout.shared.tsx`：

```tsx
links: [
  {
    icon: <BookIcon />,
    text: "博客",
    url: "/blogs",
    secondary: false,
  },
],
```

`HeroSection`：

```tsx
<Button asChild>
  <Link href="#products">查看项目</Link>
</Button>

<Button variant="outline" asChild>
  <Link href="/blogs">阅读博客</Link>
</Button>
```

如果后续真的要做多语言，再引入字典层：

```ts
export const zh = {
  nav: {
    blogs: "博客",
  },
  home: {
    viewProducts: "查看项目",
    exploreExperiments: "阅读实验",
  },
};
```

---

## 6. 字体声明与实际加载不一致

### 现象

`app/global.css` 里声明：

```css
--font-sans: DM Sans, sans-serif;
--font-mono: Space Mono, monospace;
```

但 `app/layout.tsx` 实际只加载了：

```tsx
import { Inter } from "next/font/google";
```

### 为什么这是问题

视觉设计意图和真实运行结果不一致时，会带来两个问题：

1. 开发者以为站点在使用某套字体
2. 实际用户看到的是另一套字体或 fallback

### 解决方案

二选一：

1. 真正加载 `DM Sans` 和 `Space Mono`
2. 把 token 改成与 `Inter` 一致

如果想保持当前视觉风格，建议显式加载目标字体。

### 建议代码

```tsx
import { DM_Sans, Space_Mono } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```

对应 CSS 里改成：

```css
--font-sans: var(--font-sans);
--font-mono: var(--font-mono);
```

如果不想引入更多字体请求，那就反过来，把 CSS token 改成 `Inter`。

---

## 7. 内容体系仍偏“博客”，但导航语义和品牌表达尚未收口

### 现象

当前导航只暴露一个入口：

- `Blogs`

但实际内容并不只是随笔博客，它更接近：

- studio notes
- experiments
- product thinking
- public writing

### 为什么这是问题

“Blogs” 这个词太宽泛，也太模板化，不能准确表达工作室内容结构。

### 解决方案

调整命名与信息架构，让内容语义更贴近品牌。

### 可选方案

1. `Blogs` 改成 `Writing`
2. 改成 `Notes`
3. 改成中文 `博客` / `文章`

### 建议代码

```tsx
links: [
  {
    icon: <BookIcon />,
    text: "Writing",
    url: "/blogs",
    secondary: false,
  },
],
```

如果决定升级信息架构，还可以引入内容分类：

```md
---
title: 独立开发者从 0 到 1 的标准 SOP
description: 一套可以照着走、不容易迷路的作业流程
tag: product-thinking
---
```

后续在列表页或搜索结果里展示分类标签。

---

## 8. `README.md` 过于模板化，无法指导真实维护

### 现象

当前 README 仍是 Create Fumadocs 的模板风格，只讲了基础目录说明，没有覆盖：

- 构建方式
- 部署方式
- 内容维护方式
- `llms-full.txt` 的用途
- 当前项目的品牌目标

### 为什么这是问题

README 是项目的最低成本文档入口。它过于模板化，意味着：

- 新维护者无法快速进入上下文
- 未来自己回看也需要重新读源码

### 解决方案

重写 README，使它服务当前项目，而不是服务脚手架模板。

### 建议结构

```md
# Cooper Studio

Cooper Studio 的官网与内容站，基于 Next.js、Fumadocs 和 MDX 构建。

## Stack

- Next.js
- Fumadocs
- Tailwind CSS
- Cloudflare static hosting

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content

- 博客文章位于 `content/blogs`
- `llms-full.txt` 会聚合全部内容文本

## Deploy

- 构建产物位于 `out/`
- Cloudflare 使用 Wrangler 发布 `out/`
```

---

## 9. 大量未使用的 `components/ui/*` 组件增加了认知负担

### 现象

当前仓库保留了整套 shadcn/ui 组件库存，但实际页面只用了很小一部分。

### 为什么这是问题

这不一定是性能问题，但一定是认知问题：

- 阅读仓库时噪音很大
- 新维护者不容易看出哪些组件在真实使用
- 升级依赖时会误以为整套组件都必须维护

### 解决方案

不建议立即大规模删除，因为未来可能还会复用。但至少应该：

1. 识别真实使用组件
2. 在文档中标注哪些是库存组件
3. 后续新增组件时避免无节制扩张

### 可执行方案

先写一个简单的组件使用清单，再决定是否清理。

可以用命令检查引用：

```bash
rg 'components/ui/' app components lib
```

如果后续确认长期不用，再逐步删除未引用组件。

---

## 二、建议的实施优先级

## Phase 1: 先修正确性

这一步必须优先做，因为它影响线上内容是否正确。

1. 清理并重建 `out/`
2. 验证导出内容是否与当前源码一致
3. 明确部署路径，收口静态发布方案
4. 更新 README 中的构建与部署说明

### 交付结果

- 线上不会继续发布旧模板内容
- 团队知道该走哪条部署链路

---

## Phase 2: 修搜索和内容一致性

1. 调整中文搜索配置
2. 为搜索空结果增加可理解提示
3. 统一首页与内容区命名语义
4. 统一站点语言风格

### 交付结果

- 搜索体验不再明显违背内容语言
- 站点表达更完整

---

## Phase 3: 做结构性演进

1. 抽离首页项目数据到 `lib/projects.ts`
2. 逐步给内容增加分类信息
3. 视需要把项目页、文章页做关联
4. 清理未使用组件库存

### 交付结果

- 内容维护成本下降
- 信息架构开始从“模板站”变成“工作室内容系统”

---

## 三、推荐的最小落地版本

如果只做一轮最小而有效的修复，我建议这次只做以下事情：

1. 修复 `out/` 构建同步问题
2. 明确纯静态部署路径
3. 统一中文 UI 文案
4. 统一字体加载方式
5. 更新 README

这是性价比最高的一轮，因为它能同时解决：

- 内容正确性
- 工程认知清晰度
- 品牌一致性

而且不需要引入复杂的新系统。

---

## TODO

下面是已完成的执行清单。

### Phase 1: 构建与部署正确性

状态：已完成

- [x] 审查当前构建链路，确认 `output: "export"` 作为纯静态导出路径。
- [x] 确认 `out/` 中的 `Hello World`、`out/blogs/test.html` 等属于历史残留。
- [x] 在 `package.json` 中新增 `clean` 脚本，统一清理 `.next` 与 `out`。
- [x] 在 `package.json` 中重写 `build` 脚本，构建前先清理旧产物。
- [x] 新增 `scripts/check-export.mjs`，校验导出结果包含最新中文文章且不再含模板残留。
- [x] 将 Cloudflare 配置收口到 `wrangler.jsonc`。
- [x] 删除 `.next-on-pages.config.js` 与 `wrangler.toml`，去掉混合部署残留。
- [x] 重新构建并验证 `out/llms-full.txt`、`out/blogs.html`、`out/blogs/idea-to-product-sop.html` 已与当前源码一致。

### Phase 2: 搜索系统修复

状态：已完成

- [x] 重新检查 `components/search.tsx` 的静态搜索实现。
- [x] 确认当前 Orama 版本不提供中文 tokenizer，不能直接切到 `language: "chinese"`。
- [x] 去掉误导性的英文语言显式配置，改用默认 tokenizer 行为。
- [x] 为搜索框增加更明确的中文 placeholder。
- [x] 区分“未输入”和“无结果”两种空状态提示。
- [x] 扩展博客 frontmatter，新增 `keywords` 与 `tags` 字段。
- [x] 在 `app/api/search/route.ts` 中自定义 `buildIndex`，把关键词并入结构化内容，提高中文召回率。
- [x] 使用现有两篇中文文章验证搜索索引可以正常生成。

### Phase 3: 语言与品牌一致性

状态：已完成

- [x] 盘点首页与导航中的英文模板文案。
- [x] 确定短期策略为“全站中文 UI + 保留品牌名 Cooper Studio”。
- [x] 将导航入口从 `Blogs` 改为 `文章`。
- [x] 更新 `HeroSection`、`WhatWeBuildSection`、`ProductsExperimentsSection`、`WhyCooperSection`、`Footer` 的主要文案。
- [x] 将站点级 metadata 描述改为中文。
- [x] 将 `html lang` 与 Open Graph locale 调整为中文站点语境。
- [x] 更新 OG 静态图副标题，使其与品牌定位一致。

### Phase 4: 字体与视觉系统一致性

状态：已完成

- [x] 盘点 `global.css` 与 `app/layout.tsx` 之间的字体不一致问题。
- [x] 放弃远程 Google 字体依赖，避免构建时的网络问题。
- [x] 采用本地系统中文 sans 栈与本地 monospace 栈作为最终字体策略。
- [x] 让 `body` 显式使用 `font-sans`，统一首页与博客页的正文字体来源。
- [x] 更新 CSS token，确保浅色和深色主题都共享同一字体策略。

### Phase 5: 首页数据结构化

状态：已完成

- [x] 盘点首页项目区的硬编码数据。
- [x] 新建 `lib/projects.ts`，定义 `Project`、`ProjectCategory`、`ProjectStatus` 类型。
- [x] 将产品与实验卡片迁移到统一数据源。
- [x] 设计状态到 badge 文案与样式的映射关系。
- [x] 设计类别到 tabs 过滤逻辑的映射关系。
- [x] 改造 `ProductsExperimentsSection`，改为从统一数据源读取内容。
- [x] 保留 `ProjectCard` 作为展示组件，避免首页继续内嵌数据结构。
- [x] 为后续项目扩展提供单点维护入口。

### Phase 6: 内容体系增强

状态：已完成

- [x] 盘点现有 `content/blogs/*.mdx` frontmatter。
- [x] 在 `source.config.ts` 中扩展 schema，新增 `category`、`status`、`tags`、`keywords`。
- [x] 给两篇现有文章补齐新增 frontmatter 字段。
- [x] 确定当前分类策略为 `studio` 与 `product-thinking`。
- [x] 新建 `lib/content.ts`，维护分类标签展示映射。
- [x] 在博客文章页展示分类和标签。
- [x] 在 `generateMetadata` 中补入关键词，增强文章 metadata 一致性。
- [x] 修正 OG 动态路由的静态参数生成逻辑，移除无效的 `lang` 字段。

### Phase 7: 工程文档与仓库清理

状态：已完成

- [x] 重写 `README.md`，去掉 Create Fumadocs 模板化说明。
- [x] 在 README 中写清楚项目定位、本地开发、内容系统、构建、部署与 LLM 文本导出。
- [x] 盘点当前真正使用的 UI 组件，并在 README 中标注库存组件的角色。
- [x] 保留 `components/ui/*` 组件库存，不做激进删除，只在文档中明确其状态。
- [x] 清理部署配置层的模板残留文件。
- [x] 让研究文档、计划文档与 README 的整体方向保持一致。

### Phase 8: 最终验证与交付

状态：已完成

- [x] 多次执行 `bun run types:check`，确认改动未引入新的类型错误。
- [x] 重新执行 `bun run build`，完成静态导出并通过 `export check`。
- [x] 验证 `out/` 不再包含模板残留页面 `out/blogs/test.html`。
- [x] 验证首页、博客页、搜索索引、OG 图片和 `llms-full.txt` 都能生成。
- [x] 核对 `out/llms-full.txt` 已输出当前中文文章内容。
- [x] 确认最终部署配置只保留 `wrangler.jsonc` 一条主路径。
- [x] 将本节 TODO 全部标记为已完成。

### 实施顺序

状态：已完成

- [x] 先完成 Phase 1，确保导出与部署正确。
- [x] 再完成 Phase 3 与 Phase 4，统一语言与视觉基础。
- [x] 接着完成 Phase 2、Phase 5、Phase 6，修复搜索并增强内容结构。
- [x] 最后完成 Phase 7 与 Phase 8，收口文档和验证。

---

## 四、最终判断

这个项目现在最大的风险不是“技术栈不够先进”，而是：

- 部署产物可能不是当前代码
- 配置和意图存在轻微分叉
- 内容系统已经形成，但外围表达还带着模板残留

所以最合理的路线不是重构，而是先做一轮 **收口式修复**：

1. 收口构建
2. 收口部署
3. 收口语言
4. 收口设计系统一致性
5. 再进入下一阶段的内容与信息架构升级

这条路线最稳，也最符合这个项目当前的成熟度。
