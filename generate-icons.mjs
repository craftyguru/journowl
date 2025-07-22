import fs from 'fs';
import { createCanvas } from 'canvas';

function generateOwlIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // JournOwl gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#764ba2');
  gradient.addColorStop(1, '#667eea');
  
  // Fill background circle
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // White border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Owl face (white circle)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 0.25, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Left eye
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(size/2 - size*0.08, size/2 - size*0.06, size * 0.05, 0, 2 * Math.PI);
  ctx.fill();
  
  // Right eye
  ctx.beginPath();
  ctx.arc(size/2 + size*0.08, size/2 - size*0.06, size * 0.05, 0, 2 * Math.PI);
  ctx.fill();
  
  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size/2 - size*0.07, size/2 - size*0.08, size * 0.02, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(size/2 + size*0.09, size/2 - size*0.08, size * 0.02, 0, 2 * Math.PI);
  ctx.fill();
  
  // Beak
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.moveTo(size/2, size/2 + size*0.02);
  ctx.lineTo(size/2 - size*0.05, size/2 + size*0.12);
  ctx.lineTo(size/2 + size*0.05, size/2 + size*0.12);
  ctx.closePath();
  ctx.fill();
  
  // Add small text indicator
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.max(12, size/16)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('🦉', size/2, size - 8);
  
  return canvas;
}

console.log('Generating PWA icons with canvas...');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  try {
    const canvas = generateOwlIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = `client/public/icons/icon-${size}x${size}.png`;
    fs.writeFileSync(filename, buffer);
    console.log(`Generated ${filename} (${buffer.length} bytes)`);
  } catch (error) {
    console.error(`Error generating icon ${size}x${size}:`, error.message);
  }
}

console.log('PWA icons generation complete!');