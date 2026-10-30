const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Syncing Know Him More web assets to Mobile App...');

const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');

// Ensure www exists
if (!fs.existsSync(www)) {
  fs.mkdirSync(www, { recursive: true });
}

// Copy runtime files
const copyList = [
  { src: 'index.html', dest: 'index.html' },
  { src: 'manifest.json', dest: 'manifest.json' },
  { src: 'sw.js', dest: 'sw.js' },
  { src: 'src', dest: 'src' },
  { src: 'public', dest: 'public' }
];

copyList.forEach(item => {
  const srcPath = path.join(root, item.src);
  const destPath = path.join(www, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
});

// Copy data files
const dataDest = path.join(www, 'data');
if (!fs.existsSync(dataDest)) {
  fs.mkdirSync(dataDest, { recursive: true });
}

['plan365.json', 'plan365.js', 'days_content.js', 'days_content.json', 'days_1_to_365.json'].forEach(f => {
  const sf = path.join(root, 'data', f);
  const df = path.join(dataDest, f);
  if (fs.existsSync(sf)) {
    fs.copyFileSync(sf, df);
  }
});

console.log('✅ Web assets copied to www/');

// Run Capacitor copy
try {
  console.log('📱 Syncing to native Android assets...');
  execSync('npx cap copy android', { stdio: 'inherit', cwd: root });
  console.log('🎉 Sync complete!');
} catch (e) {
  console.error('Error syncing with capacitor:', e.message);
}
