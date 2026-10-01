# 05 — UI / UX（藍 ai MVP）

**バージョン**：v0.1  
**ステータス**：MVP UI/UX 仕様（実装前）  
**前提**：[README.md](../README.md) · [01_BRAND_BOOK.md](./01_BRAND_BOOK.md) · [02_PRODUCT_DEFINITION.md](./02_PRODUCT_DEFINITION.md) · [03_MVP_SPEC.md](./03_MVP_SPEC.md) · [04_DOMAIN_MODEL.md](./04_DOMAIN_MODEL.md)（**v0.2 を最新**）

本書は **画面一覧やワイヤーフレームの代わりではない**。各画面で **スタッフにどんな行動を起こしてほしいか** まで定義する。

**評価基準**

> この画面によって、宿泊施設の現場スタッフの行動が変わるか。

技術選定（フレームワーク・DB・ホスティング・AI モデル等）は **本書の範囲外**（未決定）。

**パイロット前提**：個人経営・7 室・1 施設（[decision-log](../decision-log/)）。大規模ホテル向けの複雑ナビ・権限 UI は MVP に含めない。

---

## 1. 中心となる UX ループ

藍 ai MVP の UI/UX は、次の循環を **支えること**が目的である（[03 §1](./03_MVP_SPEC.md)、[04 §7](./04_DOMAIN_MODEL.md)）。

```text
Today's Brief
    ↓ 今日の Guest を把握
Guest Summary
    ↓ Guest を理解
必要なら Timeline
    ↓ 接客
気づく
    ↓ 短いメモを残す（Timeline Entry）
次のスタッフが見る
    ↓ 次の接客につながる
```

**理解 → 接客 → 気づき → 記録 → 共有 → 次の接客**

藍 ai は「情報を見るだけの顧客管理システム」ではなく、**情報を残す行動を現場に定着させる**プロダクトである。UI は **Read → Understand → Act** で終わらせない。

### 1.1 行動変容と画面の対応（概要）

| フェーズ | 主な画面 |
|----------|----------|
| 理解 | Today's Brief → Guest Summary →（Timeline） |
| 紐付け | Guest Resolution → Guest Summary |
| 記録 | Timeline（気づきを残す） |
| 共有 | Today's Brief、Paper Output |

---

## 2. UI 設計原則（MVP）

| 原則 | 内容 |
|------|------|
| **Today First** | 開いたら **今日の業務**（到着・出発・未解決予約）が分かる |
| **Guest-centered** | Reservation 一覧だけで終わらず、**Guest として**過去から現在を理解する（[04 §3.1](./04_DOMAIN_MODEL.md)） |
| **Minimal** | メニュー・情報量・入力負担を増やさない |
| **Read → Understand → Act** | 閲覧で終わらせず、接客・記録・Resolution へ進める |
| **AI is Assistance** | 要約・理解補助のみ。評価・接客指示・自動判断はしない（[03 §7](./03_MVP_SPEC.md)） |
| **Human Confirmation** | Guest Resolution 等の重要判断は **人間が確認** |
| **Leave Information Behind** | 接客後の気づきを **短く** Timeline に残せる |

---

## 3. ナビゲーション（基本案）

MVP では複雑な SaaS 型メニューを作らない。

```text
Today's Brief（ホーム）
 ├─ Guest Summary
 │    └─ Timeline
 │         └─ 気づきを残す
 │
 ├─ Guest Resolution
 │    └─ Guest Summary
 │
 └─ Paper Output
      └─ Print Preview → Print / PDF
```

- **主要入口にしない**：検索、分析、経営、Guest ランキング、高度設定（必要最小の設定は **未決定**）。
- **Reservation Detail** は独立した「予約中心ホーム」にはしない。Resolution または Brief からの **補助画面**（§7）。

**3 タップについて**（[03](./03_MVP_SPEC.md)）：到着 Guest から Guest Summary まで **3 タップ程度**は設計**目安**であり絶対条件ではない。重要なのは **迷わず Guest 理解まで到達できること**（速度・文脈の明確さ）。

**最終ナビゲーション構造**：実装前にパイロットで検証。**未決定**（§12）。

---

## 4. 画面仕様

各画面は次の 7 項目で記述する。

- **Purpose** / **Staff Behavior** / **Display** / **Primary Action** / **Next Step** / **Behavioral Change** / **MVP Out of Scope**

---

### 4.1 Today's Brief

#### Purpose

