# templates

Phase 1 の **藍 ai 標準 CSV**（Canonical Import Schema）のテンプレートです。

| ファイル | 用途 |
|----------|------|
| [standard-reservation-import.csv](./standard-reservation-import.csv) | 予約取り込み用。列定義は [specs/phase-1-implementation.md](../specs/phase-1-implementation.md) §2.2 |

PMS から出した CSV は、この列に合わせて整形してからインポートします（Phase 1 では PMS 別マッピング UI はありません）。
