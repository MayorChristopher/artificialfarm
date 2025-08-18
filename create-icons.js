// Simple script to create PWA icons
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#093001"/>
  <rect x="16" y="16" width="160" height="160" rx="20" fill="#22c55e"/>
  <text x="96" y="110" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#093001">AFA</text>
  <rect x="40" y="130" width="112" height="4" fill="#093001"/>
  <rect x="60" y="140" width="72" height="2" fill="#093001"/>
</svg>`;

// Convert SVG to base64 data URL for PNG placeholder
const createIconFile = (size, filename) => {
  const canvas = `data:image/svg+xml;base64,${Buffer.from(svgIcon.replace('192', size).replace('192', size)).toString('base64')}`;
  
  // For now, just create a simple HTML file that can be converted
  const htmlContent = `<!DOCTYPE html>
<html>
<head><title>Icon</title></head>
<body style="margin:0;padding:0;background:#093001;">
  <div style="width:${size}px;height:${size}px;background:#22c55e;border-radius:20px;display:flex;align-items:center;justify-content:center;flex-direction:column;">
    <div style="font-family:Arial;font-size:${Math.floor(size/4)}px;font-weight:bold;color:#093001;">AFA</div>
    <div style="width:${Math.floor(size*0.6)}px;height:4px;background:#093001;margin-top:10px;"></div>
    <div style="width:${Math.floor(size*0.4)}px;height:2px;background:#093001;margin-top:5px;"></div>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(__dirname, 'public', filename.replace('.png', '.html')), htmlContent);
};

// Create icon files
createIconFile(192, 'pwa-192x192.png');
createIconFile(512, 'pwa-512x512.png');

console.log('Icon templates created!');