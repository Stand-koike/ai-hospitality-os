# Phase 1 — Implementation Specification（藍 ai）

**ステータス**: 実装前正本（コードなし）  
**バージョン**: v1.0  
**前提**: [docs/02](../docs/02_PRODUCT_DEFINITION.md)〜[05](../docs/05_UI_UX.md) · [09](../docs/09_ROADMAP.md) · [decision-log/](../decision-log/)  
**出口条件**: [phase-1-exit-criteria.md](./phase-1-exit-criteria.md)

---

## 1. Phase 1 Implementation Specification（概要）

### 1.1 目的

Phase 1 は **MVP Build**（09）：最小の Hospitality OS で、次の **行動ループ**を成立させる。

```
予約を載せる → Guest を正しく識別する → 今日のお客様を理解する
→ 過去を確認する → 接客する → 気づきを Timeline に残す → 次のスタッフにつなげる
```

### 1.2 システム境界

| 藍 ai **ではない** | 藍 ai **である** |
|-------------------|------------------|
| PMS（予約の正本・チャネル管理） | Guest-centered の理解・記録・共有 |
| Make / Sheets / Calendar を基盤にした取込 | 手動 + 標準 CSV + 表（同一 CSV 経路） |
| メール解析・OTA/PMS API（Phase 1） | Guest Resolution、Brief、Summary、Timeline、Paper、要約 AI |

**基本データ流**（Phase 1）:

```text
PMS 等（予約正本）
  ↓ CSV export（または手動 / 表）
藍 ai — Reservation Import
  ↓
Guest Resolution（人の確認）
  ↓
Today's Brief → Guest Summary → Timeline
  ↓（上に載せる）
AI Summary · Paper Output
```

### 1.3 Vertical Slice（最優先）

```text
CSV / Table Data → Reservation Import → Guest Resolution
→ Existing / New Guest → Today's Brief → Guest Summary → Timeline
```

AI Summary と Paper Output は **コアフローの上**に実装する。

### 1.4 Phase 1 で決めないもの

DB 製品、ホスティング、認証プロバイダ、AI モデル/プロバイダ、マルチ Property、PMS 別マッピング、OTA/PMS API、高度権限、経営 DB — **実装時に決定可**。

**実装開始前に PO 確認推奨（Minor Decision）**: CSV の email/phone 必須、Resolution 保留（hold）の有无。

---

## 2. Standard CSV Schema

### 2.1 二層構造

| 層 | 説明 |
|----|------|
| **External Input** | 各 PMS が出力する任意 CSV（Phase 1 ではマッピング UI なし） |
| **Canonical Import Schema** | 藍 ai **標準 CSV テンプレート**（Phase 1 はこれのみ必須サポート） |

施設は PMS 出力を **テンプレ列に合わせて整形**する（Excel/表編集可）。将来: PMS 別 mapping profile。

### 2.2 標準 CSV 列定義

| Field | Required | Type | Meaning | Example |
|-------|----------|------|---------|---------|
| `external_reservation_id` | **Yes** | string | PMS/運用上の予約一意 ID（再取込キー） | `BK-2026-0042` |
| `guest_name` | **Yes** | string | 予約上の宿泊者名 → Reservation.`booker_name` | `山田 太郎` |
| `check_in` | **Yes** | date (ISO `YYYY-MM-DD`) | チェックイン日 | `2026-10-01` |
| `check_out` | **Yes** | date (ISO `YYYY-MM-DD`) | チェックアウト日（> check_in） | `2026-10-03` |
| `email` | *Minor* | string | 照合・連絡 | `guest@example.com` |
| `phone` | *Minor* | string | 照合・連絡 | `090-1234-5678` |
| `guest_name_kana` | No | string | 照合補助（日本語施設） | `ヤマダ タロウ` |
| `guest_count` | No | integer | 人数 | `2` |
| `room` | No | string | 部屋・タイプのラベル | `201` |
| `source` | No | string | チャネルラベル（表示用） | `楽天` |
| `booked_at` | No | datetime | 予約日時（メタ） | `2026-09-15T10:00:00+09:00` |
| `notes` | No | string | 取込時メモ（Reservation メタ、Timeline には自動で入れない） | `早朝到着` |