MVP の **ホーム**。今日来る・出るお客様を把握し、**短時間で理解の準備**を始める入口（体験 A の起点）。

#### Staff Behavior

- 当日の業務開始時（またはチェックイン前）に **まず Today's Brief を開く**。
- 本日の **Arrival / Departure** を確認する。
- **未解決の Reservation**（Guest Resolution 未完了）を見逃さず、対応する。
- 到着 Guest を選び **Guest Summary** へ進む。

#### Display

| 表示 | 内容 |
|------|------|
| 今日の Arrival | Guest 名、Check-in / Check-out（最小） |
| 今日の Departure | 同上（最小） |
| Repeat indicator | **最小限**（例：過去滞在あり／回数の簡易表示。**形式未決定**） |
| Guest Resolution 状態 | 未紐付け予約の識別（バッジ・件数等 **未決定**） |
| 導線 | Guest Summary へ |

**表示しない（MVP 確定）**：売上グラフ、稼働率、KPI、顧客ランキング、Guest スコア、経営分析。

#### Primary Action

**到着 Guest を選ぶ**（または未解決予約を開く）。

#### Next Step

- 紐付け済み → **Guest Summary**
- 未解決 → **Guest Resolution**（または Reservation Detail 経由 **未決定**）

#### Behavioral Change

「今日誰が来るか」を口頭・記憶頼みから、**Brief を見てから動く**習慷に変える。未紐付けを **見える化**し、Resolution を後回しにしない。

#### MVP Out of Scope

ダッシュボード化、売上・稼働、予約全体カレンダーのメイン化、清掃ボード、通知センター型 UI。

---

### 4.2 Guest Summary

#### Purpose

**接客前に、その Guest を短時間で理解する**（体験 A の主画面）。

#### Staff Behavior

- チェックイン・接客前に Summary を開き、**今回の予約と過去の文脈**を把握する。
- AI Summary を **参考**として読み、必要なら **Timeline の原文**を確認する。
- 十分なら接客へ。深掘りが必要なら **Timeline** へ。

#### Display

| 表示 | 内容 |
|------|------|
| 今回の Reservation | 日程・状態（[04](./04_DOMAIN_MODEL.md) で未定の項目は出しすぎない） |
| 過去宿泊回数 | Stay 由来の集計 |
| 最新の宿泊 | 直近 Stay の概要 |
| AI Summary | Guest に紐づく過去情報の **要約**（補助レイヤー） |
| 導線 | Timeline |
| 関係性の文脈 | Relationship **概念**としての短文・回数等（独立エンティティ UI はない） |

**業務情報**（アレルギー等）：[03](./03_MVP_SPEC.md) テーブルステークス。MVP の最小フィールドは **未決定**。

#### Primary Action

**Timeline を見る** または **接客に進む**（戻る先は Today's Brief）。

#### Next Step

- **Timeline**（深掘り）
- 接客後 → **Timeline で気づきを残す**

#### Behavioral Change

履歴を読む時間を AI 要約で短縮しつつ、**接客前に一度立ち止まって理解する**行動を定着させる。AI は「こう接客すべき」とは言わない。

#### MVP Out of Scope

Guest 評価・ランク、接客スクリプト、AI 接客提案、長大カルテ、Memory 管理 UI、家族グラフ。

---

### 4.3 Timeline

#### Purpose

Guest に紐づく **時系列の文脈**を見せ、**スタッフの気づきを次のスタッフに残す**場所（[04 §7](./04_DOMAIN_MODEL.md)）。

#### Staff Behavior

```text
接客
  ↓
気づく
  ↓
短く記録する
  ↓
（次のスタッフが）見る
```

- 接客の前後で **過去の積層**を確認する。
- 接客後、**短いメモ**（Timeline Entry）を追記する。入力は最小・短文。

#### Display

| 表示 | 内容 |
|------|------|
| 時系列リスト | Stay マーカー、スタッフメモ等（種別 **要検証**、[04](./04_DOMAIN_MODEL.md)） |
| 追記 UI | 短いテキスト入力（プレースホルダ・字数上限 **未決定**） |
| 導線 | Guest Summary へ戻る、要約の根拠として AI Summary と対応 |

#### Primary Action

**気づきを短く残す**（追記）。

#### Next Step

- Guest Summary に戻る
- 次シフトのスタッフが同じ Guest の Timeline を開く（Today's Brief 経由）

#### Behavioral Change

