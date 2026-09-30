# decision-log

このディレクトリは **Architecture Decision Record（ADR）** スタイルで、藍 ai プロジェクトの重要な意思決定を残す場所です。

## 目的

- **何を決めたか**・**なぜそうしたか**・**どの代替案を捨てたか** を後から追えるようにする。
- README やプロダクト定義は「現在有効な真実」、decision-log は「その真実に至った経路」。

## いつ書くか（仮説）

- MVP スコープ・Phase 境界の変更
- ブランド表記・カテゴリ呼称の固定
- 統合経路（Make / Sheets / Calendar 等）の公式な採用方針
- AI の Phase 1 で許可するユースケースの確定

## フォーマット（未決定 — 推奨テンプレート）

新規ファイル例: `0001-short-title.md`

```markdown
# 0001. タイトル

- Status: 提案 | 承認 | 廃止
- Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

番号・テンプレートはプロジェクト合意後に固定する（**未決定**）。

## 関連ドキュメント

- [../README.md](../README.md)
- [../docs/02_PRODUCT_DEFINITION.md](../docs/02_PRODUCT_DEFINITION.md)