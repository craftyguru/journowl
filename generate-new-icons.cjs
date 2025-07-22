const { createCanvas } = require('canvas');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('🦉 Generating JournOwl icons with notepad, pen, and owl design...');
  
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Background circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, size/64);
    ctx.stroke();
    
    // Notepad
    const notepadWidth = size * 0.35;
    const notepadHeight = size * 0.47;
    const notepadX = size * 0.23;
    const notepadY = size * 0.27;
    
    // Notepad shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(notepadX + 4, notepadY + 4, notepadWidth, notepadHeight);
    
    // Notepad background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(notepadX, notepadY, notepadWidth, notepadHeight);
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = Math.max(1, size/256);
    ctx.strokeRect(notepadX, notepadY, notepadWidth, notepadHeight);
    
    // Spiral binding
    const bindingX = notepadX - size * 0.02;
    const bindingWidth = size * 0.025;
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(bindingX, notepadY, bindingWidth, notepadHeight);
    
    // Spiral holes
    ctx.fillStyle = '#6c757d';
    for (let i = 0; i < 6; i++) {
      const holeY = notepadY + size * 0.04 + (i * size * 0.05);
      ctx.beginPath();
      ctx.arc(bindingX + bindingWidth/2, holeY, size * 0.006, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Lines on notepad
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = Math.max(0.5, size/512);
    for (let i = 0; i < 5; i++) {
      const lineY = notepadY + size * 0.08 + (i * size * 0.04);
      ctx.beginPath();
      ctx.moveTo(notepadX + size * 0.04, lineY);
      ctx.lineTo(notepadX + notepadWidth - size * 0.04, lineY);
      ctx.stroke();
    }
    
    // Owl
    const owlX = size * 0.7;
    const owlY = size * 0.39;
    const owlBodySize = size * 0.09;
    const owlHeadSize = size * 0.07;
    
    // Owl body shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(owlX + 2, owlY + 2, owlBodySize, owlBodySize * 1.3, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Owl body
    const owlGradient = ctx.createLinearGradient(owlX - owlBodySize, owlY - owlBodySize, owlX + owlBodySize, owlY + owlBodySize);
    owlGradient.addColorStop(0, '#8B4513');
    owlGradient.addColorStop(0.5, '#A0522D');
    owlGradient.addColorStop(1, '#CD853F');
    
    ctx.fillStyle = owlGradient;
    ctx.beginPath();
    ctx.ellipse(owlX, owlY, owlBodySize, owlBodySize * 1.3, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Owl head shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(owlX + 2, owlY - owlBodySize * 0.8 + 2, owlHeadSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Owl head
    ctx.fillStyle = owlGradient;
    ctx.beginPath();
    ctx.arc(owlX, owlY - owlBodySize * 0.8, owlHeadSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Owl ear tufts
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(owlX - owlHeadSize * 0.7, owlY - owlBodySize * 1.2);
    ctx.lineTo(owlX - owlHeadSize * 0.9, owlY - owlBodySize * 1.6);
    ctx.lineTo(owlX - owlHeadSize * 0.4, owlY - owlBodySize * 1.3);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(owlX + owlHeadSize * 0.4, owlY - owlBodySize * 1.3);
    ctx.lineTo(owlX + owlHeadSize * 0.9, owlY - owlBodySize * 1.6);
    ctx.lineTo(owlX + owlHeadSize * 0.7, owlY - owlBodySize * 1.2);
    ctx.fill();
    
    // Owl eyes
    const eyeSize = size * 0.028;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(owlX - eyeSize * 0.8, owlY - owlBodySize * 0.8, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(owlX + eyeSize * 0.8, owlY - owlBodySize * 0.8, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(owlX - eyeSize * 0.8, owlY - owlBodySize * 0.8, eyeSize * 0.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(owlX + eyeSize * 0.8, owlY - owlBodySize * 0.8, eyeSize * 0.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eye highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(owlX - eyeSize * 0.6, owlY - owlBodySize * 0.9, eyeSize * 0.2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(owlX + eyeSize * 1.0, owlY - owlBodySize * 0.9, eyeSize * 0.2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Owl beak
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(owlX, owlY - owlBodySize * 0.6);
    ctx.lineTo(owlX - eyeSize * 0.4, owlY - owlBodySize * 0.4);
    ctx.lineTo(owlX + eyeSize * 0.4, owlY - owlBodySize * 0.4);
    ctx.fill();
    
    // Owl wing detail
    ctx.fillStyle = '#654321';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(owlX - owlBodySize * 0.6, owlY, owlBodySize * 0.4, owlBodySize * 0.8, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Pen
    const penX = notepadX + notepadWidth * 0.6;
    const penY = notepadY + notepadHeight * 0.75;
    const penLength = size * 0.12;
    const penWidth = size * 0.012;
    
    ctx.save();
    ctx.translate(penX, penY);
    ctx.rotate(Math.PI / 7);
    
    // Pen shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-penWidth/2 + 1, -penLength * 0.8 + 1, penWidth, penLength);
    
    // Pen body
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-penWidth/2, -penLength * 0.8, penWidth, penLength);
    
    // Pen tip
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-penWidth * 0.6, -penLength * 0.9, penWidth * 1.2, penLength * 0.15);
    
    // Pen tip point
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(0, -penLength * 0.85, penWidth * 0.4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
    
    // Simple text on notepad
    ctx.fillStyle = '#667eea';
    const fontSize = Math.max(6, size/42);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText('Dear Journal...', notepadX + size * 0.04, notepadY + size * 0.1);
    
    // Additional text lines
    ctx.fillStyle = '#999999';
    const smallFont = Math.max(5, size/56);
    ctx.font = `${smallFont}px Arial`;
    ctx.fillText('Today was amazing!', notepadX + size * 0.04, notepadY + size * 0.13);
    ctx.fillText('I learned so much', notepadX + size * 0.04, notepadY + size * 0.16);
    
    // Save PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./icon-${size}x${size}.png`, buffer);
    console.log(`✅ Generated icon-${size}x${size}.png (${Math.round(buffer.length/1024)}KB)`);
  }
  
  console.log('🎉 All JournOwl icons generated successfully!');
  console.log('Icons now feature notepad + pen + wise owl design');
  
  // Show file sizes
  console.log('\nGenerated files:');
  sizes.forEach(size => {
    const stats = fs.statSync(`./icon-${size}x${size}.png`);
    console.log(`  icon-${size}x${size}.png: ${Math.round(stats.size/1024)}KB (was 327 bytes)`);
  });
}

generateIcons().catch(console.error);
