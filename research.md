# Cooper Studio 项目研究报告

## 1. 项目定位

这个仓库是一个以 **Next.js App Router** 为运行框架、以 **Fumadocs + MDX** 为内容系统、以 **Tailwind CSS v4 + shadcn/ui + Radix UI** 为界面基础、并面向 **Cloudflare 静态托管** 的个人工作室官网/博客站点。

从当前代码看，它承担了三类职责：

1. 首页品牌展示：介绍 Cooper Studio 的定位、产品方向、实验项目与价值观。
2. 博客/文档展示：把 `content/blogs` 下的 MDX 内容渲染成带目录、导航、搜索、OG 图的文档页。
3. 面向机器的内容导出：提供 `llms-full.txt` 聚合全文输出，便于被 LLM 或其他抓取方消费。

它本质上不是一个复杂的业务系统，而是一个 **内容驱动的静态站点**。项目复杂度主要不在状态管理或后端逻辑，而在于：

- 内容源如何被编译和索引
- 页面如何按静态方式生成
- Fumadocs 提供的文档能力如何与自定义首页共存
- 静态导出产物如何被 Cloudflare 发布

---

## 2. 总体技术栈

### 核心依赖

- `next@16.1.1`
- `react@19.2.3`
- `fumadocs-core@16.4.2`
- `fumadocs-ui@16.4.2`
- `fumadocs-mdx@14.2.4`
- `tailwindcss@4.1.18`
- `@orama/orama@3.0.0`
- `lucide-react`
- 大量 `@radix-ui/*` 组件

### 这个组合意味着什么

1. **Next.js** 负责路由、页面装配、静态生成、元数据和 Route Handler。
2. **Fumadocs MDX** 负责把 `content/blogs/*.mdx` 编译成可被 `source` 读取的内容集合。
3. **Fumadocs UI** 提供首页布局、文档布局、MDX 组件、搜索对话框基础设施、OG 图片模板。
4. **Orama** 提供静态搜索索引能力。
5. **Tailwind v4 + shadcn/ui** 提供视觉组件层，首页自定义部分主要建立在这些通用组件之上。
6. **Wrangler / Cloudflare** 用于发布静态导出目录 `out`。

---

## 3. 目录结构与职责划分

### 3.1 应用层

- `app/layout.tsx`
  - 根布局，注入全局样式、字体、站点级 metadata 和 Provider。
- `app/(home)/layout.tsx`
  - 首页路由组布局，使用 Fumadocs 的 `HomeLayout`。
- `app/(home)/page.tsx`
  - 首页入口，拼装 Hero、功能区、产品区、价值观区和 Footer。
- `app/blogs/layout.tsx`
  - 博客布局，使用 `DocsLayout`，并把内容树传入侧边栏导航。
- `app/blogs/[[...slug]]/page.tsx`
  - 博客内容页动态入口，按 slug 读取 MDX 页面并静态生成。
- `app/api/search/route.ts`
  - 搜索索引路由。
- `app/llms-full.txt/route.ts`
  - 聚合所有文档的纯文本输出。
- `app/og/blogs/[...slug]/route.tsx`
  - 博客文章的动态 OG 图。

### 3.2 内容与内容适配层

- `content/blogs/*.mdx`
  - 站点内容源，目前仅有两篇文章。
- `source.config.ts`
  - Fumadocs MDX 集合定义，指定目录、frontmatter schema、meta schema 和 markdown 后处理。
- `lib/source.ts`
  - 把 Fumadocs 集合适配成统一可消费的站点内容源。
- `.source/*`
  - `fumadocs-mdx` 生成的中间文件，不应手写维护。

### 3.3 组件与样式层

- `app/global.css`
  - 全局样式、主题变量、Tailwind v4 主题 token。
- `components/search.tsx`
  - 自定义搜索对话框实现。
- `components/ui/*`
  - 大量 shadcn/ui 组件，只有一小部分被当前页面实际使用。
- `app/(home)/components/*`
  - 首页业务组件。

### 3.4 构建与部署层

- `next.config.mjs`
  - 开启 MDX，设置 `output: "export"`。
- `wrangler.jsonc`
  - Cloudflare 侧把 `./out` 作为静态资源目录。
- `wrangler.toml`
  - Worker 名称、兼容日期、Node 兼容。
- `.next-on-pages.config.js`
  - next-on-pages 兼容配置。

---

## 4. 启动、构建与发布流程

### 4.1 NPM Scripts

