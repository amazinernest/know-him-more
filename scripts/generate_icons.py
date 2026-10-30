from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("../public", exist_ok=True)

def create_icon(size, path):
    img = Image.new("RGBA", (size, size), (180, 83, 9, 255)) # Warm amber (#B45309)
    draw = ImageDraw.Draw(img)
    
    # Draw warm inner circle
    margin = int(size * 0.08)
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(251, 249, 245, 255))
    
    # Draw book / Bible silhouette
    cx, cy = size // 2, size // 2
    bw = int(size * 0.44)
    bh = int(size * 0.36)
    
    # Left page & Right page
    draw.rounded_rectangle([cx - bw, cy - bh//2, cx - 2, cy + bh//2], radius=int(size*0.03), fill=(180, 83, 9, 255))
    draw.rounded_rectangle([cx + 2, cy - bh//2, cx + bw, cy + bh//2], radius=int(size*0.03), fill=(180, 83, 9, 255))
    
    # Center golden cross
    cw = int(size * 0.05)
    ch = int(size * 0.22)
    draw.rectangle([cx - cw//2, cy - ch//2, cx + cw//2, cy + ch//2], fill=(245, 158, 11, 255))
    draw.rectangle([cx - ch//3, cy - ch//6, cx + ch//3, cy - ch//6 + cw], fill=(245, 158, 11, 255))

    img.save(path, "PNG")
    print(f"Generated icon: {path} ({size}x{size})")

create_icon(192, "../public/icon-192.png")
create_icon(512, "../public/icon-512.png")

