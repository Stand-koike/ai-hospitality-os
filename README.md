# 藍 ai（ai-hospitality-os）

**藍 ai** — Guest-centered **Hospitality OS**（PMS の代替ではない）。

宿泊施設で働く人の**行動変容**を起点に、お客様への理解・記録・共有をつなぎ、接客と関係性を支えるプロダクトです。

| 項目 | 内容 |
|------|------|
| 読み | **ai**（AI / I / 愛） |
| カテゴリ | Hospitality OS |
| リポジトリ | プロダクト正本（ドキュメント + 将来の MVP 実装） |

## このリポジトリについて

- **`docs/`** — プロダクト設計（01 ブランドブック 〜 09 ロードマップ）
- **`decision-log/`** — ADR 形式の重要意思決定
- **`apps/`** — Phase 1 MVP 実装（未着手）

別プロダクト（例：PDF ジェスチャー MVP）のコードは **含めません**。

## 読み始める順序

1. [docs/01_BRAND_BOOK.md](docs/01_BRAND_BOOK.md)
2. [docs/02_PRODUCT_DEFINITION.md](docs/02_PRODUCT_DEFINITION.md)
3. [docs/03_MVP_SPEC.md](docs/03_MVP_SPEC.md)
4. [docs/04_DOMAIN_MODEL.md](docs/04_DOMAIN_MODEL.md)
5. [docs/05_UI_UX.md](docs/05_UI_UX.md)
6. [decision-log/](decision-log/) — 特に予約取り込み・PMS との境界

## Phase 1 の境界（要約）

- **藍 ai は PMS 非代替**。予約の正本は施設側の予約管理（または表運用）に置く。
- **取り込み**：手動入力 + **藍 ai 標準 CSV**（スプレッドシートは CSV 同一経路）。詳細は decision-log。
- **MVP 外**：予約メール解析、Make / Google Sheets / Calendar を前提とした連携、OTA/PMS リアルタイム API。
- **AI（Phase 1）**：Guest 履歴の**要約**のみ（断定・自動接客はしない）。

## パイロット（確定）

個人経営・**7 室**・**1 施設**（名称・地域・OTA は未決定）。

## 開発ステータス

- **Phase 0**：プロダクト定義ドキュメント整備（本リポジトリ）
- **Phase 1**：MVP Build — [docs/09_ROADMAP.md](docs/09_ROADMAP.md)

実装仕様（Implementation Specification）確定後は `specs/` に配置する想定。

## ライセンス

未決定。