`package.json` 暴露的脚本：

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `types:check`: `fumadocs-mdx && next typegen && tsc --noEmit`
- `postinstall`: `fumadocs-mdx`
- `lint`: `eslint`

### 4.2 关键流程解释

#### 安装依赖后

`postinstall` 会执行 `fumadocs-mdx`，生成 `.source/*` 中间文件，让 MDX 内容能被类型安全地导入。

#### 类型检查

`types:check` 分三步：

1. 重新生成 Fumadocs 内容中间文件
2. 生成 Next 路由类型
3. 用 TypeScript 做无输出检查

这个流程说明项目作者依赖编译期类型而不是运行期校验。

#### 构建

`next.config.mjs` 中的 `output: "export"` 非常关键。它表明构建目标不是 Node server，也不是典型 SSR，而是 **静态导出站点**。最终期望产物是 `out/`。

#### 发布

`wrangler.jsonc` 指向：

```json
{
  "name": "site",
  "compatibility_date": "2026-01-01",
  "assets": {
    "directory": "./out"
  }
}
```

这意味着 Cloudflare 实际部署的是导出的静态文件，而不是一个完整的 Next 服务端进程。

---

## 5. 路由体系与页面职责

### 5.1 根布局 `app/layout.tsx`

它负责：

- 引入 `app/global.css`
- 使用 `next/font/google` 注入 `Inter`
- 定义整站 metadata
- 注入 `Provider`

Metadata 配置比较完整，包含：

- 标题模板
- 描述、关键词、作者、creator
- `metadataBase: https://site.cooper-studio.org`
- 图标
- Open Graph
- Twitter card

注意一点：全局字体用的是 `Inter`，但全局 CSS 里又把 `--font-sans` 设成 `DM Sans`。也就是说：

- HTML 根节点类名来自 `Inter`
- Tailwind token 又声明 sans 字体应为 `DM Sans`

这两者存在一定的“字体意图不完全一致”。最终视觉效果会取决于具体组件是否使用 Tailwind 的 `font-sans` 体系。

### 5.2 首页路由组 `app/(home)`

`app/(home)/layout.tsx` 使用：

```tsx
<HomeLayout {...baseOptions()}>{children}</HomeLayout>
```

说明首页导航和顶栏交互不是手写的，而是复用 Fumadocs 的 home layout。

`app/(home)/page.tsx` 只做组件编排，不含数据请求：

- `HeroSection`
- `WhatWeBuildSection`
- `ProductsExperimentsSection`
- `WhyCooperSection`
- `Footer`

这是一个纯展示页，所有文案和卡片内容都硬编码在组件内。

### 5.3 博客路由 `app/blogs`

#### 布局

`app/blogs/layout.tsx` 使用：

```tsx
<DocsLayout tree={source.getPageTree()} {...baseOptions()}>
```

这里的关键点是 `source.getPageTree()`。它会根据 MDX 内容自动生成文档导航树，提供给 Fumadocs 侧边栏。

#### 文章页

`app/blogs/[[...slug]]/page.tsx` 是核心内容页。

运行流程如下：

1. 从路由参数中取 `slug`
2. 调用 `source.getPage(params.slug)`
3. 找不到时 `notFound()`
4. 取出 `page.data.body` 作为 MDX 组件
5. 用 `DocsPage` + `DocsTitle` + `DocsDescription` + `DocsBody` 渲染
6. 注入 `createRelativeLink(source, page)`，让 MDX 内相对链接能正确解析

同时还定义了：

- `generateStaticParams()`
  - 所有文档页在构建时静态生成
- `generateMetadata()`
  - 页面标题、描述、OG 图片根据当前文档动态生成

这是典型的“内容驱动静态路由”实现。

---

## 6. 内容系统的真实工作原理

### 6.1 内容源配置

`source.config.ts`：

```ts
export const docs = defineDocs({
  dir: 'content/blogs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});
```

这里有几个重要点：

1. 内容目录是 `content/blogs`
2. frontmatter 使用 Fumadocs 默认 schema
3. 开启了 `includeProcessedMarkdown: true`

第三点很重要，因为它直接支撑了 `getLLMText()`：

```ts
const processed = await page.data.getText('processed');
```

也就是说，项目不仅渲染 MDX，还显式保留了“处理后的 markdown 文本”，以便导出给 LLM 使用。

### 6.2 编译后的 `.source/*`

`.source/server.ts`、`.source/browser.ts`、`.source/dynamic.ts` 都是自动生成文件。

从 `.source/server.ts` 可见当前真实内容集合只有两个文件：

- `index.mdx`
- `idea-to-product-sop.mdx`

