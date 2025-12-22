const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  try {
    const svgPath = path.join(__dirname, '..', 'public', 'og-image.svg');
    const pngPath = path.join(__dirname, '..', 'public', 'og-image.png');

    const svgBuffer = fs.readFileSync(svgPath);

    // Generate 1200x630 PNG (optimal for OG images)
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);

    console.log('✅ Generated og-image.png (1200x630)');
    console.log('   Perfect for social media previews!');
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
