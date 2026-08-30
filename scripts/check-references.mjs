#!/usr/bin/env node
/**
 * ChenRay 规则仓库 · 文档一致性检查器
 *
 * 检查项：
 *   1. 编号引用 —— 各文档引用的封禁对照表编号（如 E-013、L-018）必须存在于《管理员条例》
 *   2. 章节引用 —— "详见 6.1"、"第十条"、"第五部分" 等引用目标必须存在于对应文档标题
 *   3. 内部链接 —— 仓库内相对 Markdown 链接的目标文件必须存在
 *   4. 版本一致 —— README 文档矩阵版本号与各文档头部版本号一致
 *   5. 头部规范 —— 规则文档头部应包含版本号与统一格式（YYYY.M.D）的更新日期
 *
 * 用法：
 *   node scripts/check-references.mjs               常规检查（彩色输出）
 *   node scripts/check-references.mjs --json       输出 JSON 报告（供 CI / 脚本解析）
 *   node scripts/check-references.mjs --no-color   禁用颜色输出
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname, basename, relative } from 'node:path';

const ROOT = process.cwd();
const ARGS = new Set(process.argv.slice(2));
const USE_JSON = ARGS.has('--json');
const USE_COLOR = !ARGS.has('--no-color');

// 文档名别名 → 文件路径
const DOC_ALIASES = {
  管理员条例: '规则/ChenRay服务器管理员条例.md',
  玩家守则: '规则/ChenRay服务器玩家守则.md',
  地铁乘车管理条例: '规则/ChenRay服务器地铁乘车管理条例.md',
  地铁条例: '规则/ChenRay服务器地铁乘车管理条例.md',
};

const SKIP_DIRS = new Set(['.git', 'node_modules', '.github', '逆天言论']);
const RULE_DOCS = new Set([
  'ChenRay服务器玩家守则.md',
  'ChenRay服务器管理员条例.md',
  'ChenRay服务器地铁乘车管理条例.md',
]);

// ---------- 工具 ----------
const c = (code, s) => (USE_COLOR ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = (s) => c('2', s);
const red = (s) => c('31', s);
const green = (s) => c('32', s);
const yellow = (s) => c('33', s);
const bold = (s) => c('1', s);
const rel = (f) => relative(ROOT, f).replace(/\\/g, '/');

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      return SKIP_DIRS.has(f) ? [] : walk(p);
    }
    return [p];
  });
}

/** 从文档文本构建标题索引（含数字编号与中文编号） */
function buildHeadings(text) {
  const headings = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const raw = m[2].trim();
    headings.push({
      level: m[1].length,
      num: raw.match(/^(\d+(?:\.\d+)*)/)?.[1],
      cn: raw.match(/^(第[一二三四五六七八九十百]+[章条部分])/)?.[1],
    });
  }
  return headings;
}

// ---------- 读取全部文档 ----------
const mdFiles = walk(ROOT).filter((f) => extname(f) === '.md');
const docs = {};
for (const f of mdFiles) {
  const text = readFileSync(f, 'utf8');
  docs[f] = { text, headings: buildHeadings(text) };
}

// ---------- 检查结果收集器 ----------
const results = {};
const init = (name) => (results[name] = { ok: true, errors: [], warns: [], infos: [] });
const err = (name, msg) => { results[name].ok = false; results[name].errors.push(msg); };
const warn = (name, msg) => results[name].warns.push(msg);
const info = (name, msg) => results[name].infos.push(msg);

// ---------- 1. 编号引用 ----------
init('编号引用');
{
  const adminPath = mdFiles.find((f) => basename(f) === 'ChenRay服务器管理员条例.md');
  const adminCodes = new Set();
  for (const m of docs[adminPath].text.matchAll(/\b([A-Z])-(\d{3})\b/g)) {
    adminCodes.add(`${m[1]}-${m[2]}`);
  }
  for (const f of mdFiles) {
    if (f === adminPath) continue;
    for (const m of docs[f].text.matchAll(/\b([A-Z])-(\d{3})\b/g)) {
      const code = `${m[1]}-${m[2]}`;
      if (!adminCodes.has(code)) err('编号引用', `${rel(f)}：引用了不存在的编号 ${red(code)}`);
    }
  }
  info('编号引用', `对照表收录 ${adminCodes.size} 个编号`);
}

