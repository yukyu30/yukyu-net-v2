#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'public_articles');
const TARGET_DIR = path.join(process.cwd(), 'public', 'articles');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Clean target directory first
if (fs.existsSync(TARGET_DIR)) {
  fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function copyDirectory(sourceDir, targetDir) {
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Create target directory
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Recursively copy directory contents
      copyDirectory(sourcePath, targetPath);
    } else if (stat.isFile()) {
      // Copy all files (including markdown and images)
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  });
}

console.log('Copying public_articles to public/articles...');
copyDirectory(SOURCE_DIR, TARGET_DIR);
console.log('Article copying completed!');