**Minor Decision**: `email` / `phone` を「少なくとも一方必須」にするか「両方任意」にするか。Resolution 精度とのトレードオフ。

### 2.3 手動登録・表データ

- 手動: 上表の **Required 列**と同じフィールドをフォームで入力。
- 表 UI: 行編集後、内部では **Canonical 行**としてバリデートし、CSV インポートと **同一パイプライン**に渡す。

---

## 3. Data Model

[04_DOMAIN_MODEL.md](../docs/04_DOMAIN_MODEL.md) に整合。DDD の「Aggregate Root」表現は使わず **Guest-centered**。

### 3.1 Reservation

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| `reservation_id` | ID | Yes | 内部 ID |
| `external_reservation_id` | string | Yes | 外部一意（再取込） |
| `booker_name` | string | Yes | CSV `guest_name` からスナップショット |
| `check_in_date` | date | Yes | |
| `check_out_date` | date | Yes | |
| `contact_email` | string | Minor | |
| `contact_phone` | string | Minor | |
| `guest_count` | int | No | |
| `room_label` | string | No | |
| `source` | string | No | チャネル表示 |
| `import_source` | enum | Yes | `manual` \| `csv_import` \| `table_import` |
| `imported_at` | datetime | Yes | |
| `import_batch_id` | string | No | 同一 CSV 取込の追跡 |
| `guest_resolution_status` | enum | Yes | `unresolved` \| `linked` |
| `guest_id` | ID | No | null = 未解決 |

**関係**: Reservation N → 1 Guest（紐付け後）。未解決時は Guest に属さない。

**`new_guest` について**: ドメイン上は `linked` に統一。UI で「新規作成した」ことを表示可能（04 の `new_guest` 値集合は UI ラベルに寄せる — **表現整理 B**）。

### 3.2 Guest

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| `guest_id` | ID | Yes | 長期 ID |
| `display_name` | string | Yes | 初期値は Resolution 時の予約名等 |
| `contact_email` | string | No | 更新は Resolution / 将来編集 |
| `contact_phone` | string | No | |
| `created_at` / `updated_at` | datetime | Yes | |

**関係**: Guest 1 → N Reservation, Stay, Timeline Entry。

### 3.3 Stay（Phase 1 最小）

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| `stay_id` | ID | Yes | |
| `guest_id` | ID | Yes | |
| `reservation_id` | ID | Yes | 由来予約 |
| `check_in_date` / `check_out_date` | date | Yes | 予約からコピーで開始 |
| `status` | enum | Yes | `planned` \| `completed` \| `cancelled` |

**Phase 1 生成タイミング（確定案）**: Guest Resolution **完了時**に `planned` の Stay を 1 件作成。チェックアウト日経過後に `completed` へ（日次ジョブまたは Brief 表示時の遅延更新 — 実装選択可）。

`in_house` は Phase 1 **省略可**（D: 保留可能）。

### 3.4 Timeline Entry

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| `entry_id` | ID | Yes | |
| `guest_id` | ID | Yes | |
| `occurred_at` | datetime | Yes | 事象日時 |
| `recorded_at` | datetime | Yes | |
| `entry_type` | enum | Yes | Phase 1: **`staff_note`** のみ必須。`system_event`（紐付け完了）は **要検証** |
| `body` | string | Yes（note） | 短文（目安 500 字以内 UI） |
| `created_by` | string | No | スタッフ表示名（認証未決定時は固定ラベル可） |
| `related_reservation_id` | ID | No | |

**Stay との関係**: Stay は **滞在回数・期間の集計レイヤー**; Timeline は **気づき・申し送り**。Phase 1 では Stay 開始を `system_event` にしない（Stay レコードのみ）。

### 3.5 再取込・重複（確定方式）

| 項目 | 規則 |
|------|------|
| 同一判定 | 同一施設内で `external_reservation_id` が一致 |
| 再取込挙動 | **Upsert**: 既存 Reservation の日程・連絡先・room 等を更新。`guest_id` と Resolution 状態は **維持**（意図的クリアしない） |
| Timeline / Stay | 自動では変更しない |
| エラー | 必須列欠落・日付不正は行単位エラー。部分成功を許容し結果サマリを表示 |

