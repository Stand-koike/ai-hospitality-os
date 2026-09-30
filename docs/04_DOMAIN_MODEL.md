# 04 — ドメインモデル（藍 ai MVP）

**バージョン**：v0.1  
**ステータス**：MVP 最小ドメイン（実装前）  
**前提**：[README.md](../README.md) · [01_BRAND_BOOK.md](./01_BRAND_BOOK.md) · [02_PRODUCT_DEFINITION.md](./02_PRODUCT_DEFINITION.md) · [03_MVP_SPEC.md](./03_MVP_SPEC.md) · [decision-log/](../decision-log/)

本書は **実装のためのドメイン境界**を定義する。技術スタック・DB 製品・API 形状は **未決定**。

---

## 1. 本書の目的

| 目的 | 内容 |
|------|------|
| 中心 | **Guest** を主語に、MVP で永続化する概念を最小限に固定する |
| 整合 | [03_MVP_SPEC.md](./03_MVP_SPEC.md) v0.3 の構造・行動ループ・AI 境界と矛盾しない |
| 除外 | Relationship / 高度な Memory を **独立エンティティとして追加しない**（本書でも確定しない） |
| 先送り | 未決定は **未決定 / 仮説 / 要検証** と明記し、推測で確定しない |

---

## 2. 上流ドキュメントからの整理

### 2.1 確定事項（MVP ドメインに効くもの）

| 出典 | 内容 |
|------|------|
| 03 §1 | 構造：**Guest → Reservation / Stay / Timeline**（Timeline はエントリの集合として本書で具体化） |
| 03 §1 | **Relationship**＝Guest と宿の間の文脈を指す**概念**。MVP で独立ドメイン化は**しない** |
| 03 §1 | **Memory**＝高度管理機能は MVP に含めない。気づき・申し送りは **Timeline Entry** で表現 |
| 03 §1 | 行動ループ：理解 → 接客 → 気づき → 記録 → 共有 → 次の接客 |
| 03 §6.2 | Guest Resolution：**人の確認**付きで Reservation → Guest。自動完結しない |
| 03 §8 | 上書きせず **時間の積層**。Guest ID は長期基盤 |
| 03 §7 | AI 要約は Guest に紐づく過去情報が入力。判断主体の AI はドメイン外 |
| ADR | 予約メール解析は MVP 外 |
| ADR / 02 | パイロット：**個人経営・7 室・1 施設** |

### 2.2 未決定・要検証（ドメイン設計に影響）

| 項目 | 状態 |
|------|------|
| 予約データの取り込み経路 | **Phase 1：手動 + 標準 CSV + 表**（ADR）。API は将来。メール解析 × |
| Reservation の必須属性（部屋・人数・料金等） | **未決定** |
| Guest 照合ルール・必須キー | **未決定** |
| Stay と Reservation の 1:1 / 1:N、キャンセル・ノーショウ | **要検証** |
| Timeline Entry の種別一覧・メタデータ | **要検証**（MVP 最小セットのみ本書で提案） |
| センシティブ情報の分類・表示・印刷・権限 | **未決定** |
| 訂正（誤記）のドメイン表現（追記 vs 失効） | **要検証** |
| 施設（Property）をエンティティとして明示するか | **未決定**（パイロットは 1 施設想定） |
| スタッフ（Staff）・認証主体 | **未決定** |
| AI 要約の保存形（都度生成 vs スナップショット） | **未決定** |

### 2.3 02 思想図との関係（注記）

[02_PRODUCT_DEFINITION.md](./02_PRODUCT_DEFINITION.md) §9 に Memory・Relationship・Briefing が登場する。これは**思想レベル**の図であり、MVP の永続エンティティは **03 v0.3** に従い本書の 4 概念に限定する。

| 02 の語 | MVP ドメインでの扱い |
|---------|----------------------|
| Memory | 独立エンティティに**しない**。`Timeline Entry`（種別：スタッフメモ）で表現 |
| Relationship | 独立エンティティに**しない**。**概念**。Stay・Timeline の蓄積から**読み取る** |
| Briefing | Today's Brief は**画面・ユースケース**。永続エンティティ「Briefing」は MVP で**確定しない**（**仮説**：将来のスナップショット用） |

---

## 3. ドメイン全体像

### 3.1 エンティティ関係（MVP）

```
                    ┌─────────────────┐
                    │  Guest (集約根)  │
                    │  guest_id        │
                    └────────┬────────┘
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
  │ Reservation  │   │    Stay      │   │ Timeline Entry   │
  │ (イベント)    │   │ (滞在実績)    │   │ (時間軸の記録)    │
  └──────────────┘   └──────────────┘   └──────────────────┘
         │                  ▲
         │  紐付け後         │ チェックアウト等で
         └──────────────────┘ 生成（要検証）
```

