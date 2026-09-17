<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 开发服务器

优先使用我已经启动的 dev server（默认 `http://localhost:3000`）来验证改动。先用 `lsof -nP -iTCP -sTCP:LISTEN` 之类的方式确认端口上有没有在跑，有就直接访问，不要另起一个实例，也不要重启或杀掉它。只有确认没有任何 dev server 在跑时，才自己启动一个，用完关掉。

## Tailwind class 写法

有原生变体就不要用任意选择器，写规范形式（对应 Tailwind IntelliSense 的 `suggestCanonicalClasses` 提示）。常见的几个：

- `[&>*]:` → `*:`
- `[&_*]:` → `**:`
- `[&:hover]:` → `hover:`，其余伪类同理
- `[&[data-state=open]]:` → `data-[state=open]:`；布尔属性再简写一层：`data-[highlighted]:` → `data-highlighted:`
- `[&:not(:first-child)]:` → `not-first:`
- CSS 变量值用括号简写：`w-[var(--foo)]` → `w-(--foo)`

没有原生变体的选择器（如 `[&_svg]:`、`[&>span:first-child]:`）保持任意选择器写法。