「頭と口だけの申し送り」から、**Guest に紐づく記録を残す**行動へ。読むだけの画面にしない。

#### MVP Out of Scope

複雑タグ、添付大量、業務ログ全自動、編集履歴 UI の高度化、顧客カルテ型の構造化フォーム。編集・削除ポリシーは **未決定**（§12）。

---

### 4.4 Guest Resolution

#### Purpose

**Reservation を既存 Guest に正しく紐付ける**（体験 C）。プロセスの UI（[04 §8](./04_DOMAIN_MODEL.md)）。

#### Staff Behavior

```text
Reservation
  ↓
候補 Guest
  ↓
スタッフが確認
  ↓
既存 Guest に紐付け
  または
新規 Guest 作成
```

- 候補と **一致理由**（表示項目 **未決定**）を見比べる。
- 確信がない場合は **無理に紐付けない**（保留の扱い **未決定**）。
- 完了後 **Guest Summary** で文脈を確認する。

#### Display

| 表示 | 内容 |
|------|------|
| 予約側 | 氏名、連絡先、日程（最小） |
| 候補 Guest | リスト（0 件以上）。自動確定 UI はない |
| アクション | 既存に紐付け / 新規 Guest / キャンセル（保留は **未決定**） |

#### Primary Action

**人間が選んで確定**（既存 Guest または新規作成）。

#### Next Step

**Guest Summary**（紐付け完了後）。

#### Behavioral Change

予約を見たとき **「以前のお客様かも」** と気づき、確認してから Guest につなぐ。システム・AI の自動本人確定に頼らない。

#### MVP Out of Scope

AI による最終 Resolution、スコアのみでワンタップ紐付け、自動マージ、家族同一視。

---

### 4.5 Reservation Detail

#### Purpose

**Reservation そのもの**を確認する補助画面。予約中心プロダクトにはしない（[04](./04_DOMAIN_MODEL.md)：Reservation はイベント）。

#### Staff Behavior

- Brief や Resolution から、予約の **生データ**（取り込み内容）を確認する。
- 確認後、**Guest Resolution** または **Guest Summary**（紐付け済）へ進む。

#### Display

[03 §6.1](./03_MVP_SPEC.md)・[04 §5](./04_DOMAIN_MODEL.md) で **未決定**の属性は、ここでも **確定しない**。表示候補のみ：

- 宿泊者名、Check-in / Check-out、連絡先、紐付け状態、取り込み元（**未決定**）

#### Primary Action

**Guest Resolution へ進む**（未解決時）または **Guest Summary**（解決済）。

#### Next Step

```text
Reservation Detail
  → Guest Resolution
  → Guest Summary
```

#### Behavioral Change

予約メールや OTA の写しを探す時間を減らし、**一画面で予約を確認してから Guest へつなぐ**。

#### MVP Out of Scope

予約編集の全機能、料金・在庫管理、チャネル別複雑状態、予約をホームにする設計。

---

### 4.6 Paper Output

#### Purpose

**Today's Brief を紙（または PDF）で共有**し、朝礼・申し送り・厨房等で同じ「今日の Guest 像」を揃える（[03 §6.6](./03_MVP_SPEC.md)）。

#### Staff Behavior

```text
Today's Brief
  ↓
Print Preview
  ↓
Print / PDF
```

- 共有に必要な **最小情報**だけを出す意識でプレビューする。
- Timeline 全文や長い AI Summary を紙に載せない（方針）。

#### Display

| 表示 | 内容 |
|------|------|
| Print Preview | 当日 Arrival / Departure 等の **抜粋**（項目 **未決定**） |
| 操作 | 印刷または PDF（方式 **未決定**） |

**紙に含めない方針（レベル）**：Timeline 全文、長い AI Summary、センシティブ情報の詳細（具体ルール **未決定**、[04 §10](./04_DOMAIN_MODEL.md)）。

#### Primary Action

**プレビュー確認後に印刷 / PDF 出力**。

#### Next Step

現場での紙共有 → スタッフが必要なら各自デバイスで Guest Summary / Timeline（画面側は別動線）。

#### Behavioral Change

口頭朝礼のみから、**Brief ベースの共有**を足す。全情報を紙に出さないことで安全と速度を両立（詳細は Open Questions）。

#### MVP Out of Scope

厨房別レイアウトの確定、自動毎朝印刷、フル Guest カルテ印刷、センシティブ分類の実装仕様の先取り。

---

## 5. 行動変容ループ（UI 上の明示）

