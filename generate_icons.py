#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont
import math

def create_owl_icon(size):
    # Create a square image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors for JournOwl branding
    purple = (118, 75, 162)  # #764ba2
    blue = (102, 126, 234)   # #667eea
    white = (255, 255, 255)
    orange = (255, 165, 0)
    
    # Create gradient background
    for y in range(size):
        # Gradient from purple to blue
        ratio = y / size
        r = int(purple[0] * (1 - ratio) + blue[0] * ratio)
        g = int(purple[1] * (1 - ratio) + blue[1] * ratio)
        b = int(purple[2] * (1 - ratio) + blue[2] * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Scale factors based on size
    scale = size / 192.0
    
    # Owl body (oval)
    body_width = int(120 * scale)
    body_height = int(140 * scale)
    body_x = (size - body_width) // 2
    body_y = int(30 * scale)
    draw.ellipse([body_x, body_y, body_x + body_width, body_y + body_height], 
                 fill=white, outline=(200, 200, 200), width=2)
    
    # Owl head (circle)
    head_size = int(80 * scale)
    head_x = (size - head_size) // 2
    head_y = int(20 * scale)
    draw.ellipse([head_x, head_y, head_x + head_size, head_y + head_size], 
                 fill=white, outline=(200, 200, 200), width=2)
    
    # Eyes
    eye_size = int(20 * scale)
    eye_y = int(40 * scale)
    left_eye_x = int((size / 2) - (25 * scale))
    right_eye_x = int((size / 2) + (5 * scale))
    
    # Eye whites
    draw.ellipse([left_eye_x, eye_y, left_eye_x + eye_size, eye_y + eye_size], fill=white, outline=(150, 150, 150))
    draw.ellipse([right_eye_x, eye_y, right_eye_x + eye_size, eye_y + eye_size], fill=white, outline=(150, 150, 150))
    
    # Eye pupils
    pupil_size = int(12 * scale)
    pupil_offset = int(4 * scale)
    draw.ellipse([left_eye_x + pupil_offset, eye_y + pupil_offset, 
                  left_eye_x + pupil_offset + pupil_size, eye_y + pupil_offset + pupil_size], fill=(50, 50, 50))
    draw.ellipse([right_eye_x + pupil_offset, eye_y + pupil_offset, 
                  right_eye_x + pupil_offset + pupil_size, eye_y + pupil_offset + pupil_size], fill=(50, 50, 50))
    
    # Beak
    beak_size = int(15 * scale)
    beak_x = size // 2
    beak_y = int(65 * scale)
    beak_points = [
        (beak_x, beak_y),
        (beak_x - beak_size//2, beak_y + beak_size),
        (beak_x + beak_size//2, beak_y + beak_size)
    ]
    draw.polygon(beak_points, fill=orange)
    
    # Wings
    wing_width = int(40 * scale)
    wing_height = int(60 * scale)
    left_wing_x = body_x - int(10 * scale)
    right_wing_x = body_x + body_width - int(30 * scale)
    wing_y = int(60 * scale)
    
    draw.ellipse([left_wing_x, wing_y, left_wing_x + wing_width, wing_y + wing_height], 
                 fill=(240, 240, 240), outline=(180, 180, 180))
    draw.ellipse([right_wing_x, wing_y, right_wing_x + wing_width, wing_y + wing_height], 
                 fill=(240, 240, 240), outline=(180, 180, 180))
    
    return img

# Generate all required icon sizes
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    icon = create_owl_icon(size)
    filename = f"client/public/icons/icon-{size}x{size}.png"
    icon.save(filename, "PNG", quality=95)
    print(f"Generated {filename}")

print("All PWA icons generated successfully!")