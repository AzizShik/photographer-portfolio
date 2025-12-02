import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('./src/assets/images');
const outputDir = path.resolve('./src/assets/images/converted/');

const supportedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'];

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(outputDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (['.webp', '.avif'].includes(ext)) {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

fs.readdirSync(inputDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (!supportedExtensions.includes(ext)) {
    console.log(`Skipping unsupported file: ${file}`);
    return;
  }

  const inputPath = path.join(inputDir, file);
  const name = path.parse(file).name;

  sharp(inputPath)
    .webp({ quality: 90 })
    .toFile(path.join(outputDir, `${name}.webp`));

  sharp(inputPath)
    .avif({ quality: 90 })
    .toFile(path.join(outputDir, `${name}.avif`));
});

console.log('WebP and AVIF images generated!');
