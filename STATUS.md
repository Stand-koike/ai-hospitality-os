# プロジェクト状況（藍 ai / ai-hospitality-os）

**最終更新**: 2026-10-01  
**正本**: https://github.com/Stand-koike/ai-hospitality-os

このファイルは「いま何が終わって、次に何か」を短くまとめたものです。詳細は各ドキュメントを参照してください。

---

## いまどこ？

| フェーズ | 状態 | 説明 |
|----------|------|------|
| **Phase 0** プロダクト定義 | **完了** | `docs/`（01〜09）・`decision-log/` |
| **Phase 1** 仕様 | **完了（Ready）** | `specs/phase-1-implementation.md` §15 · `phase-1-exit-criteria.md` |
| **Phase 1** 実装（`apps/web`） | **Step 5 完了** | ホーム = Today's Brief。次は Step 6 Guest Summary |
| パイロット施設 | 未決定 | 7 室・1 施設（名称・地域・OTA は未決） |

**結論**: Phase 1 MVP は Step 5 まで実装済み。Guest Summary・Timeline・AI・印刷が残り。

---

## リポジトリの中身

```
ai-hospitality-os/
├── README.md          … 入口
├── STATUS.md          … 本ファイル
├── docs/              … プロダクト正本
├── decision-log/      … ADR（予約取り込み・PMS 境界など）
├── specs/             … Phase 1 実装仕様・出口条件
├── templates/         … 標準 CSV テンプレ（インポート用）
├── apps/web/          … Phase 1 MVP（Brief / Import / Resolution / Guests）
└── .cursor/           … Cloud Agent 用環境設定
```

**含めないもの**: `presenter-gesture-mvp`（別プロダクト）、Make/Sheets 前提の取込、予約メール解析。

---

## これまでにやったこと（履歴）

1. 空リポジトリに bootstrap ドキュメントを投入
2. Phase 1 仕様と PMS/CSV 整合パッチを適用（bootstrap 用巨大 `.patch` はリポジトリから削除）
3. README・`.gitignore` を現状に合わせて整理

---

## 次にやること（推奨順）

1. **Step 6**: Guest Summary（`specs/phase-1-implementation.md` §6）
2. **Step 7**: Timeline 追記・表示
3. **Step 8–9**: AI Summary · Paper Output
4. 出口条件: [specs/phase-1-exit-criteria.md](specs/phase-1-exit-criteria.md)

**デバイス（決定済）**: メイン＝タブレット/PC。モバイル＝Brief 確認 + Timeline メモ（Resolution はメイン端末）→ [decision-log/20261001-device-strategy-phase1.md](decision-log/20261001-device-strategy-phase1.md)

---

## Cursor / Cloud Agent

- 作業リポジトリは **このリポジトリ**に設定する
- GitHub 連携・403 対処: [docs/github-cursor-connection.md](docs/github-cursor-connection.md)
- 環境設定: [.cursor/environment.json](.cursor/environment.json)

---

## 迷ったときの読み順

1. [README.md](README.md)
2. [specs/phase-1-implementation.md](specs/phase-1-implementation.md)
3. [specs/phase-1-exit-criteria.md](specs/phase-1-exit-criteria.md)
4. [docs/repository-bootstrap.md](docs/repository-bootstrap.md)
