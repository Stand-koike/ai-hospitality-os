# 09 — ロードマップ（藍 ai）

**バージョン**：v0.1  
**ステータス**：フェーズ・検証条件の整理（MVP 実装前）  
**前提**：[README.md](../README.md) · [01](./01_BRAND_BOOK.md)〜[08_SALES_STRATEGY.md](./08_SALES_STRATEGY.md)

本書は **詳細な日付や機能追加計画を固定するものではない**。各フェーズで **何を作り、何を検証し、何が確認できたら次へ進むか** を明確にする。

**Product → Behavior → Business** を段階的に検証するロードマップである（機能開発ロードマップだけではない）。

数値目標（売上・ARR・導入件数・達成率）は **設定しない**。

---

## 1. Purpose

| 項目 | 内容 |
|------|------|
| 目的 | 開発・パイロット・事業化の **フェーズ**と **出口条件**を、既存 MVP 境界と矛盾なく整理する |
| 非目的 | 四半期ごとの機能リリース表、市場規模予測、未検証機能の実装確定 |
| 更新 | パイロット・Productization の学習に応じて [03](./03_MVP_SPEC.md)〜[08](./08_SALES_STRATEGY.md) と連動して見直す |

維持する前提：行動変容が中心、Today's Brief → Guest Summary → Timeline、Guest-centered、Resolution は人間確認、AI は要約・整理、Software + Hospitality Success、**7 室モデル施設**パイロット、MVP で機能を増やしすぎない。

---

## 2. Roadmap Principles

| # | 原則 |
|---|------|
| 1 | **機能を増やすこと**を進捗としない |
| 2 | 各フェーズで **仮説を検証**する |
| 3 | MVP で **本質的な行動変容**を確認する（[03 §10](./03_MVP_SPEC.md)） |
| 4 | パイロットの学習を **プロダクト・運用へ戻す** |
| 5 | **未検証の機能**を先回り実装しない |
| 6 | Software と Hospitality Success の役割を **検証しながら**分離・標準化する（[06](./06_BUSINESS_MODEL.md)） |
| 7 | **拡張は MVP の価値が確認されてから**（Phase 5 は候補のみ） |

---

## 3. Phase Overview

### Phase 0 — Product Definition

| 項目 | 内容 |
|------|------|
| **目的** | 思想・プロダクト定義・ドメイン・MVP 境界・事業・販売の **仮説**を固める |
| **主な成果** | Brand、Product Definition、MVP Spec、Domain Model、UI/UX、Business Model、Pricing、Sales Strategy、本 Roadmap |
| **状態（2026-09）** | **完了**（実装前。§7） |

### Phase 1 — MVP Build

| 項目 | 内容 |
|------|------|
| **目的** | 定義した MVP を **実装**し、実際に使える状態にする |
| **対象**（[03](./03_MVP_SPEC.md)、[05](./05_UI_UX.md) と整合） | Reservation ingestion（**経路未決定**）、Guest Resolution、Today's Brief、Guest Summary、Timeline、Paper Output、AI Guest History Summary |
| **制約** | **MVP 外機能を追加しない**（§6） |

### Phase 2 — Pilot

| 項目 | 内容 |
|------|------|
| **目的** | **個人経営・約 7 室・1 施設**で実際に利用する（[08 §7](./08_SALES_STRATEGY.md)） |
| **確認すること** | Today's Brief を見るか／Guest Resolution を確認するか／Guest Summary を使うか／Timeline に気づきを残すか／次のスタッフが情報を利用できるか／**現場の行動が変わるか**／**伴走がどの程度必要か** |
| **評価** | 売上・機能数ではなく、**行動変容**中心（[03](./03_MVP_SPEC.md)） |

### Phase 3 — Validation / Refinement

| 項目 | 内容 |
|------|------|
| **目的** | パイロットの情報を整理し **MVP を修正**する |
| **確認** | 使われた／使われなかった機能、入力負担、Guest Resolution の成立、Timeline 定着、AI Summary の有用性、Paper Output の現場適合、Software と伴走の役割 |
| **成果** | 必要範囲で 03・04・05・07・08 等を **更新**（境界の拡大は慎重に） |

### Phase 4 — Productization

| 項目 | 内容 |
|------|------|
| **目的** | 1 施設で成立した運用を **他施設でも再現**できる状態へ |
| **対象** | Onboarding、Hospitality Success playbook、運用手順、データ導入（経路 **未決定**）、初期設定、サポート、プロダクト改善 |
| **検証** | **創業者が直接付き添わなくても導入できるか**（[06](./06_BUSINESS_MODEL.md)、[08 §9](./08_SALES_STRATEGY.md)） |

