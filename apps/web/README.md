# apps/web — 藍 ai Phase 1 MVP

**ステータス**: Step 1 完了（永続化・CRUD 土台） / UI フローは Step 2〜

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
curl -s http://localhost:3000/api/health
```

## 実装順

[specs/phase-1-implementation.md](../../specs/phase-1-implementation.md) §12

| Step | 状態 |
|------|------|
| 1 Foundation | **完了**（`src/db`, `src/lib/repositories`） |
| 2 Import + upsert | 未着手 |
| 3–9 | 未着手 |

## ディレクトリ

```text
src/db/           … スキーマ・マイグレーション
src/lib/repositories/ … Guest / Reservation / Stay / Timeline CRUD
src/app/          … Next.js UI（Brief 等は追加予定）
```
