# ChenRay 服务器

![Lint](https://img.shields.io/github/actions/workflow/status/chenray-team/ChenRay-Docs/lint.yml?branch=main&label=lint&logo=github)
![Docs](https://img.shields.io/github/actions/workflow/status/chenray-team/ChenRay-Docs/pages.yml?branch=main&label=docs%20site&logo=github)
![License](https://img.shields.io/github/license/chenray-team/ChenRay-Docs?color=blue)
![GitHub last commit](https://img.shields.io/github/last-commit/chenray-team/ChenRay-Docs?color=blueviolet)

> **生存 · 红石 · 建筑 · 地铁 · 赛事** —— 一个由玩家共建的 Minecraft 服务器。

本仓库是 **ChenRay 服务器**的官方综合仓库，收录服务器信息、规则文档、入服指引与问题反馈入口。

> **服务器信息：** Paper（Minecraft Java 版）｜ QQ 群：108441415
> 完整信息见 [服务器信息.md](服务器信息.md)
>
> **📖 在线阅读：** 规则文档站（GitHub Pages 自动部署）
>
> **💡 省流版：** 想快速了解规则？看 [玩家守则省流版](规则/省流版/玩家守则省流版.md) ｜ [管理员条例省流版](规则/省流版/管理员条例省流版.md) ｜ [地铁乘车管理条例省流版](规则/省流版/地铁乘车管理条例省流版.md)

---

## 快速入口

| 入口 | 说明 |
|------|------|
| 🚀 **入服绑定** | 进服查看绑定码 → 发送至 QQ 群 108441415，机器人自动加白名单 |
| 📜 **规则文档** | [规则/](规则/) —— 玩家守则、管理员条例、地铁乘车管理条例 |
| 💡 **省流版** | 三份规则的一页速查（上方向导） |
| 📄 **服务器信息** | [服务器信息.md](服务器信息.md) —— 地址、版本、开放时间等 |
| ⚖️ **举报 / 申诉** | QQ 群 @值班管理员、论坛"申诉区"、[官网](https://www.chenray.top) |

## 规则文档

| 文件 | 版本 | 说明 |
|------|------|------|
| [ChenRay服务器玩家守则.md](规则/ChenRay服务器玩家守则.md) | v3.0.0 | 适用于全体玩家的基础行为守则，涵盖总则、游戏行为、处罚申诉、特殊场景，以及入服白名单、领地建筑、经济市场、聊天社区、活动赛事、纠纷仲裁、直播录屏、账号数据保护等专项细则 |
| [ChenRay服务器管理员条例.md](规则/ChenRay服务器管理员条例.md) | v3.0.0 | 规范管理员行为的条例，涵盖总体原则、禁止行为、职责要求、处罚逻辑、特殊参与规则，以及违规封禁规范（含六大类 100+ 条违规封禁对照表、封禁流程、申诉解封、累计加重、公示记录、反作弊申诉） |
| [ChenRay服务器地铁乘车管理条例.md](规则/ChenRay服务器地铁乘车管理条例.md) | v2.0.0 | 地铁系统的乘车规范，依据 Metro 插件功能制定，涵盖设施保护、乘车行为、特殊场景、管理职责 |

- **玩家守则** 是面向全体玩家的基础行为守则；**管理员条例** 是规范管理员行为的条例（含违规封禁规范）；**地铁乘车管理条例** 是地铁系统专项规范
- 凡与封禁相关的规定不一致处，以管理员条例中的封禁规范部分为准

## 常见问题速查

| 事项 | 渠道 / 方式 | 响应时限 |
|------|------------|---------|
| **入服白名单** | 进服获取绑定码 → 发送至官方 QQ 群（108441415）自动绑定 | 即时生效（见玩家守则第五章） |
| **举报违规** | "举报通道"提交证据（截图、录像、日志等） | 12 小时内启动调查（见管理员条例第十条） |
| **申诉 / 解封** | 论坛"申诉区"按模板发帖，或官网 / QQ 群联系值班管理员 | 72 小时内联合审查（见管理员条例第十二、十四条） |
| **交易纠纷 / 仲裁** | "举报通道"提交投诉，提供双方 ID、交易内容与证据 | 12 小时内受理（见玩家守则第七、十章） |
| **账号找回** | 提供注册邮箱、历史登录 IP、最早建筑坐标等证据 | 经管理员核对后找回（见玩家守则 12.6） |
| **店铺购买 / 出租 / 营业执照** | 按商店告示牌标价，联系阿清（QQ：2717104909）办理 | 见玩家守则 7.2 |
| **漏洞报告** | 工单提交详细复现步骤 | 首例重大漏洞奖励 500–5000 游戏币（见玩家守则 2.1.2） |
| **地铁问题反馈** | 游戏内 / 举报通道提交证据 | 24 小时内响应，48 小时内处理（见地铁条例 4.1.3） |

## 仓库结构

```text
├── 规则/                    规则文档（文档站内容源）
│   ├── index.md             文档站首页
│   ├── ChenRay服务器玩家守则.md
│   ├── ChenRay服务器管理员条例.md
│   ├── ChenRay服务器地铁乘车管理条例.md
│   └── 省流版/               三份省流速查版
├── scripts/
│   └── check-references.mjs 文档一致性检查器（5 类检查）
├── .github/
│   ├── workflows/           CI 流水线（lint / pages / release）
│   ├── ISSUE_TEMPLATE/      游戏问题、违规举报、申诉、建议等模板
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml       依赖自动更新
├── 服务器信息.md             服务器地址、版本、官方渠道
├── README.md                本文件
├── CHANGELOG.md             版本演进记录
├── CONTRIBUTING.md          修订指南
├── SECURITY.md              安全政策
├── LICENSE                  版权声明（保留所有权利）
└── mkdocs.yml               文档站配置（MkDocs Material）
```

## 维护与贡献

- **修订流程：** 见 [CONTRIBUTING.md](CONTRIBUTING.md)，遵循"七日阳光流程"
- **更新记录：** 见 [CHANGELOG.md](CHANGELOG.md)
- **版本与许可：** 文档版本号见各文件头部；仓库许可见 [LICENSE](LICENSE)
- **本地校验：** `npm run verify`（markdownlint + 5 类一致性检查）、`npm run docs:serve`（本地预览文档站）
- **问题反馈：** 游戏故障、违规举报、处罚申诉、规则问题与建议请提交 [Issue](https://github.com/ChenRay-team/ChenRay-Docs/issues)（已配置标准模板）

---

© ChenRay 运营团队。本仓库规则以不违背国家法律法规、Mojang EULA、微软服务条款为前提。
