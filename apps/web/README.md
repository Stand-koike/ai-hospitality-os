# apps/web — 藍 ai Phase 1 MVP

**ステータス**: Step 5 完了（Today's Brief がホーム） / 次は Step 6 Guest Summary

## スタック

Next.js 15 · TypeScript · Drizzle ORM · SQLite（`data/lan-ai.db`）

→ [decision-log/20261001-phase1-tech-stack.md](../../decision-log/20261001-phase1-tech-stack.md)

## セットアップ

```bash
cd apps/web
cp .env.example .env   # 任意
npm ci
npm run db:migrate
```

## 開発

```bash
npm run dev          # http://localhost:3000
npm run verify:foundation
npm run verify:import
npm run verify:resolution
npm run verify:brief
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/brief/today
```

## 実装順

[specs/phase-1-implementation.md](../../specs/phase-1-implementation.md) §12

| Step | 状態 |
|------|------|
| 1 Foundation | **完了** |
| 2 Import + upsert | **完了** |
| 3 Guest 一覧 | **完了**（`/guests`） |
| 4 Guest Resolution | **完了**（`/resolution`, 候補・Stay 生成） |
| 5 Today's Brief | **完了**（`/` ホーム, `/api/brief/today`） |
| 6–9 | 未着手 |

## ディレクトリ

```text
src/db/           … スキーマ・マイグレーション
src/lib/repositories/ … Guest / Reservation / Stay / Timeline CRUD
src/app/          … Next.js UI（ホーム = Today's Brief）
src/lib/brief/    … 施設日付・到着/出発一覧
```
