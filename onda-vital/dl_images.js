const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { url: 'https://static.wixstatic.com/media/dd0fe1_1353de69ec444011a0e951c884f25c06~mv2_d_2560_1920_s_2.jpg', name: 'sala-jardin-real.jpg' },
  { url: 'https://static.wixstatic.com/media/dd0fe1_b8336d366a7743419370aaf1f15a9a59~mv2_d_2896_1944_s_2.jpg', name: 'sala-azul-real.jpg' },
  { url: 'https://static.wixstatic.com/media/dd0fe1_11489ea3acaf405a946be4463a38337a~mv2.jpg', name: 'despacho-plus-real.jpg' },
  { url: 'https://static.wixstatic.com/media/dd0fe1_f62054550c1d4e8e8ec75207f5174593~mv2.jpg', name: 'sala-terapia-a-real.jpg' },
  { url: 'https://static.wixstatic.com/media/dd0fe1_b0e2eb30e9c94bddaabce7379d8e0d75~mv2.jpg', name: 'sala-terapia-b-real.jpg' }
];

const destDir = path.join(__dirname, 'public', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

images.forEach(img => {
  const file = fs.createWriteStream(path.join(destDir, img.name));
  https.get(img.url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(); 
      console.log('Downloaded: ' + img.name);
    });
  }).on('error', function(err) {
    fs.unlink(path.join(destDir, img.name), () => {});
    console.error('Error downloading: ' + img.name, err.message);
  });
});