- **Guest** が集約の中心。Reservation / Stay / Timeline Entry はいずれも **guest_id** に従属（パイロット 1 施設では tenant 省略可。**多施設は将来検討**）。
- **Guest Resolution** は永続エンティティではなく、**Reservation の状態遷移と照合プロセス**（§7）。

### 3.2 集約境界（MVP）

| 集約 | 根 | 含めるもの |
|------|-----|------------|
| Guest | Guest | Reservation（参照）、Stay、Timeline Entry の ID 集合を Guest 経由で辿る |

クロス Guest の参照（家族・同行者）は **MVP 外**。

---

## 4. Guest

### 4.1 責務

- 宿泊施設における **継続する「お客様」** の同一性を表す（[03](./03_MVP_SPEC.md)：Reservation はイベント、Guest は存在）。
- すべての文脈（予約・滞在・時系列メモ）の **アンカー**。
- Guest Resolution の **紐付け先**。

### 4.2 主要属性（論理モデル）

| 属性 | 説明 | MVP |
|------|------|-----|
| `guest_id` | 施設横断を見据えた不透明 ID（形式 **未決定**） | 必須 |
| `display_name` | 表示用氏名（予約と異なる表記がありうる：**要検証**） | 必須 |
| `contact_email` | 照合用・連絡用 | **未決定**（必須か） |
| `contact_phone` | 照合用・連絡用 | **未決定**（必須か） |
| `created_at` | 初回登録 | 必須 |
| `updated_at` | メタ更新 | 必須 |

**含めない（MVP）**：スコア、ランク、AI 評価、家族グラフへのポインタ。

### 4.3 ライフサイクル

```
[新規作成] ← Guest Resolution で「新規 Guest」
     │
     ├─→ Reservation の紐付けが増える
     ├─→ Stay が蓄積される
     ├─→ Timeline Entry が追記される
     │
[削除] MVP では物理削除ポリシー **未決定**（**仮説**：論理削除・匿名化は将来）
```

Guest の「マージ」（二人を一つにする）は **人の操作**が前提。**自動マージは MVP で確定しない**。

### 4.4 リレーション

| 関連 | カーディナリティ | 備考 |
|------|------------------|------|
| Reservation | 1 : N | 未紐付け Reservation は Guest に属さない |
| Stay | 1 : N | 1 Reservation から 0〜1 Stay 等は **要検証** |
| Timeline Entry | 1 : N | 時系列。削除せず積層 |

### 4.5 Guest Resolution との関係

- 照合の **結果**として `guest_id` が Reservation に設定される。
- 候補探索は Guest の `display_name` / `contact_*` と過去 Reservation・Stay を材料にする（アルゴリズム **未決定**）。

---

## 5. Reservation

### 5.1 責務

- **未来または進行中の宿泊予約**という一次イベントを表す。
- 取り込み経路（PMS CSV・手動・表）に依存しない **共通の予約レコード**（経路は [03 §6.1](./03_MVP_SPEC.md)・[specs/phase-1-implementation.md](../specs/phase-1-implementation.md)）。
- Guest Resolution の **トリガー**となるオブジェクト。

### 5.2 主要属性（論理モデル）

| 属性 | 説明 | MVP |
|------|------|-----|
| `reservation_id` | 予約 ID | 必須 |
| `guest_id` | 紐付け先（null＝未解決） | 必須（null 可） |
| `guest_resolution_status` | 例：`unresolved` / `linked` / `new_guest`（値集合 **要検証**） | 必須 |
| `booker_name` | 予約上の氏名 | 必須（最小） |
| `check_in_date` | チェックイン日 | 必須 |
| `check_out_date` | チェックアウト日 | 必須 |
| `contact_email` / `contact_phone` | 予約時点の連絡先 | **未決定**（必須セット） |
| `source` | 取り込み元ラベル（`manual` / `csv_import` / `table_import` 等） | Phase 1 で最小セット |
| `external_reservation_id` | PMS 等の外部予約 ID（再取込の一意キー） | Phase 1 必須 |
| `created_at` | システム登録日時 | 必須 |

**未決定のまま残す候補**：部屋番号、人数、料金、OTA 予約番号、キャンセル理由。

### 5.3 ライフサイクル

```
[作成] 取り込み or 手動（経路未決定）
  ↓
guest_resolution_status = unresolved（初期）
  ↓
[Guest Resolution] スタッフが候補確認
  ↓
linked（既存 Guest） or new_guest（新規作成と同時に linked）
  ↓
[滞在] Stay 生成タイミング **要検証**（check-in 操作 or 日付境界）
  ↓
[完了] チェックアウト後も Reservation は履歴として残る
  ↓
[キャンセル] 状態 **未決定**（Timeline にイベントを残す **仮説**）
```

### 5.4 リレーション