这也证明文档导航和静态参数都只会围绕这两篇文章生成。

### 6.3 `lib/source.ts` 的适配职责

```ts
export const source = loader({
  baseUrl: '/blogs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
```

`source` 是整个项目内容系统的核心抽象。它统一提供：

- `getPage()`
- `getPages()`
- `generateParams()`
- `getPageTree()`

这些能力被下游多个模块复用：

- 博客页面读取内容
- 文档布局生成导航
- 搜索生成索引
- OG 路由拿标题/描述
- `llms-full.txt` 导出全文

也就是说，这个仓库的核心设计不是“每个功能单独读文件”，而是 **一切都围绕同一个 `source` 抽象展开**。

### 6.4 相对链接与图标扩展

`lucideIconsPlugin()` 允许在文档内容生态中解析 Lucide 图标相关能力。

`createRelativeLink(source, page)` 允许 MDX 中的相对链接映射到正确站点路径。这降低了内容作者维护链接时的心智负担。

---

## 7. 搜索系统

### 7.1 服务端搜索索引路由

`app/api/search/route.ts`：

```ts
export const { staticGET: GET } = createFromSource(source);
```

这说明搜索索引不是手写 API，而是直接由 Fumadocs 从 `source` 自动生成。

`revalidate = false` 表示它被视为静态内容。

### 7.2 客户端搜索对话框

`components/search.tsx` 使用：

- `useDocsSearch`
- `SearchDialog` 相关 UI 组件
- `@orama/orama`

核心逻辑：

```ts
const { search, setSearch, query } = useDocsSearch({
  type: "static",
  initOrama,
});
```

说明搜索是 **静态索引 + 客户端查询** 模式，而不是实时后端全文搜索。

`initOrama()` 定义的 schema 极简：

```ts
schema: { _: "string" },
language: "english",
```

这里存在一个值得注意的实现细节：

- 当前内容主体是中文
- Orama 语言设置是 `english`

这未必会直接导致不可用，但对中文分词/匹配质量明显不是最佳配置。报告中应将其视为一个潜在搜索质量问题。

### 7.3 Search Provider 注入方式

`app/provider.tsx` 中用：

```tsx
<RootProvider
  search={{
    SearchDialog,
  }}
>
```

这意味着整个站点的搜索 UI 是在应用根部挂入 Fumadocs Provider 的，不需要各页面单独配置。

---

## 8. 面向 LLM 的内容导出

`app/llms-full.txt/route.ts` 的逻辑很直接：

1. 遍历 `source.getPages()`
2. 对每篇文章调用 `getLLMText(page)`
3. 用空行拼接成一个纯文本响应

`getLLMText()` 会输出：

```txt
# 文章标题

处理后的 markdown 正文
```

这说明作者明显考虑过：

- 给 LLM 一次性提供站点文档全集
- 让 AI 读取的内容是纯文本，而不是 HTML
- 复用同一内容源，不额外维护副本

这是当前仓库里非常清晰、也很有延展性的一个设计点。

---

## 9. OG 图片生成机制

### 9.1 全站 OG

根 metadata 里全站默认使用：

- `/opengraph-image.svg`

`app/opengraph-image.svg` 是一个静态 SVG，内容包括：

- 白底
- 居中的品牌图形
- `Cooper Studio` 文本

### 9.2 文章级 OG

`app/og/blogs/[...slug]/route.tsx` 负责为每篇文章生成动态 OG 图。

逻辑如下：

1. 路由参数末尾约定为 `image.png`
2. 去掉最后一段后再找真实页面
3. 页面存在则调用 `fumadocs-ui/og` 的 `generate`
4. 传入标题、描述、站点名
5. 输出 `1200x630` 图片

配套的 `lib/source.ts` 中：

```ts
export function getPageImage(page) {
  const segments = [...page.slugs, 'image.png'];
  return {
    segments,
    url: `/og/blogs/${segments.join('/')}`,
  };
}
```

这样 `generateMetadata()` 里就能直接把每篇文章的 OG 图 URL 挂进去。

这是一个比较干净的设计：

- URL 规则统一
- 生成逻辑集中
- 页面 metadata 不需要关心底层实现

---

## 10. 首页信息架构与功能表达

首页不是动态页面，而是固定内容展示。

### 10.1 HeroSection

核心信息：

- 标题：`Building small, thoughtful digital products`
- 副标题：强调清晰与用心的 UI 驱动工具
- CTA：
  - 跳到 `#products`
  - 跳到 `/blogs`

### 10.2 WhatWeBuildSection

