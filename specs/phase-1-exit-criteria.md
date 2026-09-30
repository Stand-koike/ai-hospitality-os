# Phase 1 — Exit Criteria（藍 ai MVP Build）

**ステータス**: 合意ブロック（Project チャット / Coordinator メモ）  
**前提**: [09_ROADMAP.md](../docs/09_ROADMAP.md) §4 · [specs/phase-1-implementation.md](./phase-1-implementation.md)  
**パイロット**: 個人経営・7 室・1 施設（ADR）

Phase 1 完了＝**Phase 2（Pilot）に入れる実装状態**。数値 KPI は設定しない。

---

## 1. Reservation Ingestion

| # | 条件 |
|---|------|
| I1 | **手動登録**で予約を 1 件作成できる |
| I2 | **藍 ai 標準 CSV テンプレート**をインポートできる |
| I3 | **表データ入力**（スプレッドシート運用）から、標準 CSV と **同一スキーマ**で取り込める |
| I4 | 再取込時、**`external_reservation_id`**（＋施設内一意）で **重複レコードを作らない**（更新またはスキップのいずれか一方式で一貫） |
| I5 | **予約メール解析・Make / Google Sheets / Google Calendar 連携に依存しない** |
| I6 | **OTA / PMS API 直接連携は Phase 1 に含めない**（手動・CSV・表のみでデモ可能） |

---

## 2. Guest Resolution

| # | 条件 |
|---|------|
| R1 | 未紐付け予約が **Today's Brief および予約一覧で識別**できる |
| R2 | 候補 Guest を **0 件以上**提示し、スタッフが **既存 Guest に link** または **新規 Guest 作成**できる |
| R3 | **自動 link のみ**で `guest_id` が設定されない（人間確認必須） |
| R4 | 紐付け後、当該 Guest の **Guest Summary / Timeline** に到達できる |

---

## 3. Today's Brief · Guest Summary · Timeline

| # | 条件 |
|---|------|
| B1 | **本日到着・本日出発**が 7 室規模で一覧でき、未 Resolution が見逃しにくい |
| B2 | 到着 Guest から **Guest Summary** へ迷わず遷移できる |
| B3 | Guest Summary で **今回予約＋過去滞在回数（Stay 集計）＋短文要約（AI）** を把握できる |
| B4 | Timeline に **短いテキストを追記**でき、時系列で閲覧できる（上書き一本化しない） |
| B5 | Brief に **売上・稼働率・経営 KPI を載せない** |

---

## 4. AI Summary · Paper Output

| # | 条件 |
|---|------|
| A1 | Guest Summary に **参考用の短文 AI 要約**がある（接客指示・評価・自動 Resolution は出さない） |
| P1 | Today's Brief から **Paper Output**（印刷または PDF 相当）を生成でき、**当日の最小情報**を共有可能 |
| P2 | 紙面に **Timeline 全文・長い AI 要約・センシティブ詳細**をデフォルトで載せない |

---

## 5. Domain · Vertical Slice

| # | 条件 |
|---|------|
| D1 | **Guest / Reservation / Stay / Timeline Entry** の基本関係が成立（[04_DOMAIN_MODEL.md](../docs/04_DOMAIN_MODEL.md)） |
| D2 | エンドツーエンドで **CSV/手動 → Import → Resolution → Brief → Summary → Timeline →（メモ追記）** が操作できる |
| D3 | **7 室モデル施設**想定のデータ量で、主要フローが実演できる（デモ可能） |

---

## 6. Phase 1 → Phase 2（Roadmap 整合）

[09_ROADMAP.md](../docs/09_ROADMAP.md) §4「Phase 1 → Phase 2」に加え、上記ブロック **1–5 をすべて満たす**。

- MVP **主要フローが操作可能**
- Guest Resolution が **人の確認付きで**操作可能
- Today's Brief → Guest Summary → Timeline が **成立**

---

## 7. 明示的に Phase 1 完了条件に含めないもの

- OTA / PMS API 連携
- 予約メール解析
- 経営ダッシュボード・高度 Memory・関係グラフ
- マルチ施設・高度権限
- PMS 別 CSV マッピングプロファイル（標準テンプレ 1 種で可）

---

## 8. 実装開始前の Minor Decision（Exit とは別）

以下は **Exit Criteria のブロック外**だが、実装直前に PO 確認が推奨される（[phase-1-implementation.md](./phase-1-implementation.md) §15）:

1. 標準 CSV の **email / phone の必須**（少なくとも一方必須 vs 両方任意）
2. Guest Resolution の **保留（hold）** を Phase 1 UI に含めるか

---

*更新: 2026-09-30*
