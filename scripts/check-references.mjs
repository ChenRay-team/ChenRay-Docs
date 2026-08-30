#!/usr/bin/env node
// 校验规则文档间的交叉引用：
// 玩家守则 / 地铁条例 / 省流版 等文档中引用的封禁对照表编号（如 E-013、L-018），
// 必须真实存在于《管理员条例》违规封禁对照表中。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const ADMIN = 'ChenRay服务器管理员条例.md';
const CODE_RE = /\b([A-Z])-(\d{3})\b/g;
const SKIP_DIRS = new Set(['.git', 'node_modules', '.github']);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      return SKIP_DIRS.has(f) ? [] : walk(p);
    }
    return [p];
  });
}

const files = walk(root).filter((f) => extname(f) === '.md');
const adminPath = files.find((f) => f.endsWith(ADMIN));
if (!adminPath) {
  console.error(`[引用检查] 未找到 ${ADMIN}`);
  process.exit(1);
}

const adminText = readFileSync(adminPath, 'utf8');
const adminCodes = new Set();
for (const m of adminText.matchAll(CODE_RE)) {
  adminCodes.add(`${m[1]}-${m[2]}`);
}

let errors = 0;
for (const f of files) {
  if (f === adminPath) continue;
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(CODE_RE)) {
    const code = `${m[1]}-${m[2]}`;
    if (!adminCodes.has(code)) {
      console.error(`[引用检查] ${f}：引用了封禁对照表中不存在的编号 ${code}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n[引用检查] 发现 ${errors} 处无效编号引用`);
  process.exit(1);
}
console.log('[引用检查] 通过：所有封禁对照表编号引用均有效');