分三栏：

1. `Products`
2. `Tools for Builders`
3. `Mission-Driven Support`

前两栏以静态数据数组驱动卡片列表，第三栏则用描述 + bullet list + CTA 组成。

### 10.3 ProductsExperimentsSection

使用 Tabs 分成：

- `Products`
- `Experiments`

每个 tab 下是项目卡片。

项目数据全部硬编码，包括：

- Rainbow Paths
- Emotion Cards
- AI Color Palette
- Micro Analytics
- CLI Boilerplate

这说明首页项目区当前不是 CMS 驱动，也没有和博客内容做关联。

### 10.4 WhyCooperSection

以文案方式阐述工作室价值观：

- clarity
- restraint
- long-term thinking

### 10.5 Footer

提供：

- 品牌信息
- “Built by Suxiong”
- 联系邮箱
- `/blogs` 文档入口

---

## 11. 组件层实现特点

### 11.1 实际使用的 UI 组件并不多

虽然 `components/ui/` 下有大量 shadcn/ui 组件，但当前首页真正明显使用到的主要是：

- `button`
- `card`
- `badge`
- `tabs`

其他大量组件更像是预生成组件库库存，目前未进入主业务路径。

这意味着：

1. 仓库具有扩展 UI 的准备度
2. 但当前运行时复杂度并不高
3. 后续维护时应分清“已用组件”和“库存组件”

### 11.2 样式风格

`app/global.css` 建了一整套 CSS variables，特点很明确：

- 白底黑边/黑字为主
- 原色点缀
- 阴影偏硬朗
- `--radius: 0px`

这会形成一种接近 neo-brutalism / 硬边卡片的视觉语气：

- 无圆角或极少圆角
- 强对比
- 粗硬投影
- 鲜明色块

### 11.3 字体策略

CSS token 中声明：

- `--font-sans: DM Sans`
- `--font-mono: Space Mono`

但项目并没有在根布局显式加载这两个 Google Font，只加载了 `Inter`。因此：

- 如果用户设备本地没有这些字体，最终可能回退到通用 sans / monospace
- 样式意图和真实字体加载存在脱节

这是一个实现细节，也是一处一致性隐患。

---

## 12. 当前内容与语言层特征

### 已有内容

当前仅有两篇中文文章：

1. `content/blogs/index.mdx`
   - 主题：为什么成立 Cooper Studio
2. `content/blogs/idea-to-product-sop.mdx`
   - 主题：独立开发者从 0 到 1 的标准 SOP

### 语言表现上的现状

站点外壳和导航文案主要是英文：

- `Blogs`
- `View Products`
- `Explore Experiments`

但博客正文是中文。

这说明项目目前处于一种 **中英混合界面** 状态，而不是完整国际化方案。

代码中也没有真正的 i18n 系统：

- 没有 locale 路由
- 没有字典文件
- 没有翻译层

因此这不是多语言站点，只是“部分英文 UI + 中文内容”。

---

## 13. Cloudflare 相关实现理解

仓库中同时存在：

- `wrangler.toml`
- `wrangler.jsonc`
- `.next-on-pages.config.js`

可以推断作者经历过或考虑过两种部署语境：

1. 使用 Cloudflare 静态资源部署 `out/`
2. 使用 `next-on-pages` 兼容 Next.js 路由能力

但就当前主配置而言，真正明确生效的是：

- Next 静态导出
- Wrangler 发布 `out`

`.next-on-pages.config.js` 更像兼容性保留文件，而不是当前源码中最核心的发布路径。

---

## 14. 已确认的工程状态与异常点

这一部分是阅读仓库后最值得单独记录的结论。

### 14.1 `out/` 构建产物与当前源码不一致

当前 `out/` 目录里存在明显过期或残留内容，包括：

- `out/llms-full.txt` 仍是默认示例文档
- `out/blogs.html` 中仍可见 `Hello World` / `Your first document`
- 存在 `out/blogs/test.html` 这样的页面

但源码中的真实 MDX 内容已经是两篇中文文章，并不存在这些默认示例文件。

这说明至少有一种情况成立：

1. `out/` 是旧构建产物，没有被重新导出
2. 之前曾存在模板内容，后续替换源码后未刷新静态导出目录

因此，**不能把仓库里的 `out/` 当作当前代码的权威运行结果**。

### 14.2 `.source/*` 与源码一致，但 `out/` 落后

`.source/server.ts` 已经正确列出当前两篇中文文章。这说明：

- MDX 内容编译层是新的
- 真正落后的主要是最终导出目录 `out/`

