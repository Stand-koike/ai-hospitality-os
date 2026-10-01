# 決定：Phase 1 Minor Decisions（推奨デフォルト採用）

- 日付：2026-10-01
- ステータス：承認（PO 指示）
- 関係者：プロダクトオーナー

## コンテキスト

[specs/phase-1-implementation.md](../specs/phase-1-implementation.md) §15 は **Minor Decision Required** としていた。実装開始前に PO が推奨デフォルトを採用するか確認した。

## 決定

| 項目 | 採用（推奨デフォルト） |
|------|------------------------|
| 標準 CSV・手動・表の **email / phone** | **`email` と `phone` の少なくとも一方は必須**（両方空は行エラー）。個別に両方必須ではない |
| Guest Resolution **保留（hold）** | **Phase 1 では UI に含めない**。未解決は Brief に残り続け、メイン端末で Resolution する |

その他 §13 の推奨も Phase 1 の前提として採用する（変更なし）:

- 紐付け時の `system_event` Timeline → **省略可**
- Stay の `in_house` → **省略**（`planned` / `completed` / `cancelled`）
- 認証 → **実装時決定**（パイロットは単一共有アカウントでも可）

## 理由

- 連絡先が一方もないと Resolution 候補が弱く、誤新規・誤別人のリスクが上がる。
- hold は UI・状態機械が増え、7 室パイロットでは「未解決を見続ける」で足りる（[20261001-device-strategy-phase1.md](./20261001-device-strategy-phase1.md) と整合）。

## フォローアップ

- `specs/phase-1-implementation.md` §2.2・§15 を **Ready** に更新
- Import バリデーション・手動フォームは「一方必須」ルールを実装
