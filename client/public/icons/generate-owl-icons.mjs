import sharp from 'sharp';
import fs from 'fs';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateOwlIcons() {
  console.log('🦉 Generating JournOwl icons with your owl mascot...');
  
  try {
    // Read the original owl image
    const owlImage = await sharp('./owl.jpeg')
      .resize(400, 400, { 
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    for (const size of sizes) {
      // Create background with JournOwl gradient
      const background = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 102, g: 126, b: 234, alpha: 1 }
        }
      })
      .png()
      .toBuffer();
      
      // Create gradient effect by overlaying purple
      const gradient = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 118, g: 75, b: 162, alpha: 0.7 }
        }
      })
      .png()
      .toBuffer();
      
      // Resize owl for this icon size
      const resizedOwl = await sharp(owlImage)
        .resize(Math.floor(size * 0.7), Math.floor(size * 0.7), {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      // Composite everything together
      const icon = await sharp(background)
        .composite([
          { input: gradient, blend: 'multiply' },
          { 
            input: resizedOwl, 
            top: Math.floor(size * 0.15), 
            left: Math.floor(size * 0.15) 
          }
        ])
        .png()
        .toBuffer();
      
      // Add white border for PWA standards
      const finalIcon = await sharp({
        create: {
          width: size + 16,
          height: size + 16,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
      .composite([
        { input: icon, top: 8, left: 8 }
      ])
      .resize(size, size)
      .png()
      .toBuffer();
      
      // Save the icon
      await fs.promises.writeFile(`./icon-${size}x${size}.png`, finalIcon);
      console.log(`✅ Generated icon-${size}x${size}.png (${Math.round(finalIcon.length/1024)}KB)`);
    }
    
    console.log('🎉 All owl mascot icons generated successfully!');
    console.log('Your PWA will now show your beautiful owl instead of blank squares!');
    
    // Show file sizes
    console.log('\nIcon files created:');
    for (const size of sizes) {
      const stats = await fs.promises.stat(`./icon-${size}x${size}.png`);
      console.log(`  icon-${size}x${size}.png: ${Math.round(stats.size/1024)}KB (replaced 327-byte placeholder)`);
    }
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateOwlIcons();