### 14.3 本地类型检查通过

我实际执行了：

```bash
npm run types:check
```

结果通过，说明：

- Fumadocs 中间文件可正常生成
- Next 路由类型可正常生成
- TypeScript 当前没有显性类型错误

### 14.4 本地构建进程未在本次会话中返回完成状态

我启动了：

```bash
npm run build
```

进程输出停在：

```txt
▲ Next.js 16.1.1 (Turbopack)
[MDX] generated files in ...
Creating an optimized production build ...
```

在本次会话观察窗口内，它没有报错，但也没有返回结束状态。因此我不能把“构建成功”写成已确认事实。

更准确的表述应是：

- 类型检查已确认通过
- 构建已启动
- 本次会话未看到最终完成或失败结果

### 14.5 仓库当前有未提交变更

`git status --short` 显示：

- `.next-on-pages.config.js` 已被修改

这不是我造成的，说明工作区本身处于脏状态。阅读和报告应避免把该改动误判为稳定基线的一部分。

### 14.6 搜索语言配置与内容语言不匹配

搜索使用 Orama，语言设为 `english`，而文章内容是中文。这很可能影响中文搜索体验。

### 14.7 字体声明与字体加载不一致

样式变量希望使用 `DM Sans` / `Space Mono`，但根布局只实际加载了 `Inter`。

---

## 15. 工作原理总结：从内容到页面的完整链路

可以把这个站点理解成下面这条流水线：

### 第一步：作者写内容

在 `content/blogs/*.mdx` 中写文章，并通过 frontmatter 提供标题、描述等元信息。

### 第二步：Fumadocs 编译内容

`fumadocs-mdx` 根据 `source.config.ts` 扫描 `content/blogs`，生成 `.source/*` 中间层。

### 第三步：`lib/source.ts` 统一封装

`docs.toFumadocsSource()` 被 `loader()` 包装成统一 `source` 对象。

### 第四步：不同功能从同一 `source` 消费数据

- 博客详情页：`source.getPage()`
- 静态参数：`source.generateParams()`
- 导航树：`source.getPageTree()`
- 搜索：`createFromSource(source)`
- LLM 导出：`source.getPages().map(getLLMText)`
- OG 图：读取页面标题和描述

### 第五步：Next 在构建时静态生成页面

因为启用了 `output: "export"`，最终期望生成静态站点文件。

### 第六步：Cloudflare 发布 `out/`

Wrangler 将导出目录作为静态资源部署。

这套设计的最大优点是：

- 内容单一真源
- 页面、搜索、OG、LLM 导出都不会各自维护副本
- 信息一致性理论上较高

---

## 16. 这个项目当前“是什么”，以及“还不是什么”

### 它已经是什么

- 一个可运行的静态工作室官网
- 一个基于 MDX 的轻量博客/文档系统
- 一个具备搜索、目录、OG、LLM 文本导出的内容站
- 一个适合继续增加文章和项目展示的基础壳

### 它还不是什么

- 不是带后台的 CMS
- 不是动态数据库应用
- 不是完整国际化站点
- 不是真正以数据驱动的项目展示系统
- 不是内容量很大的知识库

---

## 17. 后续维护时最关键的关注点

如果以后继续演进这个项目，我认为最需要优先关注的是：

1. 重新确认并刷新 `out/` 导出流程，避免部署旧内容。
2. 明确 Cloudflare 部署路径，到底是纯静态导出还是 next-on-pages 混合方案。
3. 让搜索配置适配中文内容。
4. 统一字体意图与真实加载方式。
5. 决定首页项目区是否继续硬编码，还是抽成数据源。
6. 清理未使用的 UI 组件库存，或至少在认知上将它们视为脚手架资产而非核心业务代码。

---

## 18. 结论

Cooper Studio 当前是一个 **结构清晰、内容驱动、以静态发布为核心的个人工作室站点**。它最值得肯定的设计是：以 `source` 为单一内容真源，把博客渲染、搜索、OG、LLM 导出统一串在同一条链路上。这让项目虽然体量不大，但架构上相当整洁。

同时，仓库也呈现出明显的“从模板走向定制化”的过渡痕迹：

- 首页已经有明确品牌表达
- 博客内容已替换为作者自己的中文文章
- 但 `out/` 仍残留模板时代的静态产物
- 部分部署和字体配置也还没有完全收口

因此，对这个项目最准确的判断是：

**核心架构已经成型，当前主要问题不在设计思路，而在构建产物同步、配置一致性和少量工程收尾。**
