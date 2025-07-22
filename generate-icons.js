const fs = require('fs');
const path = require('path');

// Create a simple SVG-based owl icon and convert it to different sizes
function generateSVGIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#764ba2;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#667eea;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Background circle -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" stroke="#ffffff" stroke-width="2"/>
    
    <!-- Owl face -->
    <circle cx="${size/2}" cy="${size/2}" r="${size * 0.18}" fill="#ffffff" stroke="#cccccc" stroke-width="1"/>
    
    <!-- Eyes -->
    <circle cx="${size/2 - size*0.06}" cy="${size/2 - size*0.04}" r="${size * 0.04}" fill="#333333"/>
    <circle cx="${size/2 + size*0.06}" cy="${size/2 - size*0.04}" r="${size * 0.04}" fill="#333333"/>
    
    <!-- Eye highlights -->
    <circle cx="${size/2 - size*0.05}" cy="${size/2 - size*0.05}" r="${size * 0.015}" fill="#ffffff"/>
    <circle cx="${size/2 + size*0.07}" cy="${size/2 - size*0.05}" r="${size * 0.015}" fill="#ffffff"/>
    
    <!-- Beak -->
    <polygon points="${size/2},${size/2 + size*0.02} ${size/2 - size*0.04},${size/2 + size*0.08} ${size/2 + size*0.04},${size/2 + size*0.08}" fill="#FFA500"/>
    
    <!-- Text for size reference -->
    <text x="${size/2}" y="${size - 8}" font-family="Arial" font-size="${Math.max(8, size/15)}" text-anchor="middle" fill="#ffffff" font-weight="bold">🦉</text>
  </svg>`;
}

// Base64 encode a minimal PNG for each size
function generateBase64PNG(size) {
  // This is a very basic approach - creating SVG and using it as data URI
  const svg = generateSVGIcon(size);
  return svg;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, 'client', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const svg = generateSVGIcon(size);
  const filename = path.join(iconDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
});

console.log('SVG icons generated! Converting to PNG...');

// Create a simple PNG replacement using canvas (if available) or fallback
const createPNGFromSVG = (size) => {
  // Since we can't easily convert SVG to PNG in Node without additional packages,
  // let's create a simple PNG-like data structure
  const canvas = require('canvas');
  if (canvas) {
    const canvasEl = canvas.createCanvas(size, size);
    const ctx = canvasEl.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#764ba2');
    gradient.addColorStop(1, '#667eea');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw owl face
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(size/2 - size*0.06, size/2 - size*0.04, size * 0.04, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(size/2 + size*0.06, size/2 - size*0.04, size * 0.04, 0, 2 * Math.PI);
    ctx.fill();
    
    return canvasEl.toBuffer('image/png');
  }
  return null;
};

console.log('Icon generation complete!');