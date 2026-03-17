const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets', 'images');
const images = [
  'sala-jardin-real.jpg',
  'sala-azul-real.jpg',
  'despacho-plus-real.jpg',
  'sala-terapia-a-real.jpg',
  'sala-terapia-b-real.jpg'
];

async function enhanceImages() {
  for (const img of images) {
    const inputPath = path.join(dir, img);
    if (!fs.existsSync(inputPath)) {
      console.log(`Missing ${img}`);
      continue;
    }
    const outputPath = path.join(dir, img.replace('-real.jpg', '-enhanced.jpg'));
    
    try {
      await sharp(inputPath)
        .modulate({
          brightness: 1.15,   // 15% brighter
          saturation: 1.25,   // 25% more colorful
        })
        .sharpen({
          sigma: 1.2,
          m1: 0.5,
          m2: 2.5
        })
        .jpeg({ quality: 90 }) // High quality
        .toFile(outputPath);
      console.log('Enhanced:', outputPath);
    } catch (err) {
      console.error('Error enhancing', img, err);
    }
  }
}

enhanceImages();
