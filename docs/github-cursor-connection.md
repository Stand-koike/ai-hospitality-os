# 藍 ai — GitHub / Cursor Cloud 接続手順

**リポジトリ**: https://github.com/Stand-koike/ai-hospitality-os

## 現状（Agent 側の確認）

| 項目 | 状態 |
|------|------|
| **読み取り**（clone / fetch） | OK |
| **書き込み**（`cursor[bot]` の push） | **403 — 権限なし** |
| **この Cloud 環境の checkout** | `presenter-gesture-mvp` のみ（`ai-hospitality-os` は未リンク） |

Agent だけでは「接続完了」にできません。**次の 2 点**をオーナー（`Stand-koike`）側で行ってください。

---

## 手順 1 — GitHub で Cursor にリポジトリを許可

1. GitHub → **Settings** → **Applications** → **Installed GitHub Apps** → **Cursor**（名称は環境により近いもの）
2. **Repository access** で `ai-hospitality-os` を追加（または All repositories）
3. 権限に **Contents: Read and write** が含まれることを確認

確認: Cloud Agent から `git push` が 403 ではなくなる。

---

## 手順 2 — Project / Cloud Agent の作業リポジトリを切り替え

藍 ai の実装・ドキュメント編集は **`ai-hospitality-os` を checkout した Agent** で動かす。

1. Cursor **Dashboard** → [Cloud Agents Environments](https://cursor.com/dashboard/cloud-agents/environments)
2. Project「藍」用の環境で **Repository** を `Stand-koike/ai-hospitality-os` に設定（新規環境でも可）
3. 新しい Cloud Agent を **そのリポジトリ** から起動

参考: 複数リポジトリが必要な場合は、正本リポジトリの `.cursor/environment.json` に `repositoryDependencies` を定義（[環境スキーマ](https://cursor.com/schemas/environment.schema.json)）。

---

## 手順 3 — ドキュメント正本の反映（未 push の場合）

GitHub 上が `README.md` だけのとき、初回 bootstrap を載せる:

**オーナーがローカルで:**

**Cloud Agent（`/workspace` が `ai-hospitality-os` のとき）:**

```bash
# bundle の実パス（Project Store が VM にマウントされている場合）
BUNDLE="/cursor/stores/bc-5280cccd-82d4-4610-9857-85c38304c2d7/internal/ai-hospitality-os-initial.bundle"
# または media コピー:
# BUNDLE="/cursor/stores/bc-5280cccd-82d4-4610-9857-85c38304c2d7/media/ai-hospitality-os-initial.bundle"

test -f "$BUNDLE" || { echo "bundle なし → Context の internal/ai-hospitality-os-initial.bundle をチャット添付し /workspace に置く"; exit 1; }

cd /workspace
git fetch "$BUNDLE" main:bootstrap-main
git merge bootstrap-main --allow-unrelated-histories -m "docs: bootstrap 藍 ai"
# README が conflict したら藍 ai 版（bootstrap 側）を残す
git push origin main
```

**Mac の Project Context（ファイル UI）:**

`internal/ai-hospitality-os-initial.bundle` または `media/ai-hospitality-os-initial.bundle`  
（実体例: `…/AgentStores/…/bc-5280cccd-…/files/internal/ai-hospitality-os-initial.bundle`）

VM に Store が無い Agent では、**bundle をチャットに添付** → Agent に `/workspace/ai-hospitality-os-initial.bundle` として保存させてから、上記の `BUNDLE=/workspace/ai-hospitality-os-initial.bundle` で同じ手順。

**オーナーがローカル Mac で:**

```bash
git clone https://github.com/Stand-koike/ai-hospitality-os.git
cd ai-hospitality-os
BUNDLE="$HOME/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/bc-5280cccd-82d4-4610-9857-85c38304c2d7/files/internal/ai-hospitality-os-initial.bundle"
git fetch "$BUNDLE" main:bootstrap-main
git merge bootstrap-main --allow-unrelated-histories -m "docs: bootstrap 藍 ai"
git push origin main
```

詳細: [internal/ai-hospitality-os-bootstrap-push.md](../internal/ai-hospitality-os-bootstrap-push.md)

**Agent VM 上**（権限付与後）: `/home/ubuntu/ai-hospitality-os` にマージ済みコミットを置いてある場合は、そこから `git push origin main` のみでよい。

---

## 接続確認コマンド

```bash
git ls-remote https://github.com/Stand-koike/ai-hospitality-os.git HEAD
git clone https://github.com/Stand-koike/ai-hospitality-os.git /tmp/check && ls /tmp/check/docs
cd /path/to/ai-hospitality-os && git push --dry-run origin main
```

---

*更新: Cloud Agent 接続試行 — read OK / write は GitHub App 設定待ち*
