#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'public_articles');
const ARTICLES_TARGET_DIR = path.join(process.cwd(), 'articles');
const IMAGES_TARGET_DIR = path.join(process.cwd(), 'public', 'articles');

// Check if source exists (skip on Vercel if not found)
if (!fs.existsSync(SOURCE_DIR)) {
  console.log('Source directory public_articles not found. Skipping copy (likely on Vercel).');
  process.exit(0);
}

// Clean and create target directories
if (fs.existsSync(ARTICLES_TARGET_DIR)) {
  fs.rmSync(ARTICLES_TARGET_DIR, { recursive: true, force: true });
}
fs.mkdirSync(ARTICLES_TARGET_DIR, { recursive: true });

if (fs.existsSync(IMAGES_TARGET_DIR)) {
  fs.rmSync(IMAGES_TARGET_DIR, { recursive: true, force: true });
}
fs.mkdirSync(IMAGES_TARGET_DIR, { recursive: true });

function copyDirectory(sourceDir, articlesTargetDir, imagesTargetDir) {
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const articlesTargetPath = path.join(articlesTargetDir, item);
    const imagesTargetPath = path.join(imagesTargetDir, item);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Create target directories
      if (!fs.existsSync(articlesTargetPath)) {
        fs.mkdirSync(articlesTargetPath, { recursive: true });
      }
      if (!fs.existsSync(imagesTargetPath)) {
        fs.mkdirSync(imagesTargetPath, { recursive: true });
      }
      
      // Recursively copy directory contents
      copyDirectory(sourcePath, articlesTargetPath, imagesTargetPath);
    } else if (stat.isFile()) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item);
      const isMarkdown = /\.md$/i.test(item);
      
      if (isMarkdown) {
        // Copy markdown files to articles directory (outside public)
        fs.copyFileSync(sourcePath, articlesTargetPath);
        console.log(`Copied markdown: ${sourcePath} -> ${articlesTargetPath}`);
      } else if (isImage) {
        // Copy images to public/articles for static serving
        fs.copyFileSync(sourcePath, imagesTargetPath);
        console.log(`Copied image: ${sourcePath} -> ${imagesTargetPath}`);
      }
    }
  });
}

console.log('Copying public_articles...');
console.log('- Markdown files -> articles/');
console.log('- Image files -> public/articles/');
copyDirectory(SOURCE_DIR, ARTICLES_TARGET_DIR, IMAGES_TARGET_DIR);
console.log('Article copying completed!');