| 関連 | 備考 |
|------|------|
| Guest | N : 1（紐付け後） |
| Stay | 0..1 : 1 または 0..N : 1（**要検証**） |

### 5.5 Guest Resolution との関係

- Resolution **前**：`guest_id` は null、`unresolved`。
- Resolution **後**：`guest_id` 設定。Timeline に `system` または `resolution` 種別の Entry を残すかは **要検証**（監査・行動変容の追跡用）。

---

## 6. Stay

### 6.1 責務

- **実際に宿泊した（または宿泊中の）一回**を表す。時間の積層における **「滞在」レイヤー**。
- Guest Summary の「過去宿泊回数」「直近滞在」の根拠。
- Relationship（概念）を **数値・一覧で示す**ときの主な材料。

### 6.2 主要属性（論理モデル）

| 属性 | 説明 | MVP |
|------|------|-----|
| `stay_id` | 滞在 ID | 必須 |
| `guest_id` | 所属 Guest | 必須 |
| `reservation_id` | 由来予約 | **要検証**（必須か） |
| `check_in_date` | 実績または予定開始 | 必須 |
| `check_out_date` | 実績または予定終了 | 必須 |
| `status` | 例：`planned` / `in_house` / `completed` / `cancelled` | **要検証** |

**未決定**：部屋、プラン、料金のスナップショット。

### 6.3 ライフサイクル

```
[生成] Reservation 紐付け後〜チェックイン（タイミング要検証）
  ↓
[in_house] （オプション）
  ↓
[completed]
```

Stay レコードの **更新**は状態遷移に限り、過去日付の書き換えは避ける（積層原則）。訂正は Timeline 追記または **未決定**の失効モデル。

### 6.4 リレーション

- Guest 1 : N Stay
- Reservation 1 : 0..1 Stay（**要検証**）

### 6.5 Guest Resolution との関係

- 直接は関係しない。Resolution 完了後に初めて Stay が意味を持つ「その Guest の滞在」として集計される。

---

## 7. Timeline Entry

### 7.1 責務

- Guest に紐づく情報を **時間軸上の積層**として保持する **唯一の MVP 時系列ストア**。
- スタッフの短い気づき・申し送り（03 の「Memory に相当する振る舞い」）を表現する。
- **最新値への上書きで過去を消さない**（訂正方針は §9）。

Timeline は操作ログのダンプではなく、**接客・関係性の文脈**を残すための列。

### 7.2 主要属性（論理モデル）

| 属性 | 説明 | MVP |
|------|------|-----|
| `entry_id` | エントリ ID | 必須 |
| `guest_id` | 所属 Guest | 必須 |
| `occurred_at` | 事象の日時（メモは入力日時でも可：**要検証**） | 必須 |
| `recorded_at` | システム記録日時 | 必須 |
| `entry_type` | 種別（下表） | 必須 |
| `body` | 短文テキスト（メモ本文） | 種別により必須 |
| `sensitivity` | センシティブ度（**未決定**：列の有无・値集合） | 仮説 |
| `created_by` | 記録者（Staff 参照 **未決定**） | 要検証 |
| `related_reservation_id` | 任意の関連予約 | オプション |
| `related_stay_id` | 任意の関連滞在 | オプション |

### 7.3 エントリ種別（MVP 最小提案）

| `entry_type` | 説明 | MVP |
|--------------|------|-----|
| `staff_note` | スタッフの気づき・申し送り | **含める** |
| `stay_marker` | 滞在の開始・終了等（Stay と二重化を避ける設計 **要検証**） | 仮説 |
| `system_event` | 紐付け完了等 | **要検証** |

食事・好み・会話の構造化フィールドは **持たない**（必要なら `staff_note` の本文）。将来の抽出は Phase 2（03 §7）。

### 7.4 ライフサイクル

```
[作成] 追記のみ（append）
  ↓
[参照] Guest Summary / Timeline UI / AI 要約の入力
  ↓
[変更] MVP では原則 **追記型訂正**（§9）。物理削除 **未決定**
```

**禁止する設計（MVP 方針）**：同一 `entry_id` の本文を後から書き換え、過去の意味を消すこと（**確定：原則**）。実装手段は未決定。

### 7.5 リレーション

- Guest 1 : N Timeline Entry
- 任意で Reservation / Stay へリンク

### 7.6 Guest Resolution との関係

- Resolution 自体を記録する `system_event` は **要検証**。
- Resolution 後の接客メモは通常の `staff_note`。

### 7.7 AI 要約との関係

- 要約の **入力**となるが、要約テキストを Timeline Entry として永続するかは **未決定**（**仮説**：都度生成し、原文 Entry へリンク）。

---

## 8. Guest Resolution（プロセス）

永続エンティティではなく、**ユースケース + Reservation の状態**としてモデル化する。

### 8.1 フロー（確定：人間確認）