### Phase 5 — Expansion

| 項目 | 内容 |
|------|------|
| **目的** | MVP で確認した価値を基に、**必要な領域へ拡張** |
| **扱い** | 以下は **拡張候補**のみ。実装予定として **確定しない**（§6） |

**拡張候補（優先順位はパイロット・Productization の結果で決める）**

- LINE、レビュー分析、清掃
- より高度な Memory、Relationship / Family context
- 高度な AI（接客提案等 — MVP 思想と整合する範囲のみ検討）
- 経営者向け機能、経営ダッシュボード
- 複数施設、権限管理
- 外部サービス連携（OTA API 等）

---

## 4. Phase Exit Criteria

**次フェーズへ進む条件**（定性。数値 KPI は設定しない）。

### Phase 0 → Phase 1

- MVP 境界が明確（[03 §13](./03_MVP_SPEC.md)）
- ドメインモデルが **実装可能な粒度**（[04](./04_DOMAIN_MODEL.md) — 技術選定は別）
- UI/UX の主要フローが定義済み（[05](./05_UI_UX.md)）

### Phase 1 → Phase 2

- MVP **主要フローが操作可能**
- Guest / Reservation / Stay / Timeline Entry の **基本関係**が成立（[04](./04_DOMAIN_MODEL.md)）
- Guest Resolution が **人の確認付きで**操作可能
- Today's Brief → Guest Summary → Timeline が **成立**

### Phase 2 → Phase 3

- 現場利用の **データ・観察結果**が得られる
- 行動変容について **具体的な観察**ができる（方法 **未決定**）

### Phase 3 → Phase 4

- MVP の **残す／修正する**判断ができる
- 継続利用の **条件が一定程度見える**
- 伴走支援の **必要範囲が見える**（[07](./07_PRICING.md)）

### Phase 4 → Phase 5

- **複数施設**への展開可能性が見える（件数目標は設定しない）
- 導入・運用の **再現性**が確認できる

---

## 5. Product / Business Learning Loop

### 5.1 プロダクト開発の循環

```text
仮説
 ↓
MVP
 ↓
現場利用
 ↓
観察
 ↓
学習
 ↓
仕様・運用の修正
 ↓
再利用
```

### 5.2 価値・事業の学習順

```text
現場の行動
 ↓
お客様への理解
 ↓
接客・関係性
 ↓
プロダクト価値
 ↓
事業モデル（06・07・08）
```

[02](./02_PRODUCT_DEFINITION.md) の因果モデルと一致。

---

## 6. Future Feature Policy

MVP 外機能は **「将来作る機能一覧」ではない**。**必要性が検証された場合に検討する拡張候補**（[03 §9](./03_MVP_SPEC.md)）。

**ロードマップに確定配置しない**（例）

- LINE、Cleaning、Review Analysis
- Advanced Memory、Family / Relationship Graph
- AI Service Recommendation、自動接客
- Management Dashboard、Community

Phase 5 で列挙する候補も、**パイロット・Productization の検証結果で優先順位を決める**。

---

## 7. Current Status（2026-09 時点）

| 項目 | 状態 |
|------|------|
| Product Definition（01・02） | **完了** |
| MVP Specification（03 v0.3） | **整理済み** |
| Domain Model（04 v0.2） | **整理済み** |
| UI/UX（05 v0.1.1） | **整理済み** |
| Business Model（06 v0.1） | **仮説整理** |
| Pricing（07 v0.1） | **仮説整理** |
| Sales Strategy（08 v0.1） | **仮説整理** |
| Roadmap（本書） | **v0.1** |
| **Implementation** | **未着手**（MVP 実装前） |

**現在フェーズ**：Phase 0 完了 → **Phase 1（MVP Build）待ち**。

パイロット施設の具体・予約取り込み経路は **未決定**（decision-log、03・08）。

---

## 8. Open Questions

| 項目 | 状態 |
|------|------|
| MVP 実装期間・スケジュール | **未決定** |
| パイロット開始時期 | **未決定** |
| MVP 実装の優先順位（画面・データ経路等） | **未決定** |
| パイロット評価方法（観察・インタビュー・ログ） | **未決定** |
| Phase 3 で変更する範囲（仕様・UI・価格・伴走） | **未決定** |
| Productization の具体的出口条件（定性の詳細） | **未決定** |
| Expansion の優先順位 | **未決定**（Phase 5 前に決めない） |
| 技術スタック | **未決定**（本ロードマップの範囲外） |

---

## 9. Change History

| 日付 | 内容 |
|------|------|
| 2026-09-18 | v0.1 初版（フェーズ・検証条件の整理） |