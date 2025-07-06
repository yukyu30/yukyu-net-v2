# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is yukyu's personal blog website built with Next.js, featuring Japanese content about technology, lifestyle, travels, and personal reflections. The blog uses a file-based content management system with Markdown posts.

## Tech Stack
- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **React**: v19.0.0
- **Markdown**: gray-matter, remark, remark-html
- **Date Formatting**: date-fns with Japanese locale

## Essential Commands
```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Architecture Overview

### Content Management
Blog posts are stored as Markdown files in `public_articles/` with this structure:
```
public_articles/
├── YYYY-MM-DD/           # Date-based folders
│   ├── index.md         # Post content with frontmatter
│   └── *.jpg/png        # Associated images
├── me/                  # About page
└── privacy-policy/      # Privacy policy
```

### Post Frontmatter Format
```markdown
---
id: "unique-post-id"
title: "Post Title"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
---
```

### Key Files
- `lib/posts.ts`: Core blog functionality - reading, parsing, and processing posts
- `app/page.tsx`: Homepage that lists all blog posts chronologically
- `app/posts/[slug]/page.tsx`: Dynamic route for individual blog posts
- `next.config.ts`: Configures image optimization for AWS S3

### Image Handling
- Images are stored alongside posts in the same folder
- Reference images in Markdown with relative paths: `![alt](./image.jpg)`
- The system automatically converts relative paths to absolute paths during processing
- S3-hosted images are supported via Next.js image optimization config

### Static Generation
The blog uses static generation with `generateStaticParams` to pre-render all posts at build time for optimal performance.

## Development Notes
- No testing framework is currently configured
- No environment variables are required
- Images can be stored locally or on AWS S3 (cloudfront.net domain configured)
- The project uses the latest React 19 and Next.js 15 features
- All content is in Japanese with proper date formatting support

## TDD開発手法（t-wadaスタイル）

新機能を実装する際は、以下のTDD（Test-Driven Development）プロセスに従ってください：

### 1. タスクの分解
大きなタスクを小さなサブタスクに分解します。各サブタスクは独立してテスト可能な単位にします。

例：「ブログ記事のタグ機能を追加」
- サブタスク1: Markdownフロントマターにtagsフィールドを追加
- サブタスク2: タグを解析してPostDataに含める処理
- サブタスク3: タグ一覧を取得する関数を実装
- サブタスク4: タグごとの記事一覧を取得する関数を実装
- サブタスク5: UIにタグを表示

### 2. TDDサイクル
各サブタスクに対して以下のサイクルを繰り返します：

#### Red（失敗するテストを書く）
```typescript
// 例: lib/posts.test.ts
test('記事からタグを抽出できる', () => {
  const post = getPostData('2024-01-01');
  expect(post.tags).toEqual(['技術', 'Next.js']);
});
```

#### Green（テストを通す最小限の実装）
```typescript
// 例: lib/posts.ts
export function getPostData(slug: string): PostData {
  // ... 既存のコード
  const tags = matterResult.data.tags || [];
  return {
    ...existingData,
    tags
  };
}
```

#### Refactor（リファクタリング）
テストが通った状態を維持しながら、コードを改善します。

### 3. テスト環境のセットアップ
テストフレームワークが未設定の場合：
```bash
# Jest + React Testing Library のインストール
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest

# jest.config.js の作成
# package.json にテストスクリプトを追加
```

### 4. 実装の原則
- **テストファースト**: 実装前に必ずテストを書く
- **小さなステップ**: 一度に一つのことだけを変更
- **頻繁なコミット**: 各サブタスク完了時にConventional Commitsに従ってコミット
- **明確な意図**: テスト名は日本語で意図を明確に表現

### 5. コミット規約（Conventional Commits）
各サブタスクが完了したら、以下の形式でコミットします：

```
<type>(<scope>): <subject>

<body>
```

#### タイプ
- `feat`: 新機能
- `fix`: バグ修正
- `test`: テストの追加・修正
- `refactor`: リファクタリング
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `chore`: ビルドプロセスやツールの変更

#### 例
```bash
# テスト追加時
git commit -m "test(posts): タグ抽出機能のテストを追加"

# 実装時
git commit -m "feat(posts): Markdownフロントマターからタグを抽出する機能を実装"

# リファクタリング時
git commit -m "refactor(posts): タグ処理のロジックを別関数に分離"
```

### 6. テストの種類
- **ユニットテスト**: 個々の関数やコンポーネント
- **統合テスト**: 複数のモジュールの連携
- **E2Eテスト**: ユーザー視点でのシナリオテスト（必要に応じて）

## 必要な知識の追加

新しい技術やライブラリを使用する際は、CLAUDE.mdに以下の情報を追加してください：

### 追加すべき情報
1. **新しい依存関係**: インストールしたパッケージとその用途
2. **新しいコマンド**: 追加したnpmスクリプトやビルドコマンド
3. **アーキテクチャの変更**: ディレクトリ構造やデータフローの変更
4. **設定ファイル**: 新しく追加した設定ファイルとその役割
5. **開発パターン**: プロジェクト固有の実装パターンやベストプラクティス

### 例
```markdown
## 追加された機能: タグシステム

### 依存関係
- `react-tag-input`: タグ入力UI用（バージョン: x.x.x）

### 新しいコマンド
- `npm run generate-tags`: 全記事のタグ一覧を生成

### アーキテクチャ変更
- `lib/tags.ts`: タグ関連のユーティリティ関数
- `app/tags/[tag]/page.tsx`: タグ別記事一覧ページ

### フロントマター拡張
```yaml
tags: ["技術", "Next.js", "React"]
```
```

このように、将来のClaude Codeインスタンスが効率的に作業できるよう、重要な変更は必ずドキュメント化してください。