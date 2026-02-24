const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(process.cwd(), 'public/images/section');
const outputDir = path.join(process.cwd(), 'public/images/optimized');

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = fs.readdirSync(inputDir);

async function optimizeImages() {
  console.log('画像最適化を開始...\n');

  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const ext = path.extname(image).toLowerCase();
    const baseName = path.basename(image, ext);

    // PNGはWebPに変換、JPGはそのまま最適化
    const outputPath = path.join(
      outputDir,
      ext === '.png' ? `${baseName}.webp` : image
    );

    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      if (ext === '.png') {
        // PNG → WebP変換（品質80%、幅最大1920px）
        await sharp(inputPath)
          .resize(1920, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toFile(outputPath);
      } else if (ext === '.jpg' || ext === '.jpeg') {
        // JPEG最適化（品質85%、幅最大1920px）
        await sharp(inputPath)
          .resize(1920, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);
      } else {
        console.log(`SKIP: ${image} - スキップ（未対応形式）`);
        continue;
      }

      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`OK: ${image}`);
      console.log(`   ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)\n`);
    } catch (error) {
      console.error(`ERROR: ${image} -`, error.message);
    }
  }

  console.log('画像最適化完了！');
}

optimizeImages();
