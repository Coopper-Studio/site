import { existsSync, readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(existsSync("out/llms-full.txt"), "缺少 out/llms-full.txt");

const llmText = readFileSync("out/llms-full.txt", "utf8");

assert(
  llmText.includes("为什么成立 Cooper Studio"),
  "导出产物缺少最新博客内容"
);
assert(
  llmText.includes("独立开发者从 0 到 1 的标准 SOP"),
  "导出产物缺少第二篇博客内容"
);
assert(!llmText.includes("Hello World"), "导出产物仍包含旧模板内容");
assert(
  !existsSync("out/blogs/test.html"),
  "导出产物仍包含旧模板页面 out/blogs/test.html"
);

console.log("export check passed");
