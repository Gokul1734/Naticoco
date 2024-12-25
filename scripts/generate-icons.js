const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = {
  ios: [
    { size: 20, scales: [2, 3] },
    { size: 29, scales: [2, 3] },
    { size: 40, scales: [2, 3] },
    { size: 60, scales: [2, 3] },
    { size: 76, scales: [2] },
    { size: 83.5, scales: [2] },
    { size: 1024, scales: [1] }
  ],
  android: [
    { size: 36, scales: [1] },  // ldpi
    { size: 48, scales: [1] },  // mdpi
    { size: 72, scales: [1] },  // hdpi
    { size: 96, scales: [1] },  // xhdpi
    { size: 144, scales: [1] }, // xxhdpi
    { size: 192, scales: [1] }  // xxxhdpi
  ]
};

async function generateIcons() {
  const sourceIcon = path.join(__dirname, '../assets/images/app-icon.png');
  
  // Check if source icon exists
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found:', sourceIcon);
    return;
  }

  // Create output directories
  const outputDir = path.join(__dirname, '../assets/icons');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate iOS icons
  for (const platform of ['ios', 'android']) {
    const platformDir = path.join(outputDir, platform);
    if (!fs.existsSync(platformDir)) {
      fs.mkdirSync(platformDir, { recursive: true });
    }

    for (const { size, scales } of ICON_SIZES[platform]) {
      for (const scale of scales) {
        const finalSize = Math.round(size * scale);
        const fileName = platform === 'ios' 
          ? `icon-${size}@${scale}x.png`
          : `icon-${finalSize}.png`;

        await sharp(sourceIcon)
          .resize(finalSize, finalSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .toFile(path.join(platformDir, fileName));

        console.log(`Generated ${platform} icon:`, fileName);
      }
    }
  }

  // Generate adaptive icon for Android
  if (fs.existsSync(path.join(__dirname, '../assets/images/adaptive-icon.png'))) {
    await sharp(path.join(__dirname, '../assets/images/adaptive-icon.png'))
      .resize(432, 432)
      .toFile(path.join(outputDir, 'android', 'adaptive-icon.png'));
    
    console.log('Generated Android adaptive icon');
  }
}

generateIcons().catch(console.error); 