---

## 4. Guest Resolution Specification

### 4.1 ステータス

| `guest_resolution_status` | `guest_id` | 意味 |
|---------------------------|------------|------|
| `unresolved` | null | 要対応 |
| `linked` | 設定済 | 解決済（新規作成含む） |

### 4.2 フロー

```text
Import / 手動作成（unresolved）
  → 候補検索（ルールベース）
  → 候補一覧（0 件以上）+ 一致理由の最小表示
  → スタッフ: 既存 Guest を選択 | 新規 Guest 作成
  → linked + guest_id 設定 + Stay(planned) 生成
  → Guest Summary へ
```

### 4.3 Candidate Matching（Phase 1 — 非 AI 必須）

| 信号 | 扱い |
|------|------|
| email 完全一致 | 強い候補 |
| phone 正規化後一致 | 強い候補 |
| 氏名完全一致 / かな一致 | 中程度 |
| 氏名類似（編集距離等） | 弱い候補（上位 N 件） |

**禁止**: 自動で `guest_id` を設定。AI で候補並び替えは **オプション**（Phase 1 必須ではない）。

### 4.4 保留（hold）

03 の「保留を MVP に含めるか」は **Minor Decision**。含めない場合: 未解決は Brief に残り続ける。

---

## 5. Today's Brief Specification

### 5.1 目的

「今日来るお客様を短時間で理解できる」（体験 A の入口）。

### 5.2 今日の範囲

施設ローカル日付の **00:00–23:59**。`check_in_date = 今日` → Arrival、`check_out_date = 今日` → Departure。

### 5.3 表示

**Arrival（各行）**: 表示名（紐付け後は Guest 名、未解決は `booker_name`）、check-in/out、resolution バッジ、repeat（過去 Stay 完了 1 件以上）、Summary へのリンク。

**Departure**: 同様に最小表示。

**未 Resolution**: セクション上部またはバッジで件数表示 → Resolution へ。

**並び順**: Arrival は check-in 時刻がなければ **名前昇順**（Phase 1）。

**Empty State**: 「本日の到着はありません」+ 予約取込への導線。

**含めない**: 売上、稼働率、ランキング、経営グラフ。

---

## 6. Guest Summary Specification

### 6.1 ブロック

| ブロック | 内容 |
|----------|------|
| Current Stay | 今回 Reservation、日程、room（あれば） |
| Guest History | 完了 Stay 回数、直近滞在日、Timeline 直近 3 件へのリンク |
| AI Summary | 短文（§8） |

### 6.2 行動

チェックイン前に開き、要点把握 → 必要なら Timeline。新規入力は **Timeline へ**（Summary は閲覧中心）。

---

## 7. Timeline Specification

- **追記のみ**（同一 entry の本文上書き禁止）。
- 入力: 1 フィールド短文 + 送信。
- 表示: `occurred_at` 降順または昇順（切替は任意、デフォルトは古い→新しい）。
- 種別: Phase 1 は `staff_note` 中心。

---

## 8. AI Summary Specification

| 項目 | 内容 |
|------|------|
| Input | 当該 Guest の Stay 一覧、Timeline Entry（`staff_note`）、Reservation メタ（notes は任意） |
| Output | 3–8 文程度の要約。過去の配慮・好みの **参考** |
| 禁止 | 接客指示、提案、評価、スコア、自動 Resolution、チャット |
| 保存 | 都度生成をデフォルト（キャッシュは実装任意） |
| Provider | **実装時決定** |

**実装順**: Step 8（コアフロー後）。

---

## 9. Paper Output Specification

| 項目 | 内容 |
|------|------|
| 入口 | Today's Brief の「印刷」 |
| 形式 | ブラウザ print または PDF（**いずれか 1 つ**で Phase 1 可） |
| 紙面 | 当日 Arrival/Departure 一覧（名前・日程）、未 Resolution 注意 |
| 除外 | Timeline 全文、長い AI 要約、センシティブ詳細、不要 PII |

---

## 10. Screen List