```
Reservation（unresolved）
  ↓ 照合（氏名・電話・メール・過去予約等：必須キー未決定）
候補 Guest リスト（0件以上）
  ↓ スタッフが確認
選択：既存 Guest に link / 新規 Guest 作成
  ↓
Reservation.guest_id 設定、status = linked
```

### 8.2 ドメイン上の制約（MVP）

- 自動 link のみで `guest_id` が設定されないこと（03 準拠）。
- 未解決 Reservation は Today's Brief で識別可能であること（表示は UI 仕様）。

### 8.3 将来検討（本書では確定しない）

- 候補スコア、説明理由の構造化、Resolution 履歴テーブル

---

## 9. 時間の積層と訂正

### 9.1 原則（確定）

| # | 原則 |
|---|------|
| 1 | 情報は **時系列に積み上げる**（Timeline Entry、Stay の履歴） |
| 2 | **「今の真実」だけを残す上書き**で過去の文脈を消さない |
| 3 | 変化した事情（好み・体調等）は **新しい Entry で表現**する **仮説** |

### 9.2 訂正・削除（未決定 / 要検証）

| 方式 | 説明 | 状態 |
|------|------|------|
| 追記訂正 | 「以前のメモは○○だったが、現在は△△」を新 Entry | **仮説**（MVP 推奨候補） |
| 失効フラグ | 元 Entry を `superseded` にし新 Entry を正とする | **要検証** |
| 物理削除 | 誤入力の削除 | **未決定**（センシティブとセットで ADR 化） |

---

## 10. センシティブ情報

### 10.1 想定（確定：存在認識）

03 より：触れない方がよい情報、誤って広めない情報、現在は変わっている情報がありうる。

### 10.2 MVP ドメインでの扱い

| 項目 | 状態 |
|------|------|
| 分類体系（例：health, bereavement, dispute） | **未決定** |
| `Timeline Entry.sensitivity` 等の属性 | **仮説** |
| 表示時マスキング | **未決定**（UI・05 で検討） |
| Paper Output への露出制御 | **未決定**（03 §6.6） |
| 権限（誰が読めるか） | **未決定**（7 室・個人経営では単純化 **仮説**） |

**確定する方針**：センシティブな本文を **デフォルトで紙・要約に含めない** 方向（03 Paper 方針と整合）。実装ルールは未決定。

---

## 11. Relationship（概念）のドメイン表現

| 問い | 回答（MVP） |
|------|-------------|
| 独立エンティティか | **いいえ**（確定しない） |
| どう表現するか | Stay の回数・期間、Timeline Entry の蓄積から **読み取る** |
| Guest Summary の「関係性の文脈」 | 上記の **派生表示**（集計・抜粋）。永続の `relationship_score` 等は **持たない** |

**将来検討**：Relationship を明示モデル化、グラフ、家族リンク（03 §9 外）。

---

## 12. MVP ドメイン境界

### 12.1 永続化する概念（MVP）

| 概念 | 含む |
|------|------|
| Guest | ○ |
| Reservation | ○ |
| Stay | ○ |
| Timeline Entry | ○ |

### 12.2 永続化しない / 確定しない（MVP）

| 概念 | 扱い |
|------|------|
| Relationship（エンティティ） | × |
| Memory（高度管理ドメイン） | × |
| Briefing（スナップショットエンティティ） | 確定しない |
| Staff / Property / Role | 未決定（最小では Staff ID 文字列のみ **仮説**） |
| AI Summary レコード | 未決定 |
| メール解析パイプライン | ×（ADR） |

### 12.3 集計・表示のみ（エンティティではない）

- Today's Brief：Reservation + Guest + Resolution 状態の **ビュー**
- Guest Summary：Guest + Stay 集計 + Timeline 抜粋 + AI 要約（キャッシュ未決定）
- 過去宿泊回数、直近滞在日

---

## 13. パイロット（7 室）への含意

| 含意 | 内容 |
|------|------|
| データ量 | Guest / Timeline Entry は少数〜中程度。全文検索エンジン等は **未決定** |
| マルチテナント | 1 施設前提で **施設 ID を省略可能か** **未決定** |
| 同時編集 | 少数スタッフ。楽観ロック等は **未決定** |

---

## 14. 実装に渡す際の未決定一覧

1. 永続化技術・スキーマ・ID 形式  
2. Reservation 必須フィールドとキャンセルモデル  
3. Stay 生成タイミングと Reservation の対応  
4. Timeline Entry 種別の最終セット  
5. 訂正・削除・センシティブのポリシー  
6. Guest 照合ルール  
7. AI 要約の保存と再生成  
8. Property / Staff の明示モデル  

---

## 15. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-09-18 | v0.1 初版（03 v0.3 準拠の最小 Guest 中心モデル） |
| 2026-09-30 | 取り込み経路 ADR 反映、`external_reservation_id` を Phase 1 属性に追加 |