import chokidar from 'chokidar';
import { exec } from 'child_process';

const imagesDir = './src/assets/images';

const watcher = chokidar.watch(imagesDir, {
  ignored: /converted/,
  persistent: true,
});

watcher.on('add', (filePath) => {
  console.log(`New image added: ${filePath}`);
  exec('npm run convert-images', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error running convert-images: ${err}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});

console.log(`Watching ${imagesDir} for new images...`);