// ---------- 2. 章节引用 ----------
init('章节引用');
{
  // 触发词 + 可选文档名（《书名号》或裸名）+ 章节目标（数字编号或中文编号，排除"1.5 倍"类数字）
  const REF_RE = /(?:详见|见|依据|以|参照|按)[^。；\n]*?(?:《([^》]+)》|(玩家守则|管理员条例|地铁乘车管理条例|地铁条例))?[\s·、]*((?:[0-9]+(?:\.[0-9]+)+|第[一二三四五六七八九十百]+[章条部分])(?!\s*倍))/g;
  // 中文编号归一化："第十四条" 与 "十四条" 视为同一目标
  const normCn = (s) => (s || '').replace(/^第/, '');
  for (const f of mdFiles) {
    for (const line of docs[f].text.split(/\r?\n/)) {
      for (const m of line.matchAll(REF_RE)) {
        const docName = m[1] || m[2]; // 《...》中的文档名或裸文档名，可能为 undefined
        const target = m[3];
        if (docName && !DOC_ALIASES[docName]) {
          warn('章节引用', `${rel(f)}：无法识别文档《${docName}》`);
          continue;
        }
        const targetFile = docName ? DOC_ALIASES[docName] : f;
        if (!docs[targetFile]) continue;
        const isNum = /^[0-9]/.test(target);
        const found = docs[targetFile].headings.some((h) =>
          isNum ? h.num === target : h.cn && normCn(h.cn) === normCn(target),
        );
        if (!found) err('章节引用', `${rel(f)}：引用 ${yellow(target)} 在 ${rel(targetFile)} 中不存在`);
      }
    }
  }
}

// ---------- 3. 内部链接 ----------
init('内部链接');
{
  for (const f of mdFiles) {
    for (const m of docs[f].text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = m[1].trim();
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const [pathPart] = href.split('#');
      if (!pathPart || !pathPart.endsWith('.md')) continue;
      const target = join(dirname(f), pathPart);
      if (!existsSync(target)) err('内部链接', `${rel(f)}：链接目标不存在 ${yellow(pathPart)}`);
    }
  }
}

// ---------- 4. 版本一致 ----------
init('版本一致');
{
  const readmePath = mdFiles.find((f) => basename(f) === 'README.md');
  if (readmePath) {
    for (const line of docs[readmePath].text.split(/\r?\n/)) {
      const m = line.match(/\[([^\]]+\.md)\]\(([^)]+)\)\s*\|\s*(v\d+\.\d+\.\d+)/);
      if (!m) continue;
      const target = join(ROOT, m[2].split('#')[0]);
      if (!docs[target]) continue;
      const headVer = docs[target].text.slice(0, 800).match(/v\d+\.\d+\.\d+/)?.[0];
      if (headVer && headVer !== m[3]) {
        err('版本一致', `${m[1]}：README 标注 ${red(m[3])}，文档头部为 ${yellow(headVer)}`);
      }
    }
  }
}

// ---------- 5. 头部规范 ----------
init('头部规范');
{
  for (const f of mdFiles) {
    if (!RULE_DOCS.has(basename(f))) continue;
    const head = docs[f].text.slice(0, 600);
    if (!/v\d+\.\d+\.\d+/.test(head)) warn('头部规范', `${rel(f)}：头部缺少版本号`);
    if (!/\d{4}\.\d{1,2}\.\d{1,2}/.test(head)) warn('头部规范', `${rel(f)}：头部缺少 YYYY.M.D 格式更新日期`);
  }
}

// ---------- 汇总输出 ----------
let totalErr = 0;
let totalWarn = 0;
for (const r of Object.values(results)) {
  totalErr += r.errors.length;
  totalWarn += r.warns.length;
}

if (USE_JSON) {
  console.log(JSON.stringify({ summary: { files: mdFiles.length, checks: Object.keys(results).length, errors: totalErr, warns: totalWarn }, results }, null, 2));
} else {
  for (const [name, r] of Object.entries(results)) {
    const icon = r.ok ? green('✔') : red('✘');
    console.log(`\n${bold(`${icon} ${name}`)}${dim(`（${r.errors.length} 错误 / ${r.warns.length} 警告）`)}`);
    for (const i of r.infos) console.log(`  ${dim('ℹ')} ${i}`);
    for (const w of r.warns) console.log(`  ${yellow('⚠')} ${w}`);
    for (const e of r.errors) console.log(`  ${red('✘')} ${e}`);
  }
  const status = totalErr === 0 ? green('通过') : red('未通过');
  console.log(`\n${bold('汇总：')} ${status} ｜ ${red(`${totalErr} 错误`)}，${yellow(`${totalWarn} 警告`)}，${dim(`共检查 ${mdFiles.length} 个文档 / ${Object.keys(results).length} 类检查`)}`);
}

process.exit(totalErr > 0 ? 1 : 0);