次のパスが UI 上 **自然に辿れる**こと（§1 と同一内容の UI 視点）。

```text
Today's Brief
    ↓
Guest Summary
    ↓
Timeline
    ↓
接客（画面外の現場行動）
    ↓
気づき
    ↓
Timeline Entry（追記）
    ↓
次のスタッフ（Today's Brief / Guest Summary / Timeline）
```

**Guest Resolution** はループの「横入り」：予約が入ったとき **C** を満たし、その後は同じ理解ループに合流する。

---

## 6. AI UX（MVP）

| 項目 | 内容 |
|------|------|
| 用途 | **Guest 履歴の要約**（主に Guest Summary） |
| 入力 | Guest に紐づく Stay / Timeline 等（範囲 **未決定**、[04 §12](./04_DOMAIN_MODEL.md)） |
| 出力 | 短文要約。**原文 Timeline へ戻れる**導線を持つ（根拠表示の形式 **未決定**） |

**MVP に入れない UI**

- 接客提案、「こう言え」、要注意の自動判定を **中核**にした画面
- Guest 評価・スコア・ランキング
- AI による最終 Guest Resolution
- 自動接客チャット

AI Summary の保存・更新タイミング・文字量は **未決定**（§12）。

---

## 7. Privacy / Sensitive Information

[04 §10](./04_DOMAIN_MODEL.md) と整合。ここでは **課題と方針レベル**のみ（具体ルールは確定しない）。

| 領域 | 課題 |
|------|------|
| 画面表示 | センシティブな Timeline を **いつ・誰が**見るか **未決定** |
| AI Summary | 含めない情報がある **方針**。分類 **未決定** |
| Paper Output | 紙に出さない情報がある **方針**。マスキング **未決定** |
| 権限 | Permission モデル **未決定** |

7 室・個人経営でも、将来の権限を **ここで先取り実装しない**。

---

## 8. ドメイン・機能との対応

| UI | ドメイン / プロセス（[04](./04_DOMAIN_MODEL.md)） |
|----|--------------------------------------------------|
| Today's Brief | Reservation、Guest、Resolution 状態の **ビュー** |
| Guest Summary | Guest、Stay 集計、AI Summary（補助）、Timeline 抜粋 |
| Timeline | Timeline Entry（`staff_note` 中心） |
| Guest Resolution | プロセス（永続エンティティではない） |
| Reservation Detail | Reservation |
| Paper Output | Brief の出力表現（永続エンティティではない） |

---

## 9. MVP UX 境界（再掲）

[03 §9](./03_MVP_SPEC.md) と一致。UI として作らない例：

経営ダッシュボード、レビュー分析、LINE、清掃、教育、Community、高度 Memory 管理、関係グラフ、メール解析取り込み UI、Guest スコア、AI 接客・自動判断。

---

## 10. Open Questions

既存ドキュメントで **未決定・要検証**のもののみ。

| # | 項目 |
|---|------|
| 1 | Desktop / Tablet / Mobile の優先順位 — **Phase 1 方針は [decision-log/20261001-device-strategy-phase1.md](../decision-log/20261001-device-strategy-phase1.md)**（メイン＝タブレット/PC、モバイル＝確認・メモ、Resolution はメイン） |
| 2 | 最終ナビゲーション（タブ・ハンバーガー・単一ホーム等） |
| 3 | Today's Brief の詳細レイアウト（Arrival / Departure の並び） |
| 4 | Repeat indicator の表示形式 |
| 5 | Guest Summary の情報量・業務フィールド最小セット |
| 6 | AI Summary の文字量・更新・永続化・根拠表示 |
| 7 | Timeline Entry の入力方法（字数、テンプレ、音声等） |
| 8 | Timeline の編集・削除・訂正 UI |
| 9 | Guest Resolution の候補表示・一致理由・保留フロー |
| 10 | Reservation Detail の表示フィールド |
| 11 | Paper Output：用紙、レイアウト、出力項目、PDF、マスキング |
| 12 | Sensitive Information の分類・表示・紙・AI への反映 |
| 13 | Permission / Staff / 認証 UI |
| 14 | 予約取り込み UI（経路未決定に依存） |
| 15 | 設定画面の最小範囲 |
| 16 | 予約作成・一覧を独立メニューにするか（02 仮メニューとの整合） |

---

## 11. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-09-18 | v0.1 初版（03 v0.3・04 v0.2 準拠） |