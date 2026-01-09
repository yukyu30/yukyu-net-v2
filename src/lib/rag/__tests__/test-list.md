# テストリスト: RAGシステム

**作成日**: 2026-01-09
**対象ディレクトリ**: src/lib/rag/
**テストディレクトリ**: src/lib/rag/__tests__/

---

## 1. vector-store.ts - LibSQLVectorの管理

### 正常系 (Priority: High)
1. [ ] LibSQLVectorStoreを初期化できること <- 最初に実装
2. [ ] ベクトルをupsertできること（単一ドキュメント）
3. [ ] ベクトルをqueryして類似ドキュメントを取得できること
4. [ ] queryでtopKを指定して結果数を制限できること
5. [ ] 指定したslugのベクトルをdeleteできること

### 境界値 (Priority: Medium)
6. [ ] 空のデータベースでqueryすると空配列が返ること
7. [ ] topKが登録件数より大きい場合、登録件数分だけ返ること

---

## 2. embeddings.ts - OpenAI Embedding生成

### 正常系 (Priority: High)
8. [ ] 単一テキストからEmbeddingを生成できること <- 最初に実装
9. [ ] 複数テキストから一括でEmbeddingを生成できること
10. [ ] 生成されたEmbeddingが1536次元であること

### 境界値 (Priority: Medium)
11. [ ] 空配列を渡すと空配列が返ること

---

## 3. indexer.ts - 記事のチャンク分割とインデックス作成

### 正常系 (Priority: High)
12. [ ] 記事をチャンクに分割できること <- 最初に実装
13. [ ] チャンクにメタデータ（slug, title, chunkIndex）が付与されること
14. [ ] 記事をベクトル化してインデックスに追加できること

### 境界値 (Priority: Medium)
15. [ ] 非常に短い記事（1チャンク未満）を処理できること
16. [ ] 空のコンテンツの記事はスキップされること

---

## 4. retriever.ts - 類似記事の検索

### 正常系 (Priority: High)
17. [ ] クエリに基づいて類似チャンクを検索できること <- 最初に実装
18. [ ] 検索結果にスコア（類似度）が含まれること
19. [ ] 検索結果から重複する記事を除去できること

### 境界値 (Priority: Low)
20. [ ] 検索結果が0件の場合、空配列を返すこと

---

**合計**: 20テスト（優先度High: 12個）

## 実装順序

1. **embeddings.ts** - 基盤モジュール
2. **vector-store.ts** - ストレージ層
3. **indexer.ts** - 記事処理
4. **retriever.ts** - 検索機能

## テスト環境

- OpenAI APIはモック化
- LibSQLはインメモリDBを使用（`:memory:`）
