# Cooper Studio

Cooper Studio 的官网与内容站，使用 Next.js、Fumadocs、MDX 与 Tailwind CSS 构建，面向纯静态导出和 Cloudflare 静态托管。

## 技术栈

- Next.js App Router
- React 19
- Fumadocs UI + Fumadocs MDX
- Tailwind CSS v4
- shadcn/ui
- Cloudflare Wrangler

## 本地开发

使用 Bun：

```bash
bun install
bun run dev
```

默认本地地址：

```txt
http://localhost:3000
```

## 内容系统

- 博客内容位于 `content/blogs`
- `source.config.ts` 定义 MDX frontmatter schema
- `lib/source.ts` 是统一内容适配层
- `app/blogs/[[...slug]]/page.tsx` 负责渲染文章页
- `app/api/search/route.ts` 从内容源生成静态搜索索引
- `app/llms-full.txt/route.ts` 聚合全部文章文本，供 LLM 或抓取方读取

## 首页数据

- 首页项目卡片数据位于 `lib/projects.ts`
- 首页业务组件位于 `app/(home)/components`

## 构建

```bash
bun run build
```

构建流程会：

1. 清理旧的 `.next` 与 `out`
2. 执行静态导出
3. 校验 `out/` 是否与当前源码一致

## 类型检查

```bash
bun run types:check
```

## 部署

当前部署路径是纯静态导出：

1. 运行 `bun run build`
2. 确认最新静态文件已生成到 `out/`
3. 使用 `wrangler.jsonc` 将 `out/` 发布到 Cloudflare

## 已使用的 UI 组件

当前主路径实际使用的组件主要包括：

- `button`
- `badge`
- `card`
- `tabs`

`components/ui/*` 中的其他组件目前主要是 shadcn/ui 组件库存，未全部进入主业务路径。
