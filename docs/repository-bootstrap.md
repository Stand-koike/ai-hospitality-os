# 藍 ai — 単一リポジトリ構成ガイド（ai-hospitality-os）

**正本リポジトリ**: https://github.com/Stand-koike/ai-hospitality-os

**目的**: 藍 ai（Hospitality OS）を **1 つの Git リポジトリ**として正本化し、別プロダクト（例：`presenter-gesture-mvp`）と混在させない。

---

## 現状

| 場所 | 内容 |
|------|------|
| **`Stand-koike/ai-hospitality-os`** | 藍 ai の **正本**（`docs/`、`decision-log/`、`specs/`） |
| `Stand-koike/presenter-gesture-mvp` | **別プロダクト**（PDF ジェスチャー MVP）。藍 ai にマージしない |
| Cursor Project「藍」Store | 接続手順・bootstrap 補助（[github-cursor-connection.md](./github-cursor-connection.md)） |

Phase 1 実装は **`apps/web`** をこのリポジトリに追加する想定（着手前はドキュメントのみでも成立）。

---

## 推奨ディレクトリ構成

```
ai-hospitality-os/
├── README.md
├── docs/                    # 01–09 プロダクト正本
├── decision-log/            # ADR
├── specs/                   # Phase 1 Implementation Spec 等
├── apps/                    # Phase 1 Build 開始時
│   └── web/                 # MVP UI（技術選定は別途）
├── packages/                # （将来）共有型・CSV テンプレ等
├── .gitignore
└── LICENSE                  # 未決定なら省略可
```

**入れないもの（ADR 準拠）**

- Make / Google Sheets / Calendar を **前提実装**として置くコード
- 予約メール解析パイプライン
- `presenter-gesture-mvp` の Electron / MediaPipe 資産

---

## ドキュメントの読み順

1. [README.md](../README.md)
2. [docs/02_PRODUCT_DEFINITION.md](./02_PRODUCT_DEFINITION.md)
3. [docs/03_MVP_SPEC.md](./03_MVP_SPEC.md)
4. [docs/04_DOMAIN_MODEL.md](./04_DOMAIN_MODEL.md) · [docs/05_UI_UX.md](./05_UI_UX.md)
5. [decision-log/](../decision-log/)
6. [specs/phase-1-implementation.md](../specs/phase-1-implementation.md)

---

## Phase 1 の境界（要約）

- **PMS 非代替** — 予約正本は施設側。流入は **手動 + 標準 CSV + 表**（同一 CSV 経路）
- **メール解析・Make/Sheets 連携なし**
- 実装仕様・出口条件: `specs/phase-1-implementation.md` · `specs/phase-1-exit-criteria.md`

---

## Cloud Agent / Cursor

- Project「藍」の作業リポジトリを **`ai-hospitality-os`** に設定する
- GitHub App の **Contents: Read and write** と push 403 の対処は [github-cursor-connection.md](./github-cursor-connection.md)

---

## 次のステップ

1. Phase 1 spec を `specs/` で維持・更新
2. `apps/web` スキャフォールド（Vertical slice: Import → Resolution → Brief）
3. 標準 CSV テンプレート（`packages/` または `docs/` 付属）
4. CI はアプリ追加後

---

*更新: 2026-09-30 — 単一リポジトリ正本（lan-ai 名称は未採用）*
