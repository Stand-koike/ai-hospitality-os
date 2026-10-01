# apps/web — Phase 1 MVP UI

**ステータス**: 未着手（スキャフォールド前）

## 目的

Phase 1 の Vertical Slice:

```text
CSV / 表 / 手動 → Reservation Import → Guest Resolution
→ Today's Brief → Guest Summary → Timeline
```

## 実装前に読むもの

- [specs/phase-1-implementation.md](../../specs/phase-1-implementation.md)
- [specs/phase-1-exit-criteria.md](../../specs/phase-1-exit-criteria.md)
- [docs/05_UI_UX.md](../../docs/05_UI_UX.md)

## 実装順（抜粋）

1. Foundation（永続化・エンティティ）
2. Reservation Import（`templates/standard-reservation-import.csv`）
3. Guest Resolution → Brief → Summary → Timeline

技術スタック（フレームワーク・DB・認証）は **リポジトリ未決定**。スキャフォールド時に `package.json` 等をここに追加する。