| # | Screen | Purpose | Entry | Main info | Main action | Next |
|---|--------|---------|-------|-----------|-------------|------|
| 1 | Today's Brief | 今日の全体像 | ログイン後ホーム | 到着/出発/未解決 | Guest 選択、印刷 | Summary / Resolution |
| 2 | Guest Summary | 短期理解 | Brief | 今回・履歴・AI | Open Timeline | Timeline |
| 3 | Timeline | 積層・記録 | Summary | Entry 一覧 | 追記メモ | Summary |
| 4 | Guest Resolution | 体験 C | Brief バッジ / 未解決一覧 | 予約・候補 | link / 新規 | Summary |
| 5 | Reservation Detail | 補助 | Brief / Resolution | 予約フィールド | 編集（最小） | Resolution |
| 6 | Import | 取込 | メニュー or Brief | CSV / 表 / 手動 | 実行・結果確認 | Resolution |
| 7 | Print Preview | 共有 | Brief | 紙面プレビュ | 印刷/PDF | Brief |

---

## 11. Core User Flow（スタッフ行動）

| 段階 | スタッフがすること |
|------|-------------------|
| 1 | PMS から CSV を出す（または表/手動で載せる） |
| 2 | Import を実行し、結果を確認する |
| 3 | 未解決予約を開き、候補を見て link または新規 Guest |
| 4 | Today's Brief で今日の到着を確認する |
| 5 | 到着 Guest の Summary を読み、必要なら Timeline |
| 6 | 接客する |
| 7 | 気づきを Timeline に短く残す |
| 8 | 次シフトが Brief / Timeline を見る |
| 9 | （任意）Brief から紙を出して朝礼共有 |

---

## 12. Implementation Order

| Step | 実装対象 | 完了条件 | 前提 |
|------|----------|----------|------|
| **1** | Foundation / persistence / Guest・Reservation・Stay・Timeline スキーマ | CRUD の土台 | — |
| **2** | Reservation Import（CSV・手動・表）+ upsert | I1–I4 相当 | 1 |
| **3** | Guest エンティティ・一覧 | Guest 作成可能 | 1 |
| **4** | Guest Resolution UI + 候補検索 + Stay 生成 | R1–R4 相当 | 2,3 |
| **5** | Today's Brief | B1,B5 | 4 |
| **6** | Guest Summary（AI なし） | B2 + 履歴表示 | 4,5 |
| **7** | Timeline 追記・表示 | B4 | 6 |
| **8** | AI Summary | A1 | 7 |
| **9** | Paper Output | P1–P2 | 5 |

---

## 13. Decisions Still Open

| 項目 | 影響 | 推奨 |
|------|------|------|
| email/phone CSV 必須 | Resolution 精度 | PO: 少なくとも一方必須 |
| Resolution hold | UI 複雑度 | Phase 1 は **なし** |
| `system_event` on link | 監査 | Phase 1 は **省略可** |
| Stay `in_house` | 状態機械 | Phase 1 は planned/completed のみ |
| 認証 | 全画面 | パイロットは単一共有アカウントでも可（実装時） |

---

## 14. Existing Docs Consistency Check

| 領域 | 区分 | メモ |
|------|------|------|
| Reservation ingestion | **A** | ADR + 03 v0.3 反映済 |
| Guest Resolution 人確認 | **A** | |
| Guest / Stay / Timeline | **A** | Stay 生成タイミングは **B**（本仕様で具体化） |
| Paper フォーマット | **D** | 機能は Phase 1、レイアウトは最小 |
| 03「連絡先必須未決定」 | **C** | Minor Decision |
| 05 UI 詳細 | **B** | 本仕様が画面の実装正本 |

---

## 15. Phase 1 Implementation Readiness

**判定: Minor Decision Required**

**理由**

- コア Vertical Slice・CSV スキーマ・upsert・データモデル・画面一覧・実装順は **実装開始可能な粒度**。
- **ブロックしない未決**: DB/AI/認証プロバイダ。
- **PO 確認が望ましい**: 標準 CSV の email/phone 必須、Resolution 保留の有无（§13）。

Minor Decision 完了後、または「一方必須 + 保留なし」で **デフォルト採用**すれば **Ready** とみなす。

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-09-30 | v1.0 初版（docs + ADR 整合、コードなし） |
