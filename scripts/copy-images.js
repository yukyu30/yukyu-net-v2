#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'public_articles');
const TARGET_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Clean target directory first
const existingFiles = fs.readdirSync(TARGET_DIR);
existingFiles.forEach(file => {
  const filePath = path.join(TARGET_DIR, file);
  if (fs.statSync(filePath).isDirectory()) {
    fs.rmSync(filePath, { recursive: true, force: true });
  } else {
    fs.unlinkSync(filePath);
  }
});

function copyImages(sourceDir, targetSubDir = '') {
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Skip 'me' and 'privacy-policy' directories
      if (['me', 'privacy-policy'].includes(item)) {
        return;
      }
      
      // Create target subdirectory
      const newTargetSubDir = path.join(targetSubDir, item);
      const targetDirPath = path.join(TARGET_DIR, newTargetSubDir);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      
      // Recursively copy images from subdirectory
      copyImages(sourcePath, newTargetSubDir);
    } else if (stat.isFile()) {
      // Check if it's an image file
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        const targetPath = path.join(TARGET_DIR, targetSubDir, item);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied: ${sourcePath} -> ${targetPath}`);
      }
    }
  });
}

console.log('Copying images from public_articles to public/images...');
copyImages(SOURCE_DIR);
console.log('Image copying completed!');