# 決定：Phase 1 デバイス戦略（メイン端末とモバイルの役割分担）

- 日付：2026-10-01
- ステータス：承認（PO 指示）
- 関係者：プロダクトオーナー

## コンテキスト

`docs/05_UI_UX.md` §10 Open Question #1（Desktop / Tablet / Mobile の優先順位）が未決だった。Phase 1 実装着手前に、パイロット（7 室・小規模）での現場利用を想定し、端末ごとの役割を固定する。

## 決定

### メイン端末（タブレット & PC）

- **Today's Brief**（全体像・到着/出発・未 Resolution の把握）
- **Guest Resolution**（候補比較・紐付け・新規 Guest 作成）
- **Reservation Import**（CSV・表・手動）
- **Guest Summary**（じっくり読む・履歴把握）
- **Paper Output** / Print Preview

### モバイル（スマートフォン）— Phase 1

**確認とメモに特化**する。別プロダクトではなく、同一 Web の **モバイル向け簡易体験**（専用ルートまたはビュー）として追加する。

| 含める | 含めない（Phase 1） |
|--------|---------------------|
| Brief の当日サマリ（到着・未 Resolution の目安） | CSV / 表 Import |
| Guest Summary の **要点ブロック**（任意・短く） | **Guest Resolution 本体** |
| Timeline **短文追記** | Print / PDF |
| 未 Resolution への **ディープリンク**（本体操作はメイン端末） | 長文 AI 要約の読み込み専用 UI |

### Guest Resolution と端末

- **Resolution の確定操作はメイン端末（タブレット/PC）で行う。**
- モバイルでは「未解決がある」ことの通知・件数・メイン端末への導線まで。フロアでスマホのみの運用で Resolution まで完結させない（誤紐付け防止・画面幅）。

### 実装順

1. メイン端末で Vertical Slice（[specs/phase-1-implementation.md](../specs/phase-1-implementation.md) Step 1〜7）を成立させる。
2. 同一パイロット内でモバイル向け Brief サマリ + Timeline クイック投稿を追加（Step 7 以降または直後）。

### ビジュアルデザイン

ブランド（色・タイポ・コンポント）は **後から整える**。Phase 1 は読みやすさ・タップ領域・短文入力を優先。

## 理由

- Resolution は Human Confirmation と候補比較が中心で、大画面・集中操作向き（[05_UI_UX.md](../docs/05_UI_UX.md) §4.4）。
- 行動ループのうち「気づきを Timeline に残す」はフロア・接客直後に起きやすく、モバイル価値が高い（Leave Information Behind）。
- 7 室規模でも共有タブレット + 個人スマホの併用は現実的。Phase 1 で全画面をモバイル最適化するとスコープが膨らむ。

## 代替案

- モバイルでも Resolution まで完結 → **Phase 1 では採用しない**（UI コスト・誤操作リスク）。必要なら Phase 2 以降で検証。
- モバイルはレスポンシブのみ（専用ビューなし） → **不採用**（確認・メモ特化の意図が弱い）。

## フォローアップ

- `docs/05_UI_UX.md` §10 #1 を本決定に合わせて参照可能にする（Open Questions は実装時に画面単位で潰す）
- `specs/phase-1-implementation.md` 実装時：モバイル範囲を Step 9 付近または別 Step として追